import React from 'react';

const NewsCard = ({ article, darkMode }) => {
  // Format the date with a fallback for invalid dates
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toString() !== "Invalid Date" ? date.toLocaleDateString() : "Unknown Date";
  };

  return (
    <div className={`relative rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:scale-[1.02] 
      ${darkMode ? 'bg-neutral-700' : 'bg-white'} card-hover`}
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-400 to-brand-600"></div>
      
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
          ${darkMode ? 'bg-neutral-600' : 'bg-neutral-100'}`}
        >
          <span className="text-neutral-400">No Image Available</span>
        </div>
      )}
      
      <div className="p-6">
        <div className="flex items-center mb-3">
          <span className={`px-2 py-1 text-xs font-semibold rounded-full 
            ${darkMode ? 'bg-neutral-600 text-white' : 'bg-brand-100 text-brand-800'}`}
          >
            {article.category}
          </span>
          <span className="ml-auto text-sm text-neutral-500 dark:text-neutral-400">
            {formatDate(article.date)} {/* Updated to use formatDate */}
          </span>
        </div>
        
        <h3 className={`text-xl font-bold mb-2 line-clamp-2 
          ${darkMode ? 'text-white' : 'text-neutral-800'}`}
        >
          {article.headline}
        </h3>
        
        <p className={`mb-4 line-clamp-3 ${darkMode ? 'text-neutral-300' : 'text-neutral-600'}`}>
          {article.summary}
        </p>
        
        <a
          href={article.sourceLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-brand-500 hover:text-brand-600 dark:text-brand-400 dark:hover:text-brand-300 font-medium"
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