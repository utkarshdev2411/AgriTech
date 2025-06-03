import { createSlice } from '@reduxjs/toolkit';
import { 
  getPosts, 
  createPost, 
  getPostById, 
  toggleLike, 
  addComment, 
  getComments,
  deletePost,
  incrementPostView
} from '../services/postAction';

const initialState = {
  status: false,
  posts: [],
  currentPost: null,
  loading: false,
  error: null,
  hasMore: true, // New field to track if more posts can be loaded
  currentPage: 1,  // Track the current page
  currentTopic: 'All Posts'  // Default topic is "All Posts"
};

const postSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    clearCurrentPost: (state) => {
      state.currentPost = null;
    },
    updateCurrentPost: (state, action) => {
      state.currentPost = action.payload;
    },
    setCurrentTopic: (state, action) => {
      state.currentTopic = action.payload;
      state.currentPage = 1; // Reset to page 1 when changing topics
    }
  },
  extraReducers: (builder) => {
    builder
      // Get Posts
      .addCase(getPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPosts.fulfilled, (state, action) => {
        state.loading = false;
        
        // If it's the first page or if the topic has changed, replace posts array
        // Otherwise append to existing posts
        if (action.payload.page === 1) {
          state.posts = action.payload.posts;
        } else {
          state.posts = [...state.posts, ...action.payload.posts];
        }
        
        // Store the topic if provided
        if (action.payload.topic) {
          state.currentTopic = action.payload.topic;
        }
        
        state.hasMore = action.payload.hasMore;
        state.currentPage = action.payload.page;
        state.status = true;
      })
      .addCase(getPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.status = false;
      })
      
      // Get Post By Id
      .addCase(getPostById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPostById.fulfilled, (state, action) => {
        state.loading = false;
        const { postId, data } = action.payload;
        
        // Always set the currentPost regardless of previous state
        state.currentPost = data;
        
        // Also update in the posts array if it exists there
        state.posts = state.posts.map(post => {
          if (post._id === postId) {
            return data;
          }
          return post;
        });
      })
      .addCase(getPostById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create Post
      .addCase(createPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.loading = false;
        state.status = true;
        // Add the new post to the posts array if it exists
        if (state.posts.length > 0) {
          state.posts = [action.payload.data, ...state.posts];
        }
      })
      .addCase(createPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.status = false;
      })
      
      // Toggle Like
      .addCase(toggleLike.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleLike.fulfilled, (state, action) => {
        state.loading = false;
        // No need to update the likes array here since we already did it optimistically
        // Just update any other fields from the API response if needed
        
        // If you want to ensure data consistency with the server:
        const { postId, data } = action.payload;
        if (data && data.post && data.post.likes) {
          // Get the full post data from API response
          state.posts = state.posts.map(post => {
            if (post._id === postId) {
              return {
                ...post,
                likes: data.post.likes  // Use server data for likes array
              };
            }
            return post;
          });
          
          // Update currentPost if needed
          if (state.currentPost && state.currentPost._id === postId) {
            state.currentPost = {
              ...state.currentPost,
              likes: data.post.likes  // Use server data
            };
          }
        }
      })
      .addCase(toggleLike.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Add Comment
      .addCase(addComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addComment.fulfilled, (state, action) => {
        state.loading = false;
        const { postId, data } = action.payload;
        
        // Use the full post data returned from the API
        if (data && data.fullPost) {
          // Update the post in the posts array with the fully populated post
          state.posts = state.posts.map(post => {
            if (post._id === postId) {
              return data.fullPost;
            }
            return post;
          });
          
          // Update currentPost if it exists and matches
          if (state.currentPost && state.currentPost._id === postId) {
            state.currentPost = data.fullPost;
          }
        } else {
          // Fallback to old behavior if fullPost isn't available
          state.posts = state.posts.map(post => {
            if (post._id === postId) {
              return {
                ...post,
                comments: [...(post.comments || []), data.newComment || data]
              };
            }
            return post;
          });
          
          if (state.currentPost && state.currentPost._id === postId) {
            state.currentPost = {
              ...state.currentPost,
              comments: [...(state.currentPost.comments || []), data.newComment || data]
            };
          }
        }
      })
      .addCase(addComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Get Comments
      .addCase(getComments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getComments.fulfilled, (state, action) => {
        state.loading = false;
        const { postId, data } = action.payload;
        
        // Update the post in the posts array
        state.posts = state.posts.map(post => {
          if (post._id === postId) {
            return {
              ...post,
              comments: data
            };
          }
          return post;
        });
        
        // Update currentPost if it exists and matches
        if (state.currentPost && state.currentPost._id === postId) {
          state.currentPost = {
            ...state.currentPost,
            comments: data
          };
        }
      })
      .addCase(getComments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Delete Post
      .addCase(deletePost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.loading = false;
        // Remove the deleted post from posts array
        state.posts = state.posts.filter(post => post._id !== action.payload.postId);
        // Clear currentPost if it was the deleted post
        if (state.currentPost && state.currentPost._id === action.payload.postId) {
          state.currentPost = null;
        }
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Optimistic Like Toggle
      .addCase('post/optimisticLikeToggle', (state, action) => {
        const { postId, userId, isLiked } = action.payload;
        
        state.posts = state.posts.map(post => {
          if (post._id === postId) {
            return {
              ...post,
              likes: isLiked
                ? post.likes.filter(like => like._id !== userId)
                : [...(post.likes || []), { _id: userId }]
            };
          }
          return post;
        });
        
        // Also update currentPost if it exists
        if (state.currentPost && state.currentPost._id === postId) {
          state.currentPost = {
            ...state.currentPost,
            likes: isLiked
              ? state.currentPost.likes.filter(like => like._id !== userId)
              : [...(state.currentPost.likes || []), { _id: userId }]
          };
        }
      })
      
      // Increment Post View
      .addCase(incrementPostView.pending, (state) => {
        // No need to set loading state for view increments
      })
      .addCase(incrementPostView.fulfilled, (state, action) => {
        const { postId, data } = action.payload;
        
        // Update the post in the posts array
        state.posts = state.posts.map(post => {
          if (post._id === postId) {
            return {
              ...post,
              viewCount: data.viewCount
            };
          }
          return post;
        });
        
        // Also update currentPost if it exists
        if (state.currentPost && state.currentPost._id === postId) {
          state.currentPost = {
            ...state.currentPost,
            viewCount: data.viewCount
          };
        }
      })
      .addCase(incrementPostView.rejected, (state, action) => {
        // No need to handle view increment failures in the UI
      });
  }
});

export const { clearCurrentPost, updateCurrentPost, setCurrentTopic } = postSlice.actions;
export default postSlice.reducer;