import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getPostById, toggleLike, addComment, incrementPostView } from '../../store/services/postAction';
import { updateCurrentPost } from '../../store/features/postSlice'; // Add this import
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { FaHeart, FaRegHeart, FaComment, FaEye, FaShare, FaArrowLeft } from 'react-icons/fa';
import { formatDistanceToNow } from 'date-fns';
import ShareModal from '../../components/ShareModal';

const PostDetail = () => {
  const { postId } = useParams();
  const dispatch = useDispatch();
  const { register, handleSubmit, reset } = useForm();
  
  const currentPost = useSelector(state => state.post.currentPost);
  const loading = useSelector(state => state.post.loading);
  const user = useSelector(state => state.user.userInfo);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  
  useEffect(() => {
    if (postId) {
      // First fetch post data
      dispatch(getPostById(postId));
      
      // Record view only once per session for this post
      const viewedPosts = JSON.parse(sessionStorage.getItem('viewedPosts') || '{}');
      if (!viewedPosts[postId]) {
        // If not already viewed in this session, increment view
        viewedPosts[postId] = true;
        sessionStorage.setItem('viewedPosts', JSON.stringify(viewedPosts));
        
        // Dispatch a separate action to increment view
        dispatch(incrementPostView(postId));
      }
    }
    
    return () => {
      // Clear current post when leaving the page
      dispatch({ type: 'posts/clearCurrentPost' });
    };
  }, [dispatch, postId]);
  
  const handleToggleLike = () => {
    if (!user) {
      toast.warning("Please login to like posts");
      return;
    }
    
    // Optimistic UI update
    const isCurrentlyLiked = isPostLikedByUser();
    const optimisticPost = {
      ...currentPost,
      likes: isCurrentlyLiked 
        ? currentPost.likes.filter(like => like._id !== user._id)
        : [...currentPost.likes, { _id: user._id }]
    };
    
    // Update local state immediately using the action creator
    dispatch(updateCurrentPost(optimisticPost));
    
    // Then dispatch the actual API call
    dispatch(toggleLike(postId));
  };
  
  const handleAddComment = async (data) => {
    try {
      if (!user) {
        toast.warning("Please login to comment");
        return;
      }
      
      await dispatch(addComment({
        postId,
        content: data.commentContent
      }));
      
      toast.success("Comment added successfully");
      reset();
      
      // Refresh the post data
      dispatch(getPostById(postId));
    } catch (error) {
      toast.error("Failed to add comment");
      console.error(error);
    }
  };
  
  const isPostLikedByUser = () => {
    if (!user || !currentPost?.likes) return false;
    return currentPost.likes.some(like => like._id === user._id);
  };
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="w-16 h-16 border-4 border-gray-200 border-t-green-500 rounded-full animate-spin mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading post...</p>
      </div>
    );
  }
  
  if (!currentPost) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p>Post not found</p>
        <Link to="/community" className="text-green-600 mt-4 inline-block">
          Back to Community
        </Link>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/community" className="inline-flex items-center text-green-600 mb-6 hover:underline">
        <FaArrowLeft className="mr-2" /> Back to Community
      </Link>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 mb-8">
        {/* Post header */}
        <div className="flex items-center p-4 border-b">
          <img 
            src={currentPost.user?.avatar || '/default-avatar.png'} 
            alt={currentPost.user?.username || 'User'}
            className="w-12 h-12 rounded-full mr-3 object-cover bg-gray-200"
            onError={(e) => {
              e.target.src = '/default-avatar.png';
              e.target.onerror = null;
            }}
          />
          <div>
            <h3 className="font-semibold text-gray-800 text-lg">{currentPost.user?.fullname || currentPost.user?.username}</h3>
            <p className="text-sm text-gray-500">
              {currentPost.createdAt && formatDistanceToNow(new Date(currentPost.createdAt), { addSuffix: true })}
            </p>
          </div>
        </div>
        
        {/* Post content */}
        <div className="p-6">
          <p className="text-gray-800 text-lg mb-6">{currentPost.content}</p>
          
          {currentPost.image && (
            <div className="mb-3 rounded-lg overflow-hidden">
              <img 
                src={currentPost.image} 
                alt="Post attachment" 
                className="w-full h-auto max-h-[400px] object-contain"
                onLoad={() => console.log("Image loaded successfully:", currentPost.image)}
                onError={(e) => {
                  console.error("Image failed to load:", currentPost.image, e);
                  e.target.style.display = 'none';
                }}
              />
            </div>
          )}
        </div>
        
        {/* Post stats */}
        <div className="px-6 py-3 bg-gray-50 text-sm text-gray-500 flex items-center space-x-4 border-t border-b border-gray-200">
          <span>{currentPost.likes?.length || 0} likes</span>
          <span>{currentPost.comments?.length || 0} comments</span>
          <span className="flex items-center">
            <FaEye className="mr-1" /> 
            {currentPost.viewCount || 0} views
          </span>
        </div>
        
        {/* Post actions */}
        <div className="flex border-b border-gray-200">
          <button 
            onClick={handleToggleLike}
            className="flex-1 py-3 flex justify-center items-center hover:bg-gray-50"
          >
            {isPostLikedByUser() ? (
              <FaHeart className="mr-2 text-red-500" />
            ) : (
              <FaRegHeart className="mr-2 text-gray-500" />
            )}
            <span>{isPostLikedByUser() ? 'Liked' : 'Like'}</span>
          </button>
          
          <button 
            className="flex-1 py-3 flex justify-center items-center hover:bg-gray-50"
          >
            <FaComment className="mr-2 text-gray-500" />
            <span>Comment</span>
          </button>
          
          <button 
            onClick={() => setShareModalOpen(true)}
            className="flex-1 py-3 flex justify-center items-center hover:bg-gray-50"
          >
            <FaShare className="mr-2 text-gray-500" />
            <span>Share</span>
          </button>
        </div>
        
        {/* Comment form */}
        <div className="p-4">
          <form onSubmit={handleSubmit(handleAddComment)}>
            <div className="flex">
              <img 
                src={user?.avatar || '/default-avatar.png'} 
                alt={user?.username || 'User'} 
                className="w-10 h-10 rounded-full mr-3 bg-gray-200"
                onError={(e) => {
                  e.target.src = '/default-avatar.png';
                  e.target.onerror = null;
                }}
              />
              <div className="flex-1">
                <textarea
                  {...register('commentContent', { required: true })}
                  className="w-full border border-gray-300 p-3 rounded-lg"
                  placeholder="Write a comment..."
                  rows={2}
                ></textarea>
                <button
                  type="submit"
                  className="mt-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded float-right"
                >
                  Comment
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
      
      {/* Add the ShareModal component */}
      {currentPost && (
        <ShareModal 
          isOpen={shareModalOpen} 
          onClose={() => setShareModalOpen(false)}
          postId={currentPost._id}
          title={currentPost.content?.substring(0, 50)} // Use first 50 chars as title
        />
      )}
      
      {/* Comments section */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <h2 className="text-xl font-semibold mb-6">Comments ({currentPost.comments?.length || 0})</h2>
        
        {currentPost.comments?.length > 0 ? (
          <div className="space-y-6">
            {currentPost.comments.map((comment, index) => (
              <div key={index} className="flex">
                <img 
                  src={comment.user?.avatar || '/default-avatar.png'} 
                  alt={comment.user?.username || 'User'} 
                  className="w-10 h-10 rounded-full mr-3 bg-gray-200"
                  onError={(e) => {
                    e.target.src = '/default-avatar.png';
                    e.target.onerror = null;
                  }}
                />
                <div className="bg-gray-50 p-4 rounded-lg flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <div className="font-medium text-gray-800">{comment.user?.username || 'Anonymous'}</div>
                    {comment.createdAt && (
                      <div className="text-xs text-gray-500">
                        {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                      </div>
                    )}
                  </div>
                  <p className="text-gray-700">{comment.content}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No comments yet. Be the first to comment!
          </div>
        )}
      </div>
    </div>
  );
};

export default PostDetail;