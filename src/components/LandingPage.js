import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = ({ categories, darkMode, onOpenSubscribeModal, isAuthenticated }) => {
  const username = localStorage.getItem('username') || 'User'; // Fallback if no username

  // Helper functions
  const getCategoryBorderColor = (category) => {
    const colors = {
      art: 'border-l-4 border-l-violet-600',
      tech: 'border-l-4 border-l-sky-600',
      science: 'border-l-4 border-l-emerald-700',
      world: 'border-l-4 border-l-amber-700',
      gaming: 'border-l-4 border-l-red-700',
      sport: 'border-l-4 border-l-orange-700',
      business: 'border-l-4 border-l-indigo-700',
    };
    return colors[category] || 'border-l-4 border-l-neutral-500';
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

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <section className="mb-12 text-center">
        <h2 className="text-4xl font-bold mb-2 text-gray-800 dark:text-white">{username}'s BrightFeed</h2>
        <h2 className="text-4xl font-bold mb-6 text-brand-600 dark:text-brand-400">LATEST STORIES</h2>
        <p className="text-xl mb-4 text-gray-600 dark:text-gray-300">PICK A CATEGORY AND DIVE IN!</p>
        <button
          onClick={onOpenSubscribeModal}
          className="px-6 py-2 bg-accent-500 text-white rounded-lg hover:bg-accent-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!isAuthenticated}
        >
          Subscribe to Category
        </button>
      </section>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {categories.map((category) => (
          <Link
            key={category}
            to={`/${category}`}
            className={`relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all ${getCategoryBorderColor(category)}`}
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