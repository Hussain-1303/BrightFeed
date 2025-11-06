import React, { useState, useEffect } from 'react';
import NewsCard from './NewsCard';
import Navigation from './Navigation';

const NewsPage = ({ category, darkMode }) => {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]); // For sentiment filtering
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sentimentFilter, setSentimentFilter] = useState(null); // null, 'positive', 'negative', or 'neutral'

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
        setFilteredArticles(filtered); // Initially show all articles
      } catch (error) {
        console.error('NewsPage fetch error:', error.message);
      }
    };
    fetchArticles();
  }, [category]);

  // Filter articles by sentiment
  const filterBySentiment = (sentimentType) => {
    setSentimentFilter(sentimentType);
    setCurrentIndex(0); // Reset pagination
    if (sentimentType === null) {
      setFilteredArticles(articles); // Reset to all articles
      return;
    }

    const filtered = articles.filter((article) => {
      const compound = article.sentiment?.headline?.compound || 0;
      if (sentimentType === 'positive') return compound >= 0.05;
      if (sentimentType === 'negative') return compound <= -0.05;
      if (sentimentType === 'neutral') return compound > -0.05 && compound < 0.05;
      return true;
    });
    setFilteredArticles(filtered);
  };

  const nextArticle = () => {
    setCurrentIndex((prev) => Math.min(prev + 3, filteredArticles.length - 3));
  };

  const prevArticle = () => {
    setCurrentIndex((prev) => Math.max(prev - 3, 0));
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex flex-col items-center mb-8">
        <h2 className={`text-3xl font-bold capitalize mb-2 ${darkMode ? 'text-white' : 'text-neutral-800'}`}>
          {category === "sport" ? "Sports" : category} News
        </h2>
        {/* Sentiment Filter Buttons */}
        <div className="flex gap-2 mb-4 flex-wrap justify-center">
          <button
            onClick={() => filterBySentiment('positive')}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200
              ${sentimentFilter === 'positive' 
                ? 'bg-success-500 text-white shadow-md hover:bg-success-600' 
                : darkMode 
                  ? 'bg-neutral-700 text-neutral-300 hover:bg-neutral-600' 
                  : 'bg-neutral-200 text-neutral-700 hover:bg-neutral-300'
              }`}
          >
            😊 Positive
          </button>
          <button
            onClick={() => filterBySentiment('negative')}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200
              ${sentimentFilter === 'negative' 
                ? 'bg-error-500 text-white shadow-md hover:bg-error-600' 
                : darkMode 
                  ? 'bg-neutral-700 text-neutral-300 hover:bg-neutral-600' 
                  : 'bg-neutral-200 text-neutral-700 hover:bg-neutral-300'
              }`}
          >
            😢 Negative
          </button>
          <button
            onClick={() => filterBySentiment('neutral')}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200
              ${sentimentFilter === 'neutral' 
                ? 'bg-warning-500 text-white shadow-md hover:bg-warning-600' 
                : darkMode 
                  ? 'bg-neutral-700 text-neutral-300 hover:bg-neutral-600' 
                  : 'bg-neutral-200 text-neutral-700 hover:bg-neutral-300'
              }`}
          >
            😐 Neutral
          </button>
          <button
            onClick={() => filterBySentiment(null)}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200
              ${sentimentFilter === null 
                ? 'bg-brand-500 text-white shadow-md hover:bg-brand-600' 
                : darkMode 
                  ? 'bg-neutral-700 text-neutral-300 hover:bg-neutral-600' 
                  : 'bg-neutral-200 text-neutral-700 hover:bg-neutral-300'
              }`}
          >
            📰 All News
          </button>
        </div>
      </div>
      {filteredArticles.length > 0 ? (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.slice(currentIndex, currentIndex + 3).map((article, index) => (
              <NewsCard key={index} article={article} darkMode={darkMode} />
            ))}
          </div>
          <Navigation next={nextArticle} previous={prevArticle} darkMode={darkMode} />
        </div>
      ) : (
        <p className={`text-xl text-center ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          {sentimentFilter ? `No ${sentimentFilter} ${category} news found.` : `Loading ${category} news...`}
        </p>
      )}
    </div>
  );
};

export default NewsPage;