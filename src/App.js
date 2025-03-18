import React, { useState, useEffect } from 'react';
import Article from './components/Article';
import Navigation from './components/Navigation';
import './App.css';

const App = () => {
  const [articles, setArticles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fetching articles
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch('/data/articles.json');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setArticles(data);
      } catch (error) {
        console.error('Error fetching articles:', error);
      }
    };
  
    fetchArticles();
  }, []);

  const nextArticle = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % articles.length);
  };

  const previousArticle = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + articles.length) % articles.length
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center py-10">
      <h1 className="text-4xl font-semibold text-center text-blue-600 mb-8">BrightFeed</h1>
      {articles.length > 0 ? (
        <div className="max-w-2xl w-full bg-white p-6 rounded-lg shadow-lg">
          <Article article={articles[currentIndex]} />
          <Navigation next={nextArticle} previous={previousArticle} />
        </div>
      ) : (
        <p className="text-xl text-gray-600">Loading...</p>
      )}
    </div>
  );
};

export default App;
