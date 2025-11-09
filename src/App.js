import React, { useState, useEffect, useRef } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  Navigate,
  useNavigate,
} from "react-router-dom";
import NewsPage from "./components/NewsPage";
import SignUp from "./components/SignUp";
import SignIn from "./components/SignIn";
import LandingPage from "./components/LandingPage";
import SubscribeModal from "./components/SubscribeModal";
import PositiveNewsletterModal from "./components/PositiveNewsletterModal";
import ProfileSettings from "./components/ProfileSettings";
import SentimentGraph from "./components/SentimentGraph";
import UserPreferences from "./components/UserPreferences";
import BookmarksPage from "./components/BookmarksPage";
import "./App.css";
import { FiSun, FiMoon, FiUser, FiSearch } from "react-icons/fi";

// API Configuration
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5001";

// Wrapper component to handle navigation
const AppContent = () => {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const categories = [
    "art",
    "tech",
    "science",
    "world",
    "gaming",
    "sport",
    "business",
  ];
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("darkMode") === "true"
  );
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);
  const [showPositiveModal, setShowPositiveModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [liveHeadlines, setLiveHeadlines] = useState([]);
  const [showSentimentGraph, setShowSentimentGraph] = useState(false);
  const [userPreferences, setUserPreferences] = useState(() =>
    JSON.parse(localStorage.getItem("preferences") || "{}")
  );
  const [sentimentCategory, setSentimentCategory] = useState("all");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("darkMode", darkMode);
    localStorage.setItem("preferences", JSON.stringify(userPreferences));

    const fetchHeadlines = async () => {
      try {
        const response = await fetch(`${API_URL}/api/news`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const headlines = data.map((article) => article.headline).slice(0, 5);
        setLiveHeadlines(headlines);
      } catch (error) {
        console.error("Error fetching headlines:", error);
        setLiveHeadlines([
          "Unable to load headlines. Check backend connection.",
        ]);
      }
    };

    fetchHeadlines();
    const interval = setInterval(fetchHeadlines, 60000);
    return () => clearInterval(interval);
  }, [darkMode, userPreferences]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    };

    if (showProfileDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showProfileDropdown]);

  const toggleTheme = () => setDarkMode(!darkMode);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setIsAuthenticated(false);
    setShowProfileDropdown(false);
    navigate("/signin");
  };

  const openSentimentGraph = (category) => {
    setSentimentCategory(category);
    setShowSentimentGraph(true);
  };

  const handlePreferenceChange = (category, priority) => {
    setUserPreferences((prev) => ({ ...prev, [category]: priority }));
  };

  const handleMenuItemClick = (action) => {
    setShowProfileDropdown(false);
    action();
  };

  return (
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
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search news..."
                  className="w-64 p-2 rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white pl-8"
                />
                <FiSearch className="absolute left-2 top-2 text-gray-500 dark:text-gray-400" />
              </div>
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                aria-label="Toggle dark mode"
              >
                {darkMode ? (
                  <FiSun className="text-yellow-300" />
                ) : (
                  <FiMoon className="text-gray-600" />
                )}
              </button>
              {isAuthenticated ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                    className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    aria-label="Profile"
                  >
                    <FiUser
                      className={darkMode ? "text-white" : "text-gray-800"}
                    />
                  </button>
                  {showProfileDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
                      <button
                        onClick={() => handleMenuItemClick(() => navigate("/bookmarks"))}
                        className="w-full text-left px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-t-lg"
                      >
                        📖 My Bookmarks
                      </button>
                      <button
                        onClick={() => handleMenuItemClick(() => navigate("/profile-settings"))}
                        className="w-full text-left px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        ⚙️ Profile Settings
                      </button>
                      <button
                        onClick={() => handleMenuItemClick(() => navigate("/preferences"))}
                        className="w-full text-left px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        🎯 Preferences
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border-t border-gray-200 dark:border-gray-700 rounded-b-lg"
                      >
                        🚪 Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/signin"
                  className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  aria-label="Sign In"
                >
                  <FiUser
                    className={darkMode ? "text-white" : "text-gray-800"}
                  />
                </Link>
              )}
            </div>
          </div>
        </header>

        {/* Live Ticker */}
        <div className="bg-gray-800 text-white p-1 shadow-md">
          <div className="max-w-7xl mx-auto overflow-hidden">
            <div className="animate-scroll text-sm font-medium whitespace-nowrap">
              {liveHeadlines.length > 0
                ? liveHeadlines.join(" | ")
                : "Loading latest news..."}
            </div>
          </div>
          <style>{`
            @keyframes scroll {
              0% { transform: translateX(100%); }
              100% { transform: translateX(-100%); }
            }
            .animate-scroll {
              animation: scroll 30s linear infinite;
            }
          `}</style>
        </div>

        <main className="flex-grow p-6">
          <Routes>
            <Route
              path="/profile-settings"
              element={
                isAuthenticated ? (
                  <ProfileSettings />
                ) : (
                  <Navigate to="/signin" />
                )
              }
            />
            <Route
              path="/preferences"
              element={
                isAuthenticated ? (
                  <UserPreferences
                    categories={categories}
                    preferences={userPreferences}
                    onChange={handlePreferenceChange}
                  />
                ) : (
                  <Navigate to="/signin" />
                )
              }
            />
            <Route
              path="/"
              element={
                isAuthenticated ? (
                  <LandingPage
                    categories={categories}
                    darkMode={darkMode}
                    onOpenSubscribeModal={() => setShowSubscribeModal(true)}
                    isAuthenticated={isAuthenticated}
                    searchQuery={searchQuery}
                    openSentimentGraph={openSentimentGraph}
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
                    <NewsPage
                      category={category}
                      darkMode={darkMode}
                      searchQuery={searchQuery}
                      openSentimentGraph={openSentimentGraph}
                    />
                  ) : (
                    <Navigate to="/signin" />
                  )
                }
              />
            ))}
            <Route
              path="/bookmarks"
              element={
                isAuthenticated ? (
                  <BookmarksPage darkMode={darkMode} />
                ) : (
                  <Navigate to="/signin" />
                )
              }
            />
            <Route path="/signup" element={<SignUp />} />
            <Route
              path="/signin"
              element={<SignIn setIsAuthenticated={setIsAuthenticated} />}
            />
          </Routes>
        </main>

        <footer className="bg-gray-800 text-gray-300 p-4 shadow-inner">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-2">
            <p className="text-lg font-semibold">BRIGHT FEED © 2025</p>
            <p className="text-sm italic">
              Fresh news daily—stay curious, stay connected.
            </p>
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
        {showSentimentGraph && isAuthenticated && (
          <SentimentGraph
            category={sentimentCategory}
            onClose={() => setShowSentimentGraph(false)}
          />
        )}
      </div>
    </div>
  );
};

// Wrap App with Router
const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;