import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { FaArrowLeft, FaHeart, FaRegHeart, FaComment, FaShare, FaEye } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { getPostById, toggleLike, addComment } from '../../store/services/postAction';
import { formatDistanceToNow } from 'date-fns';
import ShareModal from '../../components/ShareModal';

const PostDetail = () => {
  const { register, handleSubmit, reset } = useForm();
  const dispatch = useDispatch();
  const { postId } = useParams();
  const [shareModalOpen, setShareModalOpen] = useState(false);
  
  const currentPost = useSelector(state => state.post.currentPost);
  const loading = useSelector(state => state.post.loading);
  const user = useSelector(state => state.user.userInfo);
  
  // Load post data when component mounts
  useEffect(() => {
    if (postId) {
      console.log("Loading post with ID:", postId);
      dispatch(getPostById(postId))
        .then(response => {
          console.log("API Response:", response);
          if (!response.payload?.data) {
            toast.error("Failed to load post");
          }
        })
        .catch(error => {
          console.error("Error loading post:", error);
          toast.error("Error loading post");
        });
    }
  }, [dispatch, postId]);

  const handleToggleLike = () => {
    if (!user) {
      toast.warning("Please login to like posts");
      return;
    }
    
    dispatch(toggleLike(postId));
  };
  
  const handleAddComment = async (data) => {
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
        reset();
      }
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
      <div className="min-h-screen bg-gray-50 pt-20 md:pt-24">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!currentPost) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 md:pt-24">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
            <div className="max-w-md mx-auto">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Post not found</h3>
              <p className="text-gray-600 mb-6">This post may have been deleted or doesn't exist.</p>
              <Link to="/community" 
                className="inline-flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-full font-medium transition-colors">
                <FaArrowLeft className="mr-2" size={16} />
                Back to Community
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 pt-20 md:pt-24">
      <div className="max-w-4xl mx-auto px-4">
        <Link 
          to="/community" 
          className="inline-flex items-center text-green-600 mb-6 hover:text-green-700 transition-colors"
        >
          <FaArrowLeft className="mr-2" /> Back to Community
        </Link>
        
        {/* Post card */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm mb-6">
          {/* Post header */}
          <div className="flex items-center p-4 border-b border-gray-100">
            <img 
              src={currentPost.user?.avatar || '/default-avatar.png'} 
              alt={currentPost.user?.username || 'User'}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-100 mr-3"
              onError={(e) => {
                e.target.src = '/default-avatar.png';
                e.target.onerror = null;
              }}
            />
            <div>
              <h3 className="font-semibold text-gray-900">{currentPost.user?.fullname || currentPost.user?.username}</h3>
              <p className="text-sm text-gray-500">
                {currentPost.createdAt && formatDistanceToNow(new Date(currentPost.createdAt), { addSuffix: true })}
              </p>
            </div>
          </div>
          
          {/* Post content */}
          <div className="p-4">
            <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{currentPost.content}</p>
            
            {currentPost.image && (
              <div className="mt-4 rounded-lg overflow-hidden">
                <img 
                  src={currentPost.image} 
                  alt="Post attachment" 
                  className="w-full h-auto max-h-96 object-contain bg-gray-50"
                  onError={(e) => {
                    console.error("Image failed to load:", e);
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>
          
          {/* Post stats */}
          <div className="px-4 py-2 bg-gray-50 text-sm text-gray-600 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="flex items-center">
                <FaHeart className="mr-1 text-red-500" size={12} />
                {currentPost.likes?.length || 0}
              </span>
              <span className="flex items-center">
                <FaComment className="mr-1 text-blue-500" size={12} />
                {currentPost.comments?.length || 0}
              </span>
            </div>
            <span className="flex items-center text-gray-500">
              <FaEye className="mr-1" size={12} />
              {currentPost.viewCount || 0} views
            </span>
          </div>
          
          {/* Post actions */}
          <div className="flex border-t border-gray-100">
            <button 
              onClick={handleToggleLike}
              className={`flex-1 py-3 flex justify-center items-center hover:bg-gray-50 transition-colors ${
                isPostLikedByUser() ? 'text-red-500' : 'text-gray-600'
              }`}
            >
              {isPostLikedByUser() ? (
                <FaHeart className="mr-2" size={16} />
              ) : (
                <FaRegHeart className="mr-2" size={16} />
              )}
              <span className="font-medium">{isPostLikedByUser() ? 'Liked' : 'Like'}</span>
            </button>
            
            <button 
              onClick={() => document.getElementById('commentInput').focus()}
              className="flex-1 py-3 flex justify-center items-center hover:bg-gray-50 text-gray-600 transition-colors border-l border-r border-gray-100"
            >
              <FaComment className="mr-2" size={16} />
              <span className="font-medium">Comment</span>
            </button>
            
            <button 
              onClick={() => setShareModalOpen(true)}
              className="flex-1 py-3 flex justify-center items-center hover:bg-gray-50 text-gray-600 transition-colors"
            >
              <FaShare className="mr-2" size={16} />
              <span className="font-medium">Share</span>
            </button>
          </div>
        </div>
        
        {/* Comment form */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm mb-6">
          <form onSubmit={handleSubmit(handleAddComment)} className="p-4">
            <div className="flex space-x-3">
              <img 
                src={user?.avatar || '/default-avatar.png'} 
                alt={user?.username || 'User'} 
                className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                onError={(e) => {
                  e.target.src = '/default-avatar.png';
                  e.target.onerror = null;
                }}
              />
              <div className="flex-1">
                <textarea
                  id="commentInput"
                  {...register('commentContent', { required: true })}
                  className="w-full border border-gray-200 rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Write a comment..."
                  rows={3}
                />
                <div className="flex justify-end mt-3">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                  >
                    Comment
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
        
        {/* Comments section */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm mb-6">
          <h2 className="text-xl font-semibold p-4 border-b border-gray-100">
            Comments ({currentPost.comments?.length || 0})
          </h2>
          
          {currentPost.comments?.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {currentPost.comments.map((comment, index) => (
                <div key={index} className="p-4">
                  <div className="flex space-x-3">
                    <img 
                      src={comment.user?.avatar || '/default-avatar.png'} 
                      alt={comment.user?.username || 'User'}
                      className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                      onError={(e) => {
                        e.target.src = '/default-avatar.png';
                        e.target.onerror = null;
                      }}
                    />
                    <div>
                      <div className="flex items-center">
                        <span className="font-medium text-gray-900">{comment.user?.username || 'User'}</span>
                        <span className="ml-2 text-xs text-gray-500">
                          {comment.createdAt && formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                      <p className="mt-1 text-gray-800">{comment.content}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500">
              No comments yet. Be the first to share your thoughts!
            </div>
          )}
        </div>
      </div>
      
      {/* Share Modal */}
      {shareModalOpen && (
        <ShareModal 
          isOpen={shareModalOpen} 
          onClose={() => setShareModalOpen(false)}
          postId={currentPost._id}
          title={currentPost.content?.substring(0, 50)} // Use first 50 chars as title
        />
      )}
    </div>
  );
};

export default PostDetail;