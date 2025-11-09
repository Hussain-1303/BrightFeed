import React, { useState } from 'react';

const LikeButton = ({ likes = 0, isLiked = false, onLike, size = 'medium', darkMode = false }) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = () => {
    setIsAnimating(true);
    onLike();
    
    // Reset animation after a short delay
    setTimeout(() => setIsAnimating(false), 300);
  };

  const getButtonSize = () => {
    switch (size) {
      case 'small':
        return 'px-2 py-1 text-sm';
      case 'large':
        return 'px-6 py-3 text-lg';
      default:
        return 'px-4 py-2';
    }
  };

  return (
    <button
      onClick={handleClick}
      data-testid="like-button"
      className={`flex items-center gap-2 rounded-lg transition-all duration-200 hover:scale-105 font-medium
        ${getButtonSize()}
        ${isLiked 
          ? 'text-red-500 hover:text-red-600' 
          : darkMode 
            ? 'text-neutral-300 hover:text-red-400' 
            : 'text-neutral-600 hover:text-red-500'
        }
        ${darkMode 
          ? 'hover:bg-neutral-700' 
          : 'hover:bg-neutral-100'
        }
        ${isAnimating ? 'animate-pulse' : ''}
      `}
      aria-label={isLiked ? 'Unlike' : 'Like'}
    >
      {isLiked ? (
        <span 
          className={`${isAnimating ? 'animate-bounce' : ''}`}
          data-testid="heart-filled-icon"
        >
          ❤️
        </span>
      ) : (
        <span 
          className={`${isAnimating ? 'animate-bounce' : ''}`}
          data-testid="heart-outline-icon"
        >
          🤍
        </span>
      )}
      <span className="select-none">
        {likes.toLocaleString()}
      </span>
    </button>
  );
};

export default LikeButton;