import React, { useState } from 'react';
import { 
  FaFacebookF, 
  FaLinkedinIn, 
  FaTwitter, 
  FaLink, 
  FaTimes, 
  FaCheck 
} from 'react-icons/fa';

const ShareModal = ({ isOpen, onClose, postId, title }) => {
  const [copied, setCopied] = useState(false);
  
  if (!isOpen) return null;
  
  // Generate the full post URL
  const postUrl = `${window.location.origin}/post/${postId}`;
  
  // Share handlers
  const handleFacebookShare = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`, 
      '_blank', 'width=600,height=400');
  };
  
  const handleTwitterShare = () => {
    const text = title ? `Check out this post: ${title}` : 'Check out this post from AgriTech';
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(postUrl)}`, 
      '_blank', 'width=600,height=400');
  };
  
  const handleLinkedInShare = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postUrl)}`, 
      '_blank', 'width=600,height=400');
  };
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(postUrl)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => console.error('Failed to copy link: ', err));
  };

  // Try native sharing if available
  const handleNativeShare = () => {
    if (navigator.share) {
      navigator.share({
        title: title || 'AgriTech Post',
        text: 'Check out this post from AgriTech',
        url: postUrl,
      })
        .then(() => onClose())
        .catch((error) => console.log('Error sharing', error));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
         onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl transform transition-all animate-fadeIn">
        <div className="flex justify-between items-center mb-6 border-b pb-3">
          <h3 className="text-xl font-bold text-gray-800">Share Post</h3>
          <button 
            onClick={onClose}
            className="bg-gray-100 hover:bg-gray-200 rounded-full p-2 text-gray-600 hover:text-gray-800 transition-colors"
            aria-label="Close modal"
          >
            <FaTimes size={16} />
          </button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <button 
            onClick={handleFacebookShare}
            className="flex items-center justify-center gap-2 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-all shadow-sm"
          >
            <FaFacebookF /> Facebook
          </button>
          
          <button 
            onClick={handleTwitterShare}
            className="flex items-center justify-center gap-2 bg-black text-white py-3 px-4 rounded-lg hover:bg-gray-800 transition-all shadow-sm"
          >
            <FaTwitter /> X (Twitter)
          </button>
          
          <button 
            onClick={handleLinkedInShare}
            className="flex items-center justify-center gap-2 bg-blue-700 text-white py-3 px-4 rounded-lg hover:bg-blue-800 transition-all shadow-sm"
          >
            <FaLinkedinIn /> LinkedIn
          </button>
          
          <button 
            onClick={handleCopyLink}
            className={`flex items-center justify-center gap-2 py-3 px-4 rounded-lg transition-all shadow-sm
              ${copied 
                ? 'bg-green-600 text-white' 
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
          >
            {copied ? <FaCheck /> : <FaLink />} 
            {copied ? 'Copied!' : 'Copy Link'}
          </button>
        </div>
        
        {navigator.share && (
          <button 
            onClick={handleNativeShare}
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-all shadow-sm mb-4"
          >
            Share using device options
          </button>
        )}
        
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="text-sm text-gray-500">
            <span className="block mb-1">URL:</span> 
            <div className="bg-gray-100 p-2 rounded flex items-center">
              <div className="overflow-hidden overflow-ellipsis whitespace-nowrap flex-1">
                {postUrl}
              </div>
              <button 
                onClick={handleCopyLink} 
                className="ml-2 p-1 text-gray-600 hover:text-green-600"
                title="Copy link"
              >
                {copied ? <FaCheck /> : <FaLink />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;