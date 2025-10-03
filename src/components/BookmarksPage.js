import React from 'react';
import { useNavigate } from 'react-router-dom';
import NewsCard from './NewsCard';

const BookmarksPage = ({ darkMode }) => {
  const navigate = useNavigate();
  const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h2 className={`text-3xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Bookmarked Stories</h2>
      {bookmarks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookmarks.map((article, index) => (
            <NewsCard key={index} article={article} darkMode={darkMode} onBookmark={() => {}} />
          ))}
        </div>
      ) : (
        <p className={`text-xl text-center ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>No bookmarked stories yet.</p>
      )}
      <button
        onClick={() => navigate(-1)}
        className={`mt-6 px-4 py-2 rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} transition-colors`}
      >
        Back
      </button>
    </div>
  );
};

export default BookmarksPage;