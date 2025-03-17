import React, { useState, useEffect } from 'react';
import Article from './components/Article';
import Navigation from './components/Navigation';
import './App.css';


const App = () => {
  const [articles, setArticles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Mock JSON data fo testing
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch('/data/articles.json');
        //Debugging the fetch issue
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
    <div>
      <h1>BrightFeed</h1>
      {articles.length > 0 ? (
        <>
          <Article article={articles[currentIndex]} />
          <Navigation next={nextArticle} previous={previousArticle} />
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default App;
