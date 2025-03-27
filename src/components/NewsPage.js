import React, { useState, useEffect } from 'react';
import NewsCard from './NewsCard';
import Navigation from './Navigation';

const NewsPage = ({ category }) => {
  const [articles, setArticles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/news');
        if (!response.ok) throw new Error('Fetch failed');
        const data = await response.json();
        const filtered = data.filter((article) =>
          article.category.toLowerCase() === category.toLowerCase()
        );
        setArticles(filtered);
      } catch (error) {
        console.error('NewsPage fetch error:', error);
      }
    };
    fetchArticles();
  }, [category]);

  const nextArticle = () => {
    setCurrentIndex((prev) => Math.min(prev + 3, articles.length - 3));
  };

  const prevArticle = () => {
    setCurrentIndex((prev) => Math.max(prev - 3, 0));
  };

  return (
    <div className="max-w-7xl mx-auto py-12 px-4">
      <h2 className="text-4xl font-bold text-blue-600 mb-8 capitalize">
        {category} News
      </h2>
      {articles.length > 0 ? (
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.slice(currentIndex, currentIndex + 3).map((article, index) => (
              <NewsCard key={index} article={article} />
            ))}
          </div>
          <Navigation next={nextArticle} previous={prevArticle} />
        </div>
      ) : (
        <p className="text-xl text-blue-500">Loading {category} news...</p>
      )}
    </div>
  );
};

export default NewsPage;