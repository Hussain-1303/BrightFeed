import React from 'react';

const NewsCard = ({ article, darkMode }) => {
  // Format the date with a fallback for invalid dates
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toString() !== "Invalid Date" ? date.toLocaleDateString() : "Unknown Date";
  };

  // Determine sentiment emoji based on compound score
  const getSentimentEmoji = (sentiment) => {
    const compound = sentiment?.headline?.compound || 0; // Use headline sentiment
    if (compound >= 0.05) return '😊'; // Positive
    if (compound <= -0.05) return '😢'; // Negative
    return '😐'; // Neutral
  };

  return (
    <div className={`relative rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:scale-[1.02] 
      ${darkMode ? 'bg-gray-700' : 'bg-white'} card-hover`}
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-purple-500"></div>
      
      {article.image ? (
        <div className="h-48 overflow-hidden">
          <img
            src={article.image}
            alt={article.headline}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
          />
        </div>
      ) : (
        <div className={`w-full h-48 flex items-center justify-center 
          ${darkMode ? 'bg-gray-600' : 'bg-gray-100'}`}
        >
          <span className="text-gray-400">No Image Available</span>
        </div>
      )}
      
      <div className="p-6">
        <div className="flex items-center mb-3">
          <span className={`px-2 py-1 text-xs font-semibold rounded-full 
            ${darkMode ? 'bg-gray-600 text-white' : 'bg-blue-100 text-blue-800'}`}
          >
            {article.category}
          </span>
          <span className="ml-2 text-lg">{getSentimentEmoji(article.sentiment)}</span>
          <span className="ml-auto text-sm text-gray-500 dark:text-gray-400">
            {formatDate(article.date)}
          </span>
        </div>
        
        <h3 className={`text-xl font-bold mb-2 line-clamp-2 
          ${darkMode ? 'text-white' : 'text-gray-800'}`}
        >
          {article.headline}
        </h3>
        
        <p className={`mb-4 line-clamp-3 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          {article.summary}
        </p>
        
        <a
          href={article.sourceLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
        >
          Read Full Story
          <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </a>
      </div>
    </div>
  );
};

export default NewsCard;