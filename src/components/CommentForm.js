import React, { useState, useRef, useEffect } from 'react';

const CommentForm = ({ onSubmit, onCancel, placeholder = "Share your thoughts...", darkMode = false }) => {
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const textareaRef = useRef(null);

  useEffect(() => {
    // Focus the textarea when component mounts
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  // Auto-resize textarea based on content
  const handleTextareaChange = (e) => {
    setComment(e.target.value);
    
    // Auto-resize
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!comment.trim()) return;
    
    setIsSubmitting(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    onSubmit(comment.trim());
    setComment('');
    setIsSubmitting(false);
  };

  const handleKeyDown = (e) => {
    // Submit on Ctrl/Cmd + Enter
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      handleSubmit(e);
    }
    // Cancel on Escape
    if (e.key === 'Escape') {
      onCancel();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3" data-testid="comment-form">
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={comment}
          onChange={handleTextareaChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={3}
          aria-label="Share your thoughts"
          className={`w-full p-3 rounded-lg border resize-none transition-colors duration-200 focus:ring-2 focus:ring-brand-500 focus:border-transparent
            ${darkMode 
              ? 'bg-neutral-700 border-neutral-600 text-white placeholder-neutral-400' 
              : 'bg-white border-neutral-300 text-neutral-800 placeholder-neutral-500'
            }
          `}
          style={{ minHeight: '80px', maxHeight: '200px' }}
          disabled={isSubmitting}
        />
        
        {/* Character count */}
        <div className={`absolute bottom-2 right-2 text-xs
          ${comment.length > 500 
            ? 'text-red-500' 
            : darkMode 
              ? 'text-neutral-400' 
              : 'text-neutral-500'
          }
        `}>
          {comment.length}/500
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className={`text-sm ${darkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>
          <span>Press </span>
          <kbd className={`px-1 py-0.5 rounded text-xs font-mono
            ${darkMode 
              ? 'bg-neutral-600 text-neutral-300' 
              : 'bg-neutral-200 text-neutral-700'
            }
          `}>
            {navigator.platform.includes('Mac') ? '⌘' : 'Ctrl'} + Enter
          </kbd>
          <span> to submit</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onCancel}
            className={`px-4 py-2 rounded-lg border transition-colors duration-200 flex items-center gap-2
              ${darkMode 
                ? 'border-neutral-600 text-neutral-300 hover:bg-neutral-700' 
                : 'border-neutral-300 text-neutral-600 hover:bg-neutral-50'
              }
            `}
            disabled={isSubmitting}
          >
            ✖️
            Cancel
          </button>

          <button
            type="submit"
            disabled={!comment.trim() || comment.length > 500 || isSubmitting}
            className={`px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 font-medium
              ${!comment.trim() || comment.length > 500 || isSubmitting
                ? 'opacity-50 cursor-not-allowed bg-neutral-400'
                : 'bg-brand-500 hover:bg-brand-600 text-white hover:scale-105'
              }
            `}
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Posting...
              </>
            ) : (
              <>
                📤
                Post Comment
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

export default CommentForm;