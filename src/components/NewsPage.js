import React, { useState, useEffect } from 'react';
import NewsCard from './NewsCard';
import Navigation from './Navigation';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

const NewsPage = ({ category, darkMode, searchQuery, openSentimentGraph }) => {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sentimentFilter, setSentimentFilter] = useState(null); // null, 'positive', 'negative', or 'neutral'
  const [viewMode, setViewMode] = useState('grid');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/api/news`);
        if (!response.ok) {
          throw new Error(`Fetch failed with status ${response.status}`);
        }
        const data = await response.json();
        const filtered = data.filter((article) =>
          article.category.toLowerCase() === category.toLowerCase()
        );
        setArticles(filtered);
        setFilteredArticles(filtered.filter(article =>
          article.headline.toLowerCase().includes(searchQuery.toLowerCase())
        ));
      } catch (error) {
        console.error('NewsPage fetch error:', error.message);
        setArticles([]);
        setFilteredArticles([]);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, [category, searchQuery]);

  const filterBySentiment = (sentimentType) => {
    setSentimentFilter(sentimentType);
    setCurrentIndex(0);
    if (sentimentType === null) {
      setFilteredArticles(articles.filter(article =>
        article.headline.toLowerCase().includes(searchQuery.toLowerCase())
      ));
      return;
    }

    const filtered = articles.filter((article) => {
      const compound = article.sentiment?.headline?.compound || 0;
      if (sentimentType === 'positive') return compound >= 0.05;
      if (sentimentType === 'negative') return compound <= -0.05;
      if (sentimentType === 'neutral') return compound > -0.05 && compound < 0.05;
      return true;
    }).filter(article =>
      article.headline.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredArticles(filtered);
  };

  const toggleBookmark = (article) => {
    // This will trigger the NewsCard's internal bookmark logic
    const event = new CustomEvent('bookmarksChanged');
    window.dispatchEvent(event);
  };

  const nextArticle = () => {
    setCurrentIndex((prev) => Math.min(prev + 3, filteredArticles.length - 3));
  };

  const prevArticle = () => {
    setCurrentIndex((prev) => Math.max(prev - 3, 0));
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto py-8 px-4 text-center">
        <p className={`text-xl ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          Loading articles...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-2 px-4">
      {/* Ultra-compact header - everything in one line */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-4 gap-3">
        <h2 className={`text-2xl font-bold capitalize ${darkMode ? 'text-white' : 'text-gray-800'}`}>
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
          
          {/* View mode */}
          <div className="flex gap-1 ml-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1 rounded-lg text-sm ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1 rounded-lg text-sm ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
            >
              List
            </button>
          </div>
          
          {/* Sentiment trends button */}
          <button
            onClick={() => openSentimentGraph(category)}
            className="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm ml-2"
          >
            📊 Trends
          </button>
        </div>
      </div>

      {/* Articles grid/list */}
      {filteredArticles.length > 0 ? (
        <div>
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
            {filteredArticles.slice(currentIndex, currentIndex + 3).map((article, index) => (
              <NewsCard
                key={`${article.headline}-${index}`}
                article={article}
                darkMode={darkMode}
                onBookmark={toggleBookmark}
                viewMode={viewMode}
              />
            ))}
          </div>
          <Navigation next={nextArticle} previous={prevArticle} darkMode={darkMode} />
        </div>
      ) : (
        <p className={`text-xl text-center py-12 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          {sentimentFilter ? `No ${sentimentFilter} ${category} news found.` : `No ${category} news matching "${searchQuery}"...`}
        </p>
      )}
    </div>
  );
};

export default NewsPage;