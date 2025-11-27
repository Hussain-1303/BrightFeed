import React, { useState, useEffect, useCallback } from 'react';
import { FiBookmark, FiCheckSquare } from 'react-icons/fi';
import LikeCommentSection from './LikeCommentSection';

const NewsCard = ({ article, darkMode, onBookmark, viewMode = 'grid' }) => {
  const [isBookmarked, setIsBookmarked] = useState(false);

  const checkIfBookmarked = useCallback(() => {
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
  }, [article.headline, article.sourceLink]);

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
  }, [checkIfBookmarked]);

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

  // Helper functions from local branch
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

  const articleDate = article.publishedAt || article.date || new Date().toISOString();

  return (
    <div 
      className={`card-hover ${viewMode === 'grid' ? 'rounded-lg' : 'p-4 border-b'} ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} shadow-md hover:shadow-lg transition-all ${viewMode === 'list' ? 'flex items-start' : 'flex flex-col h-full'}`}
    >
      {viewMode === 'grid' ? (
        <>
          {/* Sentiment Indicator Bar */}
          <div className={`h-1 ${getSentimentColor()} w-full rounded-t-lg`}></div>

          {/* Image and content - clickable to open article */}
          <div onClick={handleNewsClick} className="cursor-pointer flex-1 flex flex-col p-4 pt-2">
            {article.image ? (
              <div className="h-48 overflow-hidden rounded-lg mb-4 relative">
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
            
            {/* Metadata with Sentiment */}
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
              <span className="text-xs text-gray-500 dark:text-gray-400">{article.source}</span>
              <span className="text-xs text-gray-400">•</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">{formatDate(articleDate)}</span>
            </div>

            <h3 className="text-lg font-semibold line-clamp-2 mb-2">{article.headline}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-3 mb-4">
              {article.summary || article.description || 'No summary available.'}
            </p>
            
            {/* Likes and Comments */}
            <div onClick={(e) => e.stopPropagation()}>
                <LikeCommentSection article={article} />
            </div>
          </div>
          
          {/* Bottom bar with bookmark - NOT clickable for article */}
          <div className="flex justify-end items-center px-4 pb-4">
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
        <div className="flex w-full gap-4">
           {/* Sentiment Indicator (Vertical for list view?) or just color dot */}
           <div className={`w-2 self-stretch rounded-l-lg ${getSentimentColor()}`}></div>

          {/* Content - clickable to open article */}
          <div onClick={handleNewsClick} className="cursor-pointer flex gap-4 flex-1 p-2">
            {article.image ? (
              <div className="w-48 h-32 overflow-hidden rounded flex-shrink-0">
                <img
                  src={article.image}
                  alt={article.headline}
                  className="w-full h-full object-cover"
                  onError={(e) => e.target.style.display = 'none'}
                />
              </div>
            ) : (
              <div className={`w-48 h-32 flex items-center justify-center rounded flex-shrink-0 ${darkMode ? 'bg-gray-600' : 'bg-gray-100'}`}>
                <span className="text-gray-400 text-xs">No Image</span>
              </div>
            )}
            <div className="flex-1 flex flex-col">
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
                  <span className="text-xs text-gray-500 dark:text-gray-400">{article.source}</span>
                  <span className="text-xs text-gray-400">•</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{formatDate(articleDate)}</span>
                </div>

              <h3 className="text-lg font-semibold mb-1">{article.headline}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-2">
                {article.summary || article.description || 'No summary available.'}
              </p>
              
               {/* Likes and Comments */}
               <div onClick={(e) => e.stopPropagation()}>
                  <LikeCommentSection article={article} />
               </div>
            </div>
          </div>
          
          {/* Bookmark button - separate from clickable content */}
          <div className="p-2">
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
        </div>
      )}
    </div>
  );
};

export default NewsCard;