import { createSlice } from '@reduxjs/toolkit';
import { 
  getPosts, 
  createPost, 
  getPostById, 
  toggleLike, 
  addComment, 
  getComments 
} from '../services/postAction';

const initialState = {
  status: false,
  posts: [],
  currentPost: null,
  loading: false,
  error: null
};

const postSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    clearCurrentPost: (state) => {
      state.currentPost = null;
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
        state.posts = action.payload;
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
        state.currentPost = action.payload.data;
        state.status = true;
      })
      .addCase(getPostById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.status = false;
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
        const { postId, data } = action.payload;
        
        // Update the post in the posts array
        state.posts = state.posts.map(post => {
          if (post._id === postId) {
            return {
              ...post,
              likes: data.liked 
                ? [...(post.likes || []), state.currentUser] 
                : (post.likes || []).filter(like => like._id !== state.currentUser._id)
            };
          }
          return post;
        });
        
        // Update currentPost if it exists and matches
        if (state.currentPost && state.currentPost._id === postId) {
          state.currentPost = {
            ...state.currentPost,
            likes: data.liked 
              ? [...(state.currentPost.likes || []), state.currentUser] 
              : (state.currentPost.likes || []).filter(like => like._id !== state.currentUser._id)
          };
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
        
        // Update the post in the posts array
        state.posts = state.posts.map(post => {
          if (post._id === postId) {
            return {
              ...post,
              comments: [...(post.comments || []), data]
            };
          }
          return post;
        });
        
        // Update currentPost if it exists and matches
        if (state.currentPost && state.currentPost._id === postId) {
          state.currentPost = {
            ...state.currentPost,
            comments: [...(state.currentPost.comments || []), data]
          };
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
      });
  }
});

export const { clearCurrentPost } = postSlice.actions;
export default postSlice.reducer;