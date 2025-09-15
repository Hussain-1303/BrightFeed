import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import NewsPage from './components/NewsPage';
import './App.css';
import { FiHome, FiSun, FiMoon } from 'react-icons/fi';

const App = () => {
  const categories = ["art", "tech", "science", "world", "gaming", "sport", "business"];
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);
  const [showPositiveModal, setShowPositiveModal] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  const toggleTheme = () => setDarkMode(!darkMode);

  return (
    <Router>
      <div className="relative min-h-screen">
        <div
          className="absolute inset-0 bg-cover bg-center bg-fixed z-0"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1531746790731-6c087fecd65a?auto=format&fit=crop&w=1600&q=80')`,
            opacity: 0.15,
          }}
        />

        <div className="relative z-10 flex flex-col min-h-screen bg-white/70 dark:bg-gray-900/80 backdrop-blur-sm transition-colors duration-300">
          {/* Sticky Header */}
          <header className="sticky top-0 z-50 bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-4 shadow-sm">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
              <h1 className="text-4xl font-extrabold tracking-tight text-blue-600 dark:text-blue-400">
                <Link to="/">BRIGHT FEED</Link>
              </h1>
              <div className="flex items-center gap-4">
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  aria-label="Toggle dark mode"
                >
                  {darkMode ? <FiSun className="text-yellow-300" /> : <FiMoon className="text-gray-600" />}
                </button>
                <Link
                  to="/"
                  className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  aria-label="Home"
                >
                  <FiHome className={darkMode ? "text-white" : "text-gray-800"} />
                </Link>
              </div>
            </div>
          </header>

          <main className="flex-grow">
            <Routes>
              <Route
                path="/"
                element={
                  <LandingPage
                    categories={categories}
                    darkMode={darkMode}
                    onOpenSubscribeModal={() => setShowSubscribeModal(true)}
                  />
                }
              />
              {categories.map((category) => (
                <Route
                  key={category}
                  path={`/${category}`}
                  element={<NewsPage category={category} darkMode={darkMode} />}
                />
              ))}
            </Routes>
          </main>

          <footer className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 p-4 shadow-inner">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-2">
              <p className="text-lg font-semibold">BRIGHT FEED © 2025</p>
              <p className="text-sm italic">Fresh news daily—stay curious, stay connected.</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowPositiveModal(true)}
                  className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
                >
                  Positive Newsletter 💖
                </button>
              </div>
            </div>
          </footer>

          {/* Modals */}
          {showSubscribeModal && (
            <SubscribeModal
              categories={categories}
              onClose={() => setShowSubscribeModal(false)}
              darkMode={darkMode}
            />
          )}
          {showPositiveModal && (
            <PositiveNewsletterModal
              onClose={() => setShowPositiveModal(false)}
              darkMode={darkMode}
            />
          )}
        </div>
      </div>
    </Router>
  );
};

// Landing Page Component
const LandingPage = ({ categories, darkMode, onOpenSubscribeModal }) => (
  <div className="max-w-6xl mx-auto py-8 px-4">
    <section className="mb-12 text-center">
      <h2 className="text-4xl font-bold mb-2 text-gray-800 dark:text-white">YOUR POWER GRIEVER TO THE</h2>
      <h2 className="text-4xl font-bold mb-6 text-blue-600 dark:text-blue-400">LATEST STORIES</h2>
      <p className="text-xl mb-4 text-gray-600 dark:text-gray-300">PICK A CATEGORY AND DIVE IN!</p>
      <button
        onClick={onOpenSubscribeModal}
        className="px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
      >
        Subscribe to Category
      </button>
    </section>

    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {categories.map((category) => (
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

// Subscribe Modal Component
const SubscribeModal = ({ categories, onClose, darkMode }) => {
  const [email, setEmail] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Subscribed ${email} to ${selectedCategory} news!`);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className={`rounded-2xl shadow-xl p-8 w-full max-w-md relative ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-xl text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white"
        >
          ✕
        </button>
        <h2 className="text-3xl font-bold mb-2 text-pink-600 dark:text-pink-400">Subscribe!</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={`w-full p-3 border rounded-lg ${darkMode ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' : 'border-pink-300 text-pink-700 placeholder-pink-300'}`}
            placeholder="you@example.com"
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className={`w-full p-3 border rounded-lg ${darkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-pink-300 text-pink-700'}`}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat === "sport" ? "Sports" : cat}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="w-full bg-pink-500 text-yellow-200 font-semibold py-2 rounded-lg hover:bg-pink-600 transition"
          >
            Subscribe
          </button>
        </form>
      </div>
    </div>
  );
};

// Positive Newsletter Modal Component
const PositiveNewsletterModal = ({ onClose, darkMode }) => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`You're signed up for Positive Vibes at ${email} ✨`);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className={`rounded-2xl shadow-xl p-8 w-full max-w-md relative border border-pink-300 ${darkMode ? 'bg-gray-800 text-pink-300' : 'bg-pink-100 text-pink-800'}`}>
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-2xl text-pink-600 hover:text-pink-800 dark:text-pink-400 dark:hover:text-pink-200"
        >
          ✕
        </button>
        <h2 className="text-3xl font-bold mb-2 text-pink-600 dark:text-pink-400">Positive Newsletter 💖</h2>
        <p className="text-pink-500 dark:text-pink-300 mb-6">Enter your email to get feel-good stories and uplifting news!</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={`w-full p-3 border rounded-lg ${darkMode ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' : 'border-pink-300 text-pink-700 placeholder-pink-300'}`}
            placeholder="you@example.com"
          />
          <button
            type="submit"
            className="w-full bg-pink-500 text-yellow-200 font-semibold py-2 rounded-lg hover:bg-pink-600 transition"
          >
            Get Your Preferred News Articles!
          </button>
        </form>
      </div>
    </div>
  );
};

// Helper functions
const getCategoryIcon = (category) => {
  const icons = {
    art: '🎨',
    tech: '💻',
    science: '🔬',
    world: '🌍',
    gaming: '🎮',
    sport: '⚽',
    business: '💼'
  };
  return icons[category] || '📰';
};

const getCategoryBorderColor = (category) => {
  const colors = {
    art: 'border-purple-500',
    tech: 'border-blue-500',
    science: 'border-green-500',
    world: 'border-yellow-500',
    gaming: 'border-red-500',
    sport: 'border-orange-500',
    business: 'border-indigo-500'
  };
  return colors[category] || 'border-gray-500';
};

const getCategoryIconColor = (category) => {
  const colors = {
    art: 'text-purple-500',
    tech: 'text-blue-500',
    science: 'text-green-500',
    world: 'text-yellow-500',
    gaming: 'text-red-500',
    sport: 'text-orange-500',
    business: 'text-indigo-500'
  };
  return colors[category] || 'text-gray-500';
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
    return images[category];
}
export default App;
