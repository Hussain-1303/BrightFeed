import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LikeCommentSection from './LikeCommentSection';

const NewsCard = ({ article, viewMode = 'grid' }) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    checkBookmarkStatus();
  }, [article]);

  const checkBookmarkStatus = () => {
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
    const isInBookmarks = bookmarks.some(
      (bookmark) => bookmark.content_hash === article.content_hash
    );
    setIsBookmarked(isInBookmarks);
  };

  const toggleBookmark = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
    
    if (isBookmarked) {
      const updatedBookmarks = bookmarks.filter(
        (bookmark) => bookmark.content_hash !== article.content_hash
      );
      localStorage.setItem('bookmarks', JSON.stringify(updatedBookmarks));
      setIsBookmarked(false);
    } else {
      bookmarks.push(article);
      localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
      setIsBookmarked(true);
    }
    
    window.dispatchEvent(new CustomEvent('bookmarksChanged'));
  };

  const getSentimentColor = () => {
    const compound = article.sentiment?.headline?.compound || 0;
    if (compound >= 0.05) return 'bg-green-500';
    if (compound <= -0.05) return 'bg-red-500';
    return 'bg-gray-400';
  };

  const getSentimentLabel = () => {
    const compound = article.sentiment?.headline?.compound || 0;
    if (compound >= 0.05) return 'Positive';
    if (compound <= -0.05) return 'Negative';
    return 'Neutral';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
    
    if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else if (diffHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
      });
    }
  };

  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden mb-4">
        <div className="flex">
          {/* Sentiment Indicator */}
          <div className={`w-2 ${getSentimentColor()}`}></div>
          
          {/* Image */}
          {article.image && (
            <div className="w-48 h-32 flex-shrink-0">
              <img
                src={article.image}
                alt={article.headline}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/images/placeholder.png';
                }}
              />
            </div>
          )}
          
          {/* Content */}
          <div className="flex-1 p-4">
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    article.sentiment?.headline?.compound >= 0.05
                      ? 'bg-green-100 text-green-800'
                      : article.sentiment?.headline?.compound <= -0.05
                      ? 'bg-red-100 text-red-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {getSentimentLabel()}
                  </span>
                  <span className="text-xs text-gray-500">{article.source}</span>
                  <span className="text-xs text-gray-400">•</span>
                  <span className="text-xs text-gray-500">{formatDate(article.date)}</span>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-800 mb-2 hover:text-blue-600 transition-colors">
                  <a href={article.sourceLink} target="_blank" rel="noopener noreferrer">
                    {article.headline}
                  </a>
                </h3>
                
                <p className="text-sm text-gray-600 line-clamp-2">
                  {article.description || article.summary}
                </p>
              </div>
              
              {/* Bookmark Button */}
              <button
                onClick={toggleBookmark}
                className={`ml-4 p-2 rounded-full transition-colors ${
                  isBookmarked
                    ? 'text-yellow-500 hover:bg-yellow-50'
                    : 'text-gray-400 hover:bg-gray-100'
                }`}
                aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
              >
                <svg
                  className="w-6 h-6"
                  fill={isBookmarked ? 'currentColor' : 'none'}
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                  />
                </svg>
              </button>
            </div>
            
            {/* Likes and Comments */}
            <LikeCommentSection article={article} />
          </div>
        </div>
      </div>
    );
  }

  // Grid View
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col h-full">
      {/* Sentiment Indicator Bar */}
      <div className={`h-1 ${getSentimentColor()}`}></div>
      
      {/* Image */}
      {article.image && (
        <div className="relative h-48 overflow-hidden">
          <img
            src={article.image}
            alt={article.headline}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/images/placeholder.png';
            }}
          />
          {/* Bookmark Button Overlay */}
          <button
            onClick={toggleBookmark}
            className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm transition-colors ${
              isBookmarked
                ? 'bg-yellow-500/80 text-white hover:bg-yellow-600/80'
                : 'bg-white/80 text-gray-700 hover:bg-white'
            }`}
            aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
          >
            <svg
              className="w-5 h-5"
              fill={isBookmarked ? 'currentColor' : 'none'}
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
              />
            </svg>
          </button>
        </div>
      )}
      
      {/* Content */}
      <div className="p-4 flex-1 flex flex-col">
        {/* Metadata */}
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span className={`text-xs px-2 py-1 rounded-full ${
            article.sentiment?.headline?.compound >= 0.05
              ? 'bg-green-100 text-green-800'
              : article.sentiment?.headline?.compound <= -0.05
              ? 'bg-red-100 text-red-800'
              : 'bg-gray-100 text-gray-800'
          }`}>
            {getSentimentLabel()}
          </span>
          <span className="text-xs text-gray-500">{article.source}</span>
          <span className="text-xs text-gray-400">•</span>
          <span className="text-xs text-gray-500">{formatDate(article.date)}</span>
        </div>
        
        {/* Headline */}
        <h3 className="text-lg font-semibold text-gray-800 mb-2 hover:text-blue-600 transition-colors line-clamp-2">
          <a href={article.sourceLink} target="_blank" rel="noopener noreferrer">
            {article.headline}
          </a>
        </h3>
        
        {/* Description */}
        <p className="text-sm text-gray-600 mb-3 line-clamp-3 flex-1">
          {article.description || article.summary}
        </p>
        
        {/* Likes and Comments */}
        <LikeCommentSection article={article} />
      </div>
    </div>
  );
};

export default NewsCard;