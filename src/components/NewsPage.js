import React, { useState, useEffect } from 'react';
import NewsCard from './NewsCard';
import Navigation from './Navigation';

const NewsPage = ({ category, darkMode }) => {
  const [articles, setArticles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/news');
        if (!response.ok) {
          throw new Error(`Fetch failed with status ${response.status}: ${response.statusText}`);
        }
        const data = await response.json();
        const filtered = data.filter((article) =>
          article.category.toLowerCase() === category.toLowerCase()
        );
        setArticles(filtered);
      } catch (error) {
        console.error('NewsPage fetch error:', error.message);
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
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex flex-col items-center mb-8">
        <h2 className={`text-3xl font-bold capitalize mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          {category === "sport" ? "Sports" : category} News
        </h2>
        {/* <div className="flex gap-4 mt-4">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
          >
            <span>Back</span>
            <span className="text-purple-400">➜</span>
          </button>
          <Link
            to="/"
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            <span>Home</span>
            <span className="text-purple-400">➜</span>
          </Link>
        </div> */}
      </div>
      {articles.length > 0 ? (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.slice(currentIndex, currentIndex + 3).map((article, index) => (
              <NewsCard key={index} article={article} darkMode={darkMode} />
            ))}
          </div>
          <Navigation next={nextArticle} previous={prevArticle} darkMode={darkMode} />
        </div>
      ) : (
        <p className={`text-xl text-center ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Loading {category} news...
        </p>
      )}
    </div>
  );
};

export default NewsPage;