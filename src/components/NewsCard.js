import React, { useState, useEffect } from 'react';
import { FiBookmark, FiCheckSquare } from 'react-icons/fi';

const NewsCard = ({ article, darkMode, onBookmark, viewMode }) => {
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    // Check if article is bookmarked on mount
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
    const bookmarked = bookmarks.some(b => b.headline === article.headline);
    setIsBookmarked(bookmarked);
  }, [article.headline]);

  const handleBookmarkClick = () => {
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
    const bookmarkedIndex = bookmarks.findIndex(b => b.headline === article.headline);
    
    if (bookmarkedIndex > -1) {
      // Remove bookmark
      bookmarks.splice(bookmarkedIndex, 1);
      setIsBookmarked(false);
    } else {
      // Add bookmark
      bookmarks.push(article);
      setIsBookmarked(true);
    }
    
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    onBookmark && onBookmark(article);
  };

  const handleNewsClick = () => {
    if (article.sourceLink) {
      window.open(article.sourceLink, '_blank');
    }
  };

  return (
    <div 
      className={`card-hover ${viewMode === 'grid' ? 'rounded-lg p-4 cursor-pointer' : 'p-4 border-b cursor-pointer'} ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} shadow-md hover:shadow-lg transition-all ${viewMode === 'list' ? 'flex items-center' : ''}`}
      onClick={handleNewsClick}
    >
      {viewMode === 'grid' ? (
        <>
          {article.image ? (
            <div className="h-48 overflow-hidden rounded-lg mb-4">
              <img
                src={article.image}
                alt={article.headline}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
              />
            </div>
          ) : (
            <div className={`w-full h-48 flex items-center justify-center rounded-lg mb-4 ${darkMode ? 'bg-gray-600' : 'bg-gray-100'}`}>
              <span className="text-gray-400">No Image Available</span>
            </div>
          )}
          <h3 className="text-lg font-semibold line-clamp-2">{article.headline}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-3 mt-2">{article.summary || 'No summary available.'}</p>
          <div className="flex justify-between items-center mt-4">
            <span className="text-xs text-gray-400">
              {new Date(article.publishedAt).toLocaleDateString()}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleBookmarkClick();
              }}
              className={`p-2 rounded-full transition-colors ${isBookmarked ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
              aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
            >
              {isBookmarked ? <FiCheckSquare /> : <FiBookmark />}
            </button>
          </div>
        </>
      ) : (
        <div className="flex items-center w-full gap-4">
          {article.image ? (
            <div className="w-32 h-20 overflow-hidden rounded flex-shrink-0">
              <img
                src={article.image}
                alt={article.headline}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className={`w-32 h-20 flex items-center justify-center rounded flex-shrink-0 ${darkMode ? 'bg-gray-600' : 'bg-gray-100'}`}>
              <span className="text-gray-400 text-sm">No Image</span>
            </div>
          )}
          <div className="flex-1">
            <h3 className="text-lg font-semibold">{article.headline}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mt-1">
              {article.summary || 'No summary available.'}
            </p>
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-gray-400">
                {new Date(article.publishedAt).toLocaleDateString()}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleBookmarkClick();
                }}
                className={`p-2 rounded-full transition-colors ${isBookmarked ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
                aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
              >
                {isBookmarked ? <FiCheckSquare /> : <FiBookmark />}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsCard;