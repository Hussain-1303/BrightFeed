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
        {/* 🌄 Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-fixed z-0"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1531746790731-6c087fecd65a?auto=format&fit=crop&w=1600&q=80')`,
            opacity: 0.15,
          }}
        />

        {/* Foreground App Content */}
        <div className="relative z-10 flex flex-col min-h-screen bg-white/70 dark:bg-neutral-900/80 backdrop-blur-sm transition-colors duration-300">
          {/* Sticky Header */}
          <header className="sticky top-0 z-50 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white p-4 shadow-lg">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
              <h1 className="text-4xl font-extrabold tracking-tight text-brand-500 dark:text-brand-400">
                <Link to="/">BRIGHT FEED</Link>
              </h1>
              <div className="flex items-center gap-4">
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-full bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-600 transition-colors"
                  aria-label="Toggle dark mode"
                >
                  {darkMode ? <FiSun className="text-warning-400" /> : <FiMoon className="text-neutral-600" />}
                </button>
                <Link
                  to="/"
                  className="p-2 rounded-full bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-600 transition-colors"
                  aria-label="Home"
                >
                  <FiHome className={darkMode ? "text-white" : "text-neutral-800"} />
                </Link>
              </div>
            </div>
          </header>

          {/* Main Content */}
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

          {/* Footer */}
          <footer className="bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 p-4 shadow-inner">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-2">
              <p className="text-lg font-semibold">BRIGHT FEED © 2025</p>
              <p className="text-sm italic">Fresh news daily—stay curious, stay connected.</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowPositiveModal(true)}
                  className="px-4 py-2 bg-accent-500 text-white rounded-lg hover:bg-accent-600 transition-colors shadow-md"
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
      <h2 className="text-4xl font-bold mb-2 text-neutral-800 dark:text-white">YOUR POWER GRIEVER TO THE</h2>
      <h2 className="text-4xl font-bold mb-6 text-brand-500 dark:text-brand-400">LATEST STORIES</h2>
      <p className="text-xl mb-4 text-neutral-600 dark:text-neutral-300">PICK A CATEGORY AND DIVE IN!</p>
      <button
        onClick={onOpenSubscribeModal}
        className="px-6 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors shadow-md"
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
      <div className={`rounded-2xl shadow-xl p-8 w-full max-w-md relative ${darkMode ? 'bg-neutral-800 text-white' : 'bg-white text-neutral-900'}`}>
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-xl text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
        >
          ✕
        </button>
        <h2 className="text-3xl font-bold mb-2 text-brand-500 dark:text-brand-400">Subscribe!</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={`w-full p-3 border rounded-lg ${darkMode ? 'border-neutral-600 bg-neutral-700 text-white placeholder-neutral-400' : 'border-brand-300 text-brand-700 placeholder-brand-300'}`}
            placeholder="you@example.com"
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className={`w-full p-3 border rounded-lg ${darkMode ? 'border-neutral-600 bg-neutral-700 text-white' : 'border-brand-300 text-brand-700'}`}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat === "sport" ? "Sports" : cat}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="w-full bg-brand-500 text-white font-semibold py-2 rounded-lg hover:bg-brand-600 transition shadow-md"
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
      <div className={`rounded-2xl shadow-xl p-8 w-full max-w-md relative border border-accent-300 ${darkMode ? 'bg-neutral-800 text-accent-300' : 'bg-accent-50 text-accent-800'}`}>
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-2xl text-accent-600 hover:text-accent-800 dark:text-accent-400 dark:hover:text-accent-200"
        >
          ✕
        </button>
        <h2 className="text-3xl font-bold mb-2 text-accent-600 dark:text-accent-400">Positive Newsletter 💖</h2>
        <p className="text-accent-500 dark:text-accent-300 mb-6">Enter your email to get feel-good stories and uplifting news!</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={`w-full p-3 border rounded-lg ${darkMode ? 'border-neutral-600 bg-neutral-700 text-white placeholder-neutral-400' : 'border-accent-300 text-accent-700 placeholder-accent-300'}`}
            placeholder="you@example.com"
          />
          <button
            type="submit"
            className="w-full bg-accent-500 text-white font-semibold py-2 rounded-lg hover:bg-accent-600 transition shadow-md"
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
    art: 'border-l-4 border-purple-600',
    tech: 'border-l-4 border-blue-600', 
    science: 'border-l-4 border-emerald-600',
    world: 'border-l-4 border-amber-600',
    gaming: 'border-l-4 border-red-600',
    sport: 'border-l-4 border-orange-600',
    business: 'border-l-4 border-indigo-600'
  };
  return colors[category] || 'border-l-4 border-neutral-500';
};

const getCategoryIconColor = (category) => {
  const colors = {
    art: 'text-purple-500',
    tech: 'text-blue-500',
    science: 'text-emerald-500',
    world: 'text-amber-500',
    gaming: 'text-red-500',
    sport: 'text-orange-500',
    business: 'text-indigo-500'
  };
  return colors[category] || 'text-neutral-500';
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
