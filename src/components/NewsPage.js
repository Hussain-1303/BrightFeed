import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import NewsCard from './NewsCard';
import Navigation from './Navigation';

const NewsPage = ({ category, darkMode, searchQuery, openSentimentGraph }) => {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sentimentFilter, setSentimentFilter] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch(`http://localhost:5001/api/news`);
        if (!response.ok) {
          throw new Error(`Fetch failed with status ${response.status}: ${response.statusText}`);
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

  const nextArticle = () => {
    setCurrentIndex((prev) => Math.min(prev + 3, filteredArticles.length - 3));
  };

  const prevArticle = () => {
    setCurrentIndex((prev) => Math.max(prev - 3, 0));
  };

  const extractTags = (title) => {
    const words = title.split(' ').filter(w => w.length > 3);
    return words.slice(0, 3); // Mock tag extraction
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex flex-col items-center mb-8">
        <h2 className={`text-3xl font-bold capitalize mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          {category === "sport" ? "Sports" : category} News
        </h2>
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => filterBySentiment('positive')}
            className={`px-3 py-1 rounded-lg ${sentimentFilter === 'positive' ? 'bg-blue-500 text-white' : darkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
          >
            😊 Positive
          </button>
          <button
            onClick={() => filterBySentiment('negative')}
            className={`px-3 py-1 rounded-lg ${sentimentFilter === 'negative' ? 'bg-blue-500 text-white' : darkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
          >
            😢 Negative
          </button>
          <button
            onClick={() => filterBySentiment('neutral')}
            className={`px-3 py-1 rounded-lg ${sentimentFilter === 'neutral' ? 'bg-blue-500 text-white' : darkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
          >
            😐 Neutral
          </button>
          <button
            onClick={() => filterBySentiment(null)}
            className={`px-3 py-1 rounded-lg ${sentimentFilter === null ? 'bg-blue-500 text-white' : darkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
          >
            All
          </button>
        </div>
        <button
          onClick={() => openSentimentGraph(category)}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 mb-4"
        >
          View Sentiment Trends
        </button>
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
          {sentimentFilter ? `No ${sentimentFilter} ${category} news found.` : `No ${category} news matching "${searchQuery}"...`}
        </p>
      )}
    </div>
  );
};

export default NewsPage;