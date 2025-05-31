import React, { useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { createPost, getPosts, toggleLike, addComment, deletePost, incrementPostView } from '../../store/services/postAction';
import { FaHeart, FaRegHeart, FaComment, FaEye, FaShare, FaTrash, FaPlus } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import ShareModal from '../../components/ShareModal';

const Community = () => {
  const { register, handleSubmit, reset, watch } = useForm();
  const dispatch = useDispatch();
  const [createPostModal, setCreatePostModal] = useState(false);
  const [commentingOnPost, setCommentingOnPost] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [sharingPost, setSharingPost] = useState(null);
  const postRefs = useRef({});
  const posts = useSelector(state => state.post.posts);
  const loading = useSelector(state => state.post.loading);
  const user = useSelector(state => state.user.userInfo);

  // Watch the image file input to show preview
  const selectedImage = watch("image");
  
  useEffect(() => {
    // Create URL for image preview when file is selected
    if (selectedImage && selectedImage.length > 0) {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setImagePreview(fileReader.result);
      };
      fileReader.readAsDataURL(selectedImage[0]);
    } else {
      setImagePreview(null);
    }
  }, [selectedImage]);

  const handleCreatePost = async (data) => {
    try {
      if (!user) {
        toast.warning("Please login to create a post");
        return;
      }
      
      await dispatch(createPost({
        content: data.content,
        _id: user._id,
        image: data.image && data.image.length > 0 ? data.image[0] : null
      }));
      
      // Reset all states properly
      toast.success("Post created successfully");
      setCreatePostModal(false);
      setImagePreview(null);
      reset({ content: "", image: "" });
      
      // Refresh the posts
      dispatch(getPosts());
    } catch (error) {
      toast.error("Failed to create post");
      console.error(error);
    }
  };

  const handleToggleLike = (postId) => {
    if (!user) {
      toast.warning("Please login to like posts");
      return;
    }
    
    // Find the post in the current state
    const targetPost = posts.find(post => post._id === postId);
    if (!targetPost) return;
    
    // Determine current like status
    const isCurrentlyLiked = isPostLikedByUser(targetPost);
    
    // Dispatch an immediate optimistic update to Redux
    dispatch({
      type: 'post/optimisticLikeToggle',
      payload: {
        postId,
        userId: user._id,
        isLiked: isCurrentlyLiked
      }
    });
    
    // Then dispatch the API call
    dispatch(toggleLike(postId));
  };

  const handleAddComment = async (data, postId) => {
    try {
      if (!user) {
        toast.warning("Please login to comment");
        return;
      }
      
      const result = await dispatch(addComment({
        postId,
        content: data.commentContent
      }));
      
      if (!result.error) {
        toast.success("Comment added successfully");
        setCommentingOnPost(null);
        reset();
        // No need to fetch the post again, the redux store is already updated
      }
    } catch (error) {
      toast.error("Failed to add comment");
      console.error(error);
    }
  };
  
  const handleDeletePost = async (postId) => {
    try {
      if (window.confirm("Are you sure you want to delete this post? This action cannot be undone.")) {
        await dispatch(deletePost(postId));
        toast.success("Post deleted successfully");
      }
    } catch (error) {
      toast.error("Failed to delete post");
      console.error(error);
    }
  };

  // Fetch posts on component mount
  useEffect(() => {
    dispatch(getPosts(page, 10)); // Modified to accept page and limit parameters
  }, [dispatch, page]);

  // Setup intersection observer for post visibility tracking
  useEffect(() => {
    // Skip if no user (no need to track views for logged-out users)
    if (!posts.length || !user) return;
    
    // Create an observer that will detect when posts become visible
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          // When a post becomes visible in the viewport
          if (entry.isIntersecting) {
            const postId = entry.target.dataset.postid;
            if (!postId) return;
            
            // Check if this post has already been viewed by this user
            const viewedPosts = JSON.parse(localStorage.getItem('viewedPosts') || '{}');
            
            if (!viewedPosts[postId]) {
              // Mark as viewed to prevent duplicate view counts
              viewedPosts[postId] = true;
              localStorage.setItem('viewedPosts', JSON.stringify(viewedPosts));
              
              // Increment view count in the backend
              dispatch(incrementPostView(postId));
              
              // Stop observing this post once it's been viewed
              observer.unobserve(entry.target);
            }
          }
        });
      },
      { threshold: 0.5 } // Post is considered "viewed" when 50% visible
    );
    
    // Observe all post elements
    Object.keys(postRefs.current).forEach(postId => {
      const element = postRefs.current[postId];
      if (element) {
        observer.observe(element);
      }
    });
    
    // Cleanup observer when component unmounts
    return () => {
      observer.disconnect();
    };
  }, [posts, dispatch, user]);
  
  // Handle load more
  const handleLoadMore = () => {
    setPage(prevPage => prevPage + 1);
  };

  const isPostLikedByUser = (post) => {
    if (!user || !post.likes) return false;
    return post.likes.some(like => like._id === user._id);
  };

  // Create Post Button component - always visible
  const CreatePostButton = () => (
    <button 
      onClick={() => setCreatePostModal(true)}
      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center"
    >
      <span className="mr-2">Create Post</span>
      <span className="text-xl">+</span>
    </button>
  );

  // Add this floating action button component
  const FloatingCreateButton = () => (
    <button
      onClick={() => setCreatePostModal(true)}
      className="fixed bottom-20 right-8 bg-green-600 hover:bg-green-700 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg z-20"
      aria-label="Create new post"
    >
      <FaPlus size={20} />
    </button>
  );

  // Add a function to handle sharing
  const handleSharePost = (post) => {
    setSharingPost(post);
    setShareModalOpen(true);
  };

  return (
    <div className="container mx-auto px-4 pt-24 pb-20 relative min-h-screen">
      {/* Simple header with Create Post button */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-slate-800">Community</h1>
          {/* <CreatePostButton /> */}
        </div>
      </div>
      
      {/* Post creation modal */}
      {createPostModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Create a Post</h2>
              <button 
                onClick={() => {
                  setCreatePostModal(false);
                  setImagePreview(null);
                  reset();
                }}
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                &times;
              </button>
            </div>
            
            <form onSubmit={handleSubmit(handleCreatePost)}>
              <div className="mb-4">
                <label htmlFor="content" className="block text-gray-700 font-medium mb-2">Content</label>
                <textarea
                  id="content"
                  {...register('content', { required: true })}
                  className="w-full border border-gray-300 p-3 rounded-lg min-h-[100px]"
                  placeholder="What's on your mind?"
                ></textarea>
              </div>
              
              <div className="mb-4">
                <label htmlFor="image" className="block text-gray-700 font-medium mb-2">Image (optional)</label>
                <input
                  type="file"
                  id="image"
                  accept="image/*"
                  {...register('image')}
                  className="w-full border border-gray-300 p-2 rounded-lg"
                />
                
                {imagePreview && (
                  <div className="mt-3 border rounded-lg overflow-hidden">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="max-h-[200px] w-auto mx-auto" 
                    />
                  </div>
                )}
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg w-full"
              >
                {loading ? 'Posting...' : 'Post'}
              </button>
            </form>
          </div>
        </div>
      )}
      
      {/* Posts feed */}
      <div className="space-y-8">
        {loading && posts.length === 0 ? (
          <div className="text-center py-8">Loading posts...</div>
        ) : posts.length > 0 ? (
          <>
            {posts.map((post) => (
              <div 
                key={post._id} 
                ref={el => postRefs.current[post._id] = el}
                data-postid={post._id}
                className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200"
              >
                {/* Post header with delete button */}
                <div className="flex items-center p-4 border-b justify-between">
                  <div className="flex items-center">
                    <img 
                      src={post.user?.avatar || '/default-avatar.png'} 
                      alt={post.user?.username}
                      className="w-10 h-10 rounded-full mr-3 object-cover"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-800">{post.user?.fullname || post.user?.username}</h3>
                      <p className="text-sm text-gray-500">
                        {post.createdAt && formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                  
                  {/* Delete button - only visible for post creator */}
                  {user && post.user && user._id === post.user._id && (
                    <button 
                      onClick={() => handleDeletePost(post._id)} 
                      className="text-gray-500 hover:text-red-500 p-1"
                      title="Delete post"
                    >
                      <FaTrash />
                    </button>
                  )}
                </div>
                
                {/* Post content */}
                <div className="p-4">
                  <p className="text-gray-800 mb-3">{post.content}</p>
                  
                  {/* Post image - add this block */}
                  {post.image && (
                    <div className="mb-3 rounded-lg overflow-hidden">
                      <img 
                        src={post.image} 
                        alt="Post attachment" 
                        className="w-full h-auto max-h-[400px] object-contain"
                        onError={(e) => {
                          console.error("Image failed to load:", e);
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>
                
                {/* Post stats */}
                <div className="px-4 py-2 bg-gray-50 text-sm text-gray-500 flex items-center space-x-4">
                  <span>{post.likes?.length || 0} likes</span>
                  <span>{post.comments?.length || 0} comments</span>
                  <span className="flex items-center">
                    <FaEye className="mr-1" /> 
                    {post.viewCount || 0} views
                  </span>
                </div>
                
                {/* Post actions */}
                <div className="flex border-t border-gray-200">
                  <button 
                    onClick={() => handleToggleLike(post._id)}
                    className="flex-1 py-3 flex justify-center items-center hover:bg-gray-50"
                  >
                    {isPostLikedByUser(post) ? (
                      <FaHeart className="mr-2 text-red-500" />
                    ) : (
                      <FaRegHeart className="mr-2 text-gray-500" />
                    )}
                    <span>{isPostLikedByUser(post) ? 'Liked' : 'Like'}</span>
                  </button>
                  
                  <button 
                    onClick={() => setCommentingOnPost(post._id === commentingOnPost ? null : post._id)}
                    className="flex-1 py-3 flex justify-center items-center hover:bg-gray-50"
                  >
                    <FaComment className="mr-2 text-gray-500" />
                    <span>Comment</span>
                  </button>
                  
                  <button 
                    onClick={() => handleSharePost(post)} 
                    className="flex-1 py-3 flex justify-center items-center hover:bg-gray-50"
                  >
                    <FaShare className="mr-2 text-gray-500" />
                    <span>Share</span>
                  </button>
                </div>
                
                {/* Show comments if any */}
                {post.comments?.length > 0 && (
                  <div className="p-4 bg-gray-50 border-t border-gray-200">
                    <h4 className="font-medium text-gray-700 mb-3">Comments</h4>
                    <div className="space-y-4">
                      {post.comments.slice(0, 3).map((comment, index) => (
                        <div key={index} className="flex">
                          <img 
                            src={comment.user?.avatar || '/default-avatar.png'} 
                            alt={comment.user?.username || 'User'}
                            className="w-8 h-8 rounded-full mr-2 object-cover bg-gray-200"
                            onError={(e) => {
                              e.target.src = '/default-avatar.png';
                              e.target.onerror = null;
                            }}
                          />
                          <div className="bg-white p-3 rounded-lg flex-1">
                            <div className="font-medium text-gray-800">{comment.user?.username}</div>
                            <p className="text-gray-700">{comment.content}</p>
                          </div>
                        </div>
                      ))}
                      
                      {post.comments.length > 3 && (
                        <Link to={`/post/${post._id}`} className="text-green-600 block text-center">
                          View all {post.comments.length} comments
                        </Link>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Comment form */}
                {commentingOnPost === post._id && (
                  <div className="p-4 bg-gray-50 border-t border-gray-200">
                    <form onSubmit={handleSubmit(data => handleAddComment(data, post._id))}>
                      <div className="flex">
                        <img 
                          src={user?.avatar || '/default-avatar.png'} 
                          alt={user?.username} 
                          className="w-8 h-8 rounded-full mr-2"
                        />
                        <div className="flex-1">
                          <textarea
                            {...register('commentContent', { required: true })}
                            className="w-full border border-gray-300 p-2 rounded-lg"
                            placeholder="Write a comment..."
                            rows={2}
                          ></textarea>
                          <div className="flex justify-end mt-2">
                            <button
                              type="button"
                              onClick={() => setCommentingOnPost(null)}
                              className="px-4 py-1 text-gray-600 mr-2"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              className="px-4 py-1 bg-green-600 hover:bg-green-700 text-white rounded"
                            >
                              Comment
                            </button>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            ))}
            
            {/* Load more button */}
            {hasMore && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={handleLoadMore}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg shadow transition-colors"
                  disabled={loading}
                >
                  {loading ? 'Loading...' : 'Load More Posts'}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-8 bg-white rounded-lg shadow">
            <p className="text-gray-600 mb-4">No posts yet. Be the first to share something!</p>
            <CreatePostButton />
          </div>
        )}
      </div>
      
      {/* Add this spacer div to ensure content doesn't get hidden behind footer */}
      <div className="h-16"></div>
      
      {/* Floating button */}
      <FloatingCreateButton />
      
      {/* Add the ShareModal component */}
      {sharingPost && (
        <ShareModal 
          isOpen={shareModalOpen} 
          onClose={() => setShareModalOpen(false)}
          postId={sharingPost._id}
          title={sharingPost.content?.substring(0, 50)} // Use first 50 chars as title
        />
      )}
    </div>
  );
};

export default Community;