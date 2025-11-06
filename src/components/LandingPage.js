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
    <div className="max-w-6xl mx-auto py-4 px-4">
      <section className="mb-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
              {username}'s BrightFeed
            </h2>
            <h3 className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">
              LATEST STORIES
            </h3>
            <p className="text-lg mt-2 text-gray-600 dark:text-gray-300">
              Pick a category and dive in!
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={onOpenSubscribeModal}
              className="px-5 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors font-semibold text-sm"
              disabled={!isAuthenticated}
            >
              📧 Subscribe
            </button>
            <button
              onClick={() => openSentimentGraph('all')}
              className="px-5 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-semibold text-sm"
            >
              📊 Trends
            </button>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredCategories.map((category) => (
          <Link
            key={category}
            to={`/${category}`}
            className={`relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all hover:scale-105 border-l-4 ${getCategoryBorderColor(category)}`}
            style={{
              backgroundImage: `url(${getCategoryImage(category)})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              height: '140px',
            }}
          >
            <div className="absolute inset-0 bg-black/40 hover:bg-black/30 transition-all flex items-center justify-center">
              <h3 className="text-xl font-semibold text-white capitalize drop-shadow-lg">
                {category === "sport" ? "Sports" : category}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default LandingPage;