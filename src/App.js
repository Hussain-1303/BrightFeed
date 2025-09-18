import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import NewsPage from './components/NewsPage';
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import LandingPage from './components/LandingPage'; // Import the new component
import SubscribeModal from './components/SubscribeModal'; // Assuming this exists or create it
import PositiveNewsletterModal from './components/PositiveNewsletterModal'; // Assuming this exists or create it
import './App.css';
import { FiHome, FiSun, FiMoon, FiUser } from 'react-icons/fi';

const App = () => {
  const categories = ["art", "tech", "science", "world", "gaming", "sport", "business"];
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);
  const [showPositiveModal, setShowPositiveModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  const toggleTheme = () => setDarkMode(!darkMode);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

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
          <header className="sticky top-0 z-50 bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-4 shadow-sm">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
              <h1 className="text-4xl font-extrabold tracking-tight text-blue-600 dark:text-blue-400">
                <Link to={isAuthenticated ? "/" : "/signin"}>BRIGHT FEED</Link>
              </h1>
              <div className="flex items-center gap-4">
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  aria-label="Toggle dark mode"
                >
                  {darkMode ? <FiSun className="text-yellow-300" /> : <FiMoon className="text-gray-600" />}
                </button>
                {isAuthenticated ? (
                  <>
                    <Link
                      to="/"
                      className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                      aria-label="Home"
                    >
                      <FiHome className={darkMode ? "text-white" : "text-gray-800"} />
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                      aria-label="Logout"
                    >
                      <FiUser className={darkMode ? "text-white" : "text-gray-800"} />
                    </button>
                  </>
                ) : (
                  <Link
                    to="/signin"
                    className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    aria-label="Sign In"
                  >
                    <FiUser className={darkMode ? "text-white" : "text-gray-800"} />
                  </Link>
                )}
              </div>
            </div>
          </header>

          <main className="flex-grow">
            <Routes>
              <Route
                path="/"
                element={
                  isAuthenticated ? (
                    <LandingPage
                      categories={categories}
                      darkMode={darkMode}
                      onOpenSubscribeModal={() => setShowSubscribeModal(true)}
                      isAuthenticated={isAuthenticated}
                    />
                  ) : (
                    <Navigate to="/signin" />
                  )
                }
              />
              {categories.map((category) => (
                <Route
                  key={category}
                  path={`/${category}`}
                  element={
                    isAuthenticated ? (
                      <NewsPage category={category} darkMode={darkMode} />
                    ) : (
                      <Navigate to="/signin" />
                    )
                  }
                />
              ))}
              <Route path="/signup" element={<SignUp />} />
              <Route path="/signin" element={<SignIn setIsAuthenticated={setIsAuthenticated} />} />
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
                  disabled={!isAuthenticated}
                >
                  Positive Newsletter 💖
                </button>
              </div>
            </div>
          </footer>

          {showSubscribeModal && isAuthenticated && (
            <SubscribeModal
              categories={categories}
              onClose={() => setShowSubscribeModal(false)}
              darkMode={darkMode}
            />
          )}
          {showPositiveModal && isAuthenticated && (
            <PositiveNewsletterModal
              onClose={() => setShowPositiveModal(false)}
              darkMode={darkMode}
            />
          )}
        </div>
      </div>
    </Router>
  );

  // Removed inline LandingPage, SubscribeModal, PositiveNewsletterModal definitions
};

export default App;