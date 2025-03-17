import React from 'react';

const Article = ({ article }) => {
  return (
    <div>
      <h2>{article.headline}</h2>
      <p>{article.content}</p>
      <a href={article.sourceLink} target="_blank" rel="noopener noreferrer">
        Read full article
      </a>
    </div>
  );
};

export default Article;
