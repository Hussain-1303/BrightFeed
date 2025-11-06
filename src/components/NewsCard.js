import React, { useState, useEffect } from 'react';
import { FiBookmark, FiCheckSquare } from 'react-icons/fi';

const NewsCard = ({ article, darkMode, onBookmark, viewMode = 'grid' }) => {
  const [isBookmarked, setIsBookmarked] = useState(false);

  const checkIfBookmarked = () => {
    try {
      const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
      const found = bookmarks.some(b => 
        b.headline === article.headline || 
        b.sourceLink === article.sourceLink
      );
      setIsBookmarked(found);
      return found;
    } catch (error) {
      console.error('Error checking bookmark:', error);
      return false;
    }
  };

  useEffect(() => {
    checkIfBookmarked();
    
    const handleBookmarkChange = () => checkIfBookmarked();
    
    window.addEventListener('bookmarksChanged', handleBookmarkChange);
    window.addEventListener('storage', handleBookmarkChange);
    window.addEventListener('focus', handleBookmarkChange);

    return () => {
      window.removeEventListener('bookmarksChanged', handleBookmarkChange);
      window.removeEventListener('storage', handleBookmarkChange);
      window.removeEventListener('focus', handleBookmarkChange);
    };
  }, [article.headline, article.sourceLink]);

  const handleBookmarkClick = (e) => {
    // CRITICAL: Stop all event propagation
    e.stopPropagation();
    e.preventDefault();
    e.nativeEvent.stopImmediatePropagation();
    
    console.log('Bookmark button clicked!', article.headline);
    
    try {
      const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
      const bookmarkIndex = bookmarks.findIndex(b => 
        b.headline === article.headline
      );
      
      let newBookmarks;
      if (bookmarkIndex > -1) {
        newBookmarks = bookmarks.filter((_, index) => index !== bookmarkIndex);
        setIsBookmarked(false);
        console.log('✅ Removed bookmark:', article.headline);
      } else {
        const bookmarkData = {
          headline: article.headline,
          summary: article.summary || article.description,
          description: article.description,
          image: article.image,
          sourceLink: article.sourceLink,
          publishedAt: article.publishedAt || article.date,
          category: article.category,
          source: article.source,
          sentiment: article.sentiment,
          bookmarkedAt: new Date().toISOString(),
        };
        newBookmarks = [...bookmarks, bookmarkData];
        setIsBookmarked(true);
        console.log('✅ Added bookmark:', article.headline);
      }
      
      localStorage.setItem('bookmarks', JSON.stringify(newBookmarks));
      console.log('📊 Total bookmarks:', newBookmarks.length);
      
      if (onBookmark) {
        onBookmark(article);
      }
      
      window.dispatchEvent(new CustomEvent('bookmarksChanged', { 
        detail: { bookmarks: newBookmarks } 
      }));
      
      // Force a small delay to ensure state updates
      setTimeout(() => checkIfBookmarked(), 100);
      
    } catch (error) {
      console.error('❌ Error toggling bookmark:', error);
    }
  };

  const handleNewsClick = () => {
    if (article.sourceLink) {
      console.log('Opening article:', article.sourceLink);
      window.open(article.sourceLink, '_blank', 'noopener,noreferrer');
    }
  };

  const articleDate = article.publishedAt || article.date || new Date().toISOString();

  return (
    <div 
      className={`card-hover ${viewMode === 'grid' ? 'rounded-lg p-4' : 'p-4 border-b'} ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} shadow-md hover:shadow-lg transition-all ${viewMode === 'list' ? 'flex items-center' : ''}`}
    >
      {viewMode === 'grid' ? (
        <>
          {/* Image and content - clickable to open article */}
          <div onClick={handleNewsClick} className="cursor-pointer">
            {article.image ? (
              <div className="h-48 overflow-hidden rounded-lg mb-4">
                <img
                  src={article.image}
                  alt={article.headline}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            ) : (
              <div className={`w-full h-48 flex items-center justify-center rounded-lg mb-4 ${darkMode ? 'bg-gray-600' : 'bg-gray-100'}`}>
                <span className="text-gray-400 text-sm">No Image Available</span>
              </div>
            )}
            <h3 className="text-lg font-semibold line-clamp-2 mb-2">{article.headline}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-3">
              {article.summary || article.description || 'No summary available.'}
            </p>
          </div>
          
          {/* Bottom bar with date and bookmark - NOT clickable for article */}
          <div className="flex justify-between items-center mt-4">
            <span className="text-xs text-gray-400">
              {new Date(articleDate).toLocaleDateString()}
            </span>
            <button
              type="button"
              onClick={handleBookmarkClick}
              onMouseDown={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
              className={`p-2 rounded-full transition-all z-10 relative ${
                isBookmarked 
                  ? 'bg-blue-500 text-white hover:bg-blue-600' 
                  : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
              aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
              title={isBookmarked ? 'Remove from bookmarks' : 'Save for later'}
            >
              {isBookmarked ? <FiCheckSquare size={18} /> : <FiBookmark size={18} />}
            </button>
          </div>
        </>
      ) : (
        <div className="flex items-center w-full gap-4">
          {/* Content - clickable to open article */}
          <div onClick={handleNewsClick} className="cursor-pointer flex items-center gap-4 flex-1">
            {article.image ? (
              <div className="w-32 h-20 overflow-hidden rounded flex-shrink-0">
                <img
                  src={article.image}
                  alt={article.headline}
                  className="w-full h-full object-cover"
                  onError={(e) => e.target.style.display = 'none'}
                />
              </div>
            ) : (
              <div className={`w-32 h-20 flex items-center justify-center rounded flex-shrink-0 ${darkMode ? 'bg-gray-600' : 'bg-gray-100'}`}>
                <span className="text-gray-400 text-xs">No Image</span>
              </div>
            )}
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-1">{article.headline}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                {article.summary || article.description || 'No summary available.'}
              </p>
              <span className="text-xs text-gray-400 mt-2 block">
                {new Date(articleDate).toLocaleDateString()}
              </span>
            </div>
          </div>
          
          {/* Bookmark button - separate from clickable content */}
          <button
            type="button"
            onClick={handleBookmarkClick}
            onMouseDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
            className={`p-2 rounded-full transition-all flex-shrink-0 z-10 relative ${
              isBookmarked 
                ? 'bg-blue-500 text-white hover:bg-blue-600' 
                : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
            aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
            title={isBookmarked ? 'Remove from bookmarks' : 'Save for later'}
          >
            {isBookmarked ? <FiCheckSquare size={18} /> : <FiBookmark size={18} />}
          </button>
        </div>
      )}
    </div>
  );
};

export default NewsCard;