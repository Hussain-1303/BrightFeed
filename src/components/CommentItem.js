import React, { useState } from 'react';
import LikeButton from './LikeButton';
import CommentForm from './CommentForm';

const CommentItem = ({ comment, onLike, onReplyLike, darkMode = false, isReply = false }) => {
  const [showReplies, setShowReplies] = useState(true);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  // Format timestamp to relative time
  const formatTime = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return timestamp.toLocaleDateString();
  };

  const handleReplySubmit = (replyContent) => {
    // In a real app, this would make an API call
    console.log('Reply submitted:', replyContent);
    setShowReplyForm(false);
  };

  return (
    <div className={`${isReply ? 'ml-8 pl-4 border-l-2' : ''} ${darkMode ? 'border-neutral-600' : 'border-neutral-200'}`}>
      <div className="flex gap-3">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <img
            src={comment.avatar}
            alt={comment.author}
            className={`rounded-full object-cover ${isReply ? 'w-8 h-8' : 'w-10 h-10'}`}
          />
        </div>

        {/* Comment Content */}
        <div className="flex-grow min-w-0">
          {/* Header */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <h4 className={`font-semibold ${isReply ? 'text-sm' : 'text-base'} 
                ${darkMode ? 'text-white' : 'text-neutral-800'}`}
              >
                {comment.author}
              </h4>
              <span className={`text-xs ${darkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>
                {formatTime(comment.timestamp)}
              </span>
            </div>

            {/* Options Menu */}
            <div className="relative">
              <button
                onClick={() => setShowOptions(!showOptions)}
                className={`p-1 rounded-full transition-colors duration-200 hover:bg-neutral-100 dark:hover:bg-neutral-700
                  ${darkMode ? 'text-neutral-400 hover:text-white' : 'text-neutral-500 hover:text-neutral-700'}
                `}
              >
                ⋯
              </button>

              {showOptions && (
                <div className={`absolute right-0 mt-1 w-32 rounded-lg shadow-lg border z-10
                  ${darkMode 
                    ? 'bg-neutral-800 border-neutral-700' 
                    : 'bg-white border-neutral-200'
                  }
                `}>
                  <button className={`w-full text-left px-3 py-2 text-sm flex items-center gap-2 transition-colors duration-200
                    ${darkMode 
                      ? 'text-neutral-300 hover:bg-neutral-700' 
                      : 'text-neutral-600 hover:bg-neutral-100'
                    }
                  `}>
                    🚩
                    Report
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Comment Text */}
          <p className={`mb-3 leading-relaxed ${isReply ? 'text-sm' : 'text-base'} 
            ${darkMode ? 'text-neutral-300' : 'text-neutral-700'}`}
          >
            {comment.content}
          </p>

          {/* Action Buttons */}
          <div className="flex items-center gap-4">
            <LikeButton
              likes={comment.likes}
              isLiked={comment.isLiked}
              onLike={() => onLike(comment.id)}
              size="small"
              darkMode={darkMode}
            />

            {!isReply && (
              <button
                onClick={() => setShowReplyForm(!showReplyForm)}
                className={`flex items-center gap-1 px-2 py-1 text-sm transition-colors duration-200 rounded-lg
                  ${darkMode 
                    ? 'text-neutral-400 hover:text-white hover:bg-neutral-700' 
                    : 'text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100'
                  }
                `}
              >
                ↩️
                Reply
              </button>
            )}
          </div>

          {/* Reply Form */}
          {showReplyForm && (
            <div className="mt-4">
              <CommentForm
                onSubmit={handleReplySubmit}
                onCancel={() => setShowReplyForm(false)}
                placeholder={`Reply to ${comment.author}...`}
                darkMode={darkMode}
              />
            </div>
          )}

          {/* Replies */}
          {!isReply && comment.replies && comment.replies.length > 0 && (
            <div className="mt-4">
              {comment.replies.length > 1 && (
                <button
                  onClick={() => setShowReplies(!showReplies)}
                  className={`text-sm mb-3 font-medium transition-colors duration-200
                    ${darkMode 
                      ? 'text-brand-400 hover:text-brand-300' 
                      : 'text-brand-600 hover:text-brand-700'
                    }
                  `}
                >
                  {showReplies 
                    ? `Hide ${comment.replies.length} replies` 
                    : `Show ${comment.replies.length} replies`
                  }
                </button>
              )}

              {showReplies && (
                <div className="space-y-4">
                  {comment.replies.map(reply => (
                    <CommentItem
                      key={reply.id}
                      comment={reply}
                      onLike={(replyId) => onReplyLike(replyId, comment.id)}
                      darkMode={darkMode}
                      isReply={true}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Click outside to close options */}
      {showOptions && (
        <div 
          className="fixed inset-0 z-0" 
          onClick={() => setShowOptions(false)}
        />
      )}
    </div>
  );
};

export default CommentItem;