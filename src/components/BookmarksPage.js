import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NewsCard from './NewsCard';

const BookmarksPage = ({ darkMode }) => {
  const navigate = useNavigate();
  const [bookmarks, setBookmarks] = useState([]);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    // Load bookmarks from localStorage
    const loadBookmarks = () => {
      const stored = JSON.parse(localStorage.getItem('bookmarks') || '[]');
      setBookmarks(stored);
    };
    
    loadBookmarks();
    
    // Listen for storage changes (in case bookmarks are modified in another tab)
    window.addEventListener('storage', loadBookmarks);
    
    return () => window.removeEventListener('storage', loadBookmarks);
  }, [refresh]);

  const handleBookmarkToggle = (article) => {
    // Force refresh after bookmark change
    setRefresh(prev => prev + 1);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h2 className={`text-3xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
        📖 Bookmarked Stories
      </h2>
      {bookmarks.length > 0 ? (
        <>
          <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            You have {bookmarks.length} saved {bookmarks.length === 1 ? 'article' : 'articles'}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookmarks.map((article, index) => (
              <NewsCard 
                key={`${article.headline}-${index}`} 
                article={article} 
                darkMode={darkMode} 
                onBookmark={handleBookmarkToggle}
                viewMode="grid"
              />
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <p className={`text-xl mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            No bookmarked stories yet.
          </p>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Browse news and click the bookmark icon to save articles for later!
          </p>
        </div>
      )}
      <button
        onClick={() => navigate('/')}
        className={`mt-6 px-4 py-2 rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} transition-colors font-semibold`}
      >
        ← Back to Home
      </button>
    </div>
  );
};

export default BookmarksPage;