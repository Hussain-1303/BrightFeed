import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = ({ categories, darkMode, onOpenSubscribeModal, isAuthenticated, searchQuery, openSentimentGraph }) => {
  const username = localStorage.getItem('username') || 'User';

  const getCategoryBorderColor = (category) => {
    const colors = {
      art: 'border-purple-500',
      tech: 'border-blue-500',
      science: 'border-green-500',
      world: 'border-yellow-500',
      gaming: 'border-red-500',
      sport: 'border-orange-500',
      business: 'border-indigo-500',
    };
    return colors[category] || 'border-gray-500';
  };

  const getCategoryImage = (category) => {
    const images = {
      art: "/images/cards/art.png",
      tech: "/images/cards/tech.png",
      science: "/images/cards/science.png",
      world: "/images/cards/world.png",
      gaming: "/images/cards/gaming.png",
      sport: "/images/cards/sport.png",
      business: "/images/cards/business.png",
    };
    return images[category] || '/images/cards/default.png';
  };

  const filteredCategories = categories.filter(cat => 
    cat.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <section className="mb-12 text-center">
        <h2 className="text-4xl font-bold mb-2 text-gray-800 dark:text-white">{username}'s BrightFeed</h2>
        <h2 className="text-4xl font-bold mb-6 text-blue-600 dark:text-blue-400">LATEST STORIES</h2>
        <p className="text-xl mb-4 text-gray-600 dark:text-gray-300">PICK A CATEGORY AND DIVE IN!</p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onOpenSubscribeModal}
            className="px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
            disabled={!isAuthenticated}
          >
            Subscribe to Category
          </button>
          <button
            onClick={() => openSentimentGraph('all')}
            className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            View Sentiment Trends
          </button>
        </div>
      </section>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredCategories.map((category) => (
          <Link
            key={category}
            to={`/${category}`}
            className={`relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all border-l-4 ${getCategoryBorderColor(category)}`}
            style={{
              backgroundImage: `url(${getCategoryImage(category)})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              height: '160px',
            }}
          >
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <h3 className="text-2xl font-semibold text-white capitalize drop-shadow">
                {category === "sport" ? "Sports" : category} News
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default LandingPage;