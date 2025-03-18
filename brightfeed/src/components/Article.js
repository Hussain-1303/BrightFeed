import React from 'react';

const Article = ({ article }) => {
  return (
    <div className="mb-6">
      <h2 className="text-2xl font-semibold text-gray-800">{article.headline}</h2>
      <p className="text-lg text-gray-700 mt-4">{article.content}</p>
      <a
        href={article.sourceLink}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 hover:underline mt-4 block"
      >
        Read full article
      </a>
    </div>
  );
};

export default Article;
