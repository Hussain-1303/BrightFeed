import React from 'react';

const NewsCard = ({ article }) => {
  return (
    <div className="relative bg-white rounded-2xl shadow-md overflow-hidden">
      <div className="absolute top-2 right-2 text-purple-400 text-xl">➜</div>
      {article.image ? (
        <img
          src={article.image}
          alt={article.headline}
          className="w-full h-48 object-cover"
        />
      ) : (
        <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
          <span className="text-gray-500">No Image</span>
        </div>
      )}
      <div className="p-5">
        <h3 className="text-xl font-semibold text-blue-600 mb-2 line-clamp-2">
          {article.headline}
        </h3>
        <p className="text-gray-600 mb-3 line-clamp-3">{article.summary}</p>
        <a
          href={article.sourceLink}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:text-blue-700 font-medium"
        >
          Read Full Story
        </a>
      </div>
    </div>
  );
};

export default NewsCard;