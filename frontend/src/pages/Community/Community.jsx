import React, { useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector }  from 'react-redux';
import { toast } from 'react-toastify';
import { createPost, getPosts, toggleLike, addComment, deletePost, incrementPostView } from '../../store/services/postAction';
import { 
  FaHeart, FaRegHeart, FaComment, FaEye, FaShare, FaTrash, FaPlus, 
  FaImage, FaTimes, FaArrowUp, FaCalendarAlt, FaStore,
  FaUsers, FaSeedling, FaLeaf
} from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import ShareModal from '../../components/ShareModal';

const Community = () => {
  const { register, handleSubmit, reset, watch } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [createPostModal, setCreatePostModal] = useState(false);
  const [commentingOnPost, setCommentingOnPost] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [page, setPage] = useState(1);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [sharingPost, setSharingPost] = useState(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);
  const postRefs = useRef({});
  
  const posts = useSelector(state => state.post.posts);
  const loading = useSelector(state => state.post.loading);
  const hasMore = useSelector(state => state.post.hasMore); // Get hasMore from Redux store
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

  // Show/hide scroll to top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.pageYOffset > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCreatePost = async (data) => {
    try {
      if (!user) {
        toast.warning("Please login to create a post");
        return;
      }
      
      const result = await dispatch(createPost({
        content: data.content,
        _id: user._id,
        image: data.image && data.image.length > 0 ? data.image[0] : null
      }));
      
      if (!result.error) {
        toast.success("Post created successfully");
        setCreatePostModal(false);
        setImagePreview(null);
        reset({ content: "", image: "" });
        // Refresh posts by fetching page 1
        setPage(1);
        dispatch(getPosts({ page: 1, limit: 10 }));
      }
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
    
    const targetPost = posts.find(post => post._id === postId);
    if (!targetPost) return;
    
    const isCurrentlyLiked = isPostLikedByUser(targetPost);
    
    dispatch({
      type: 'post/optimisticLikeToggle',
      payload: {
        postId,
        userId: user._id,
        isLiked: isCurrentlyLiked
      }
    });
    
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
      }
    } catch (error) {
      toast.error("Failed to add comment");
      console.error(error);
    }
  };
  
  const handleDeletePost = (postId) => {
    setPostToDelete(postId);
    setDeleteModalOpen(true);
  };

  // Add a new function to perform the actual deletion
  const confirmDeletePost = async () => {
    try {
      const result = await dispatch(deletePost(postToDelete));
      if (!result.error) {
        toast.success("Post deleted successfully");
        setDeleteModalOpen(false);
        setPostToDelete(null);
      }
    } catch (error) {
      toast.error("Failed to delete post");
      console.error(error);
    }
  };

  // Fetch posts on component mount
  useEffect(() => {
    dispatch(getPosts({ page: 1, limit: 10 })); // Reset to page 1 on mount
  }, [dispatch]);

  // Fetch more posts when page changes (for pagination)
  useEffect(() => {
    if (page > 1) {
      dispatch(getPosts({ page, limit: 10 }));
    }
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
    if (!loading && hasMore) {
      setPage(prevPage => prevPage + 1);
    }
  };

  const isPostLikedByUser = (post) => {
    if (!user || !post.likes) return false;
    return post.likes.some(like => like._id === user._id);
  };

  // Scroll to top button - positioned on the right
  const ScrollToTopButton = () => (
    showScrollTop && (
      <button
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 bg-gray-500 hover:bg-gray-600 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 z-40"
        aria-label="Scroll to top"
      >
        <FaArrowUp size={18} />
      </button>
    )
  );

  // Floating create button - positioned to the left of the scroll button
  const FloatingCreateButton = () => (
    <button
      onClick={() => setCreatePostModal(true)}
      className="fixed bottom-6 right-24 bg-green-600 hover:bg-green-700 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 z-40"
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

  // Delete confirmation modal
  const DeleteConfirmationModal = () => (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4"
      style={{ zIndex: 99999 }}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden"
        style={{ zIndex: 100000 }}
      >
        <div className="p-6">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <FaTrash className="text-red-500" size={24} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Post</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this post? This action cannot be undone.
            </p>
            <div className="flex space-x-4 w-full">
              <button
                onClick={() => {
                  setDeleteModalOpen(false);
                  setPostToDelete(null);
                }}
                className="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeletePost}
                className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content - Changed to two-column layout */}
      <div className="max-w-6xl mx-auto px-4 pt-20 md:pt-24">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left column - Main feed (70% width on large screens) */}
          <div className="lg:w-[70%]">
            {/* Topic Categories */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Topics</h3>
              <div className="flex flex-wrap gap-2">
                <button className="px-4 py-2 bg-green-100 text-green-800 rounded-full font-medium hover:bg-green-200 transition-colors">All Posts</button>
                <button className="px-4 py-2 bg-white text-gray-700 rounded-full font-medium hover:bg-green-100 transition-colors">Crops</button>
                <button className="px-4 py-2 bg-white text-gray-700 rounded-full font-medium hover:bg-green-100 transition-colors">Pest Control</button>
                <button className="px-4 py-2 bg-white text-gray-700 rounded-full font-medium hover:bg-green-100 transition-colors">Equipment</button>
                <button className="px-4 py-2 bg-white text-gray-700 rounded-full font-medium hover:bg-green-100 transition-colors">Techniques</button>
              </div>
            </div>

            {/* Create Post Button - moved from original position */}
            <div className="flex justify-end mb-4">
              <button
                onClick={() => setCreatePostModal(true)}
                className="hidden md:flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-full font-medium transition-colors duration-200"
              >
                <FaPlus className="mr-2" size={14} />
                Create Post
              </button>
            </div>
            
            {/* Posts feed - keep the existing code */}
            <div className="space-y-4">
              {loading && posts.length === 0 ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                </div>
              ) : posts.length > 0 ? (
                <>
                  {posts.map((post) => (
                    <div 
                      key={post._id} 
                      ref={el => postRefs.current[post._id] = el}
                      data-postid={post._id}
                      className="bg-white rounded-xl border border-gray-200 hover:border-gray-300 transition-all duration-200 overflow-hidden shadow-sm hover:shadow-md"
                    >
                      <div className="flex items-center justify-between p-4 border-b border-gray-100">
                        <div 
                          className="flex items-center space-x-3 cursor-pointer"
                          onClick={() => navigate(`/post/${post._id}`)}
                        >
                          <img 
                            src={post.user?.avatar || '/default-avatar.png'} 
                            alt={post.user?.username}
                            className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-100"
                          />
                          <div>
                            <h3 className="font-semibold text-gray-900">{post.user?.fullname || post.user?.username}</h3>
                            <p className="text-sm text-gray-500">
                              {post.createdAt && formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                            </p>
                          </div>
                        </div>
                        
                        {/* Delete button - only show for post owner */}
                        {user && post.user && user._id === post.user._id && (
                          <button 
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent navigation when clicking delete
                              handleDeletePost(post._id);
                            }} 
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                            title="Delete post"
                          >
                            <FaTrash size={14} />
                          </button>
                        )}
                      </div>
                      
                      {/* Post content - make it clickable */}
                      <div 
                        className="p-4 cursor-pointer"
                        onClick={() => navigate(`/post/${post._id}`)}
                      >
                        <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{post.content}</p>
                        
                        {post.image && (
                          <div className="mt-4 rounded-lg overflow-hidden">
                            <img 
                              src={post.image} 
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
                            {post.likes?.length || 0}
                          </span>
                          <span className="flex items-center">
                            <FaComment className="mr-1 text-blue-500" size={12} />
                            {post.comments?.length || 0}
                          </span>
                        </div>
                        <span className="flex items-center text-gray-500">
                          <FaEye className="mr-1" size={12} />
                          {post.viewCount || 0} views
                        </span>
                      </div>
                      
                      {/* Post actions */}
                      <div className="flex border-t border-gray-100">
                        <button 
                          onClick={() => handleToggleLike(post._id)}
                          className={`flex-1 py-3 flex justify-center items-center hover:bg-gray-50 transition-colors ${
                            isPostLikedByUser(post) ? 'text-red-500' : 'text-gray-600'
                          }`}
                        >
                          {isPostLikedByUser(post) ? (
                            <FaHeart className="mr-2" size={16} />
                          ) : (
                            <FaRegHeart className="mr-2" size={16} />
                          )}
                          <span className="font-medium">{isPostLikedByUser(post) ? 'Liked' : 'Like'}</span>
                        </button>
                        
                        <button 
                          onClick={() => setCommentingOnPost(post._id === commentingOnPost ? null : post._id)}
                          className="flex-1 py-3 flex justify-center items-center hover:bg-gray-50 text-gray-600 transition-colors border-l border-r border-gray-100"
                        >
                          <FaComment className="mr-2" size={16} />
                          <span className="font-medium">Comment</span>
                        </button>
                        
                        <button 
                          onClick={() => handleSharePost(post)} 
                          className="flex-1 py-3 flex justify-center items-center hover:bg-gray-50 text-gray-600 transition-colors"
                        >
                          <FaShare className="mr-2" size={16} />
                          <span className="font-medium">Share</span>
                        </button>
                      </div>
                      
                      {/* Comments section */}
                      {post.comments?.length > 0 && (
                        <div className="bg-gray-50 border-t border-gray-100">
                          <div className="p-4">
                            <div className="space-y-3">
                              {post.comments.slice(0, 3).map((comment, index) => (
                                <div key={index} className="flex space-x-3">
                                  <img 
                                    src={comment.user?.avatar || '/default-avatar.png'} 
                                    alt={comment.user?.username || 'User'}
                                    className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                                    onError={(e) => {
                                      e.target.src = '/default-avatar.png';
                                      e.target.onerror = null;
                                    }}
                                  />
                                  <div className="bg-white rounded-lg p-3 flex-1 shadow-sm">
                                    <div className="font-medium text-gray-900 text-sm">{comment.user?.username}</div>
                                    <p className="text-gray-700 mt-1">{comment.content}</p>
                                  </div>
                                </div>
                              ))}
                              
                              {post.comments.length > 3 && (
                                <Link 
                                  to={`/post/${post._id}`} 
                                  className="block text-center text-green-600 hover:text-green-700 font-medium py-2"
                                >
                                  View all {post.comments.length} comments
                                </Link>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {/* Comment form */}
                      {commentingOnPost === post._id && (
                        <div className="p-4 bg-gray-50 border-t border-gray-100">
                          <form onSubmit={handleSubmit(data => handleAddComment(data, post._id))}>
                            <div className="flex space-x-3">
                              <img 
                                src={user?.avatar || '/default-avatar.png'} 
                                alt={user?.username} 
                                className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                              />
                              <div className="flex-1">
                                <textarea
                                  {...register('commentContent', { required: true })}
                                  className="w-full border border-gray-200 rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                  placeholder="Write a comment..."
                                  rows={3}
                                />
                                <div className="flex justify-end space-x-2 mt-3">
                                  <button
                                    type="button"
                                    onClick={() => setCommentingOnPost(null)}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors"
                                  >
                                    Cancel
                                  </button>
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
                      )}
                    </div>
                  ))}
                  
                  {/* Load more button */}
                  {hasMore && (
                    <div className="flex justify-center py-8">
                      <button
                        onClick={handleLoadMore}
                        className="px-8 py-3 bg-white border border-gray-200 hover:border-green-500 hover:bg-green-50 text-gray-700 hover:text-green-700 rounded-full font-medium transition-all duration-200 shadow-sm hover:shadow-md"
                        disabled={loading}
                      >
                        {loading ? (
                          <div className="flex items-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600 mr-2"></div>
                            Loading...
                          </div>
                        ) : (
                          'Load More Posts'
                        )}
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
                  <div className="max-w-md mx-auto">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FaComment className="text-green-600" size={24} />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No posts yet</h3>
                    <p className="text-gray-600 mb-6">Be the first to share something with the community!</p>
                    <button
                      onClick={() => setCreatePostModal(true)}
                      className="inline-flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-full font-medium transition-colors"
                    >
                      <FaPlus className="mr-2" size={16} />
                      Create First Post
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Right sidebar - Additional features (30% width on large screens) */}
          <div className="lg:w-[30%] space-y-6 mt-6 lg:mt-0">
            {/* Community Groups Feature - Coming Soon */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-4 relative overflow-hidden">
              <div className="absolute top-0 right-0">
                <div className="bg-blue-500 text-white text-xs px-3 py-1 rotate-45 translate-y-2 translate-x-6">
                  Coming Soon
                </div>
              </div>
              <div className="flex items-center mb-3">
                <div className="bg-blue-100 w-10 h-10 rounded-full flex items-center justify-center mr-3">
                  <FaUsers className="text-blue-600" size={18} />
                </div>
                <h3 className="font-semibold text-gray-900">Community Groups</h3>
              </div>
              <p className="text-sm text-gray-700 mb-3">
                Join specialized farming communities based on your interests. Connect with like-minded farmers, share knowledge, and participate in discussions.
              </p>
              <div className="bg-white rounded-lg p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-2">
                      <FaSeedling className="text-green-600" size={14} />
                    </div>
                    <span className="font-medium text-sm">Organic Farmers</span>
                  </div>
                  <span className="text-xs text-gray-500">3.2k members</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center mr-2">
                      <FaLeaf className="text-amber-600" size={14} />  {/* Replace FaWheat with FaLeaf */}
                    </div>
                    <span className="font-medium text-sm">Grain Producers</span>
                  </div>
                  <span className="text-xs text-gray-500">2.7k members</span>
                </div>
              </div>
            </div>

            {/* Existing Marketplace section */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200 p-4 relative overflow-hidden">
              <div className="absolute top-0 right-0">
                <div className="bg-green-500 text-white text-xs px-3 py-1 rotate-45 translate-y-2 translate-x-6">
                  Coming Soon
                </div>
              </div>
              <div className="flex items-center mb-3">
                <div className="bg-green-100 w-10 h-10 rounded-full flex items-center justify-center mr-3">
                  <FaStore className="text-green-600" size={18} />
                </div>
                <h3 className="font-semibold text-gray-900">Farmer's Marketplace</h3>
              </div>
              <p className="text-sm text-gray-700 mb-3">
                Compare prices and buy farming equipment, seeds, and supplies from trusted vendors. Get the best deals!
              </p>
              <div className="flex justify-between items-center text-sm bg-white p-3 rounded-lg">
                <span>Market Price Updates</span>
                <span className="text-green-600 font-medium">Coming Soon</span>
              </div>
            </div>
            
            {/* Events Calendar */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <FaCalendarAlt className="mr-2 text-green-600" size={16} />
                Upcoming Events
              </h3>
              <div className="space-y-3">
                <div className="border-l-4 border-green-500 pl-3">
                  <p className="font-medium">Organic Farming Workshop</p>
                  <p className="text-sm text-gray-600">June 5 • Agricultural College</p>
                  <div className="flex items-center mt-1 text-xs">
                    <span className="text-green-600 bg-green-100 px-2 py-0.5 rounded-full">Workshop</span>
                  </div>
                </div>
                <div className="border-l-4 border-blue-500 pl-3">
                  <p className="font-medium">Farmer's Market</p>
                  <p className="text-sm text-gray-600">June 12 • Town Square</p>
                  <div className="flex items-center mt-1 text-xs">
                    <span className="text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">Market</span>
                  </div>
                </div>
                <div className="border-l-4 border-amber-500 pl-3">
                  <p className="font-medium">Crop Insurance Seminar</p>
                  <p className="text-sm text-gray-600">June 18 • Community Hall</p>
                  <div className="flex items-center mt-1 text-xs">
                    <span className="text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full">Seminar</span>
                  </div>
                </div>
                <button className="w-full mt-2 text-center text-green-600 hover:text-green-700 text-sm font-medium py-2 hover:bg-green-50 rounded-lg transition-colors">
                  View All Events
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Floating buttons */}
      <ScrollToTopButton />
      <FloatingCreateButton />
      
      {/* Modals - Render at the end with highest z-index */}
      {/* Post creation modal - MOVED TO END with maximum z-index */}
      {createPostModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4"
          style={{ zIndex: 99999 }}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
            style={{ zIndex: 100000 }}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Create a Post</h2>
              <button 
                onClick={() => {
                  setCreatePostModal(false);
                  setImagePreview(null);
                  reset();
                }}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <FaTimes className="text-gray-500" size={20} />
              </button>
            </div>
            
            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <form onSubmit={handleSubmit(handleCreatePost)} className="space-y-6">
                {/* User Info */}
                <div className="flex items-center space-x-3">
                  <img 
                    src={user?.avatar || '/default-avatar.png'} 
                    alt={user?.username}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium text-gray-900">{user?.fullname || user?.username}</p>
                    <p className="text-sm text-gray-500">Posting to Community</p>
                  </div>
                </div>

                {/* Content Input */}
                <div>
                  <textarea
                    {...register('content', { required: true })}
                    className="w-full border-0 resize-none text-lg placeholder-gray-400 focus:outline-none"
                    placeholder="What's on your mind?"
                    rows={6}
                    style={{ fontSize: '16px' }}
                  />
                </div>
                
                {/* Image Upload */}
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 hover:border-green-300 transition-colors">
                  <input
                    type="file"
                    id="image"
                    accept="image/*"
                    {...register('image')}
                    className="hidden"
                  />
                  <label 
                    htmlFor="image" 
                    className="flex flex-col items-center cursor-pointer"
                  >
                    <FaImage className="text-gray-400 mb-2" size={24} />
                    <span className="text-gray-600 font-medium">Add Photo</span>
                    <span className="text-sm text-gray-400">or drag and drop</span>
                  </label>
                  
                  {imagePreview && (
                    <div className="mt-4 relative">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="max-h-64 w-full object-contain rounded-lg" 
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImagePreview(null);
                          reset({ ...watch(), image: "" });
                        }}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <FaTimes size={12} />
                      </button>
                    </div>
                  )}
                </div>
                
                {/* Submit Button */}
                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => {
                      setCreatePostModal(false);
                      setImagePreview(null);
                      reset();
                    }}
                    className="px-6 py-2 text-gray-700 hover:bg-gray-100 rounded-full font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-8 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded-full font-medium transition-colors"
                  >
                    {loading ? 'Posting...' : 'Post'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      
      {/* Share Modal */}
      {sharingPost && (
        <ShareModal 
          isOpen={shareModalOpen} 
          onClose={() => setShareModalOpen(false)}
          postId={sharingPost._id}
          title={sharingPost.content?.substring(0, 50)}
        />
      )}
      
      {/* Delete Confirmation Modal */}
      {deleteModalOpen && <DeleteConfirmationModal />}
    </div>
  );
};

export default Community;