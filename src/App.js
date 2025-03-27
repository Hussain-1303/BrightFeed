import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import NewsPage from './components/NewsPage';
import './App.css';

const App = () => {
  const categories = ["world", "art", "tech", "science", "gaming", "sport", "business"];

  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-pink-400">
        {/* Header */}
        <header className="bg-pink-500 text-yellow-300 p-4 shadow-lg">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl font-extrabold tracking-wider">
              <Link to="/">BRIGHTFEED</Link>
            </h1>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<LandingPage categories={categories} />} />
            {categories.map((category) => (
              <Route
                key={category}
                path={`/${category}`}
                element={<NewsPage category={category} />}
              />
            ))}
          </Routes>
        </main>

        {/* Footer */}
        <footer className="bg-pink-500 text-yellow-300 p-6">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <p className="text-lg font-semibold">BRIGHTFEED © 2025</p>
            <p className="text-sm">
              FRESH NEWS DAILY—STAY CURIOUS, STAY CONNECTED.
            </p>
          </div>
        </footer>
      </div>
    </Router>
  );
};

// Landing Page Component
const LandingPage = ({ categories }) => {
  return (
    <div className="max-w-7xl mx-auto py-12 px-4">
      <section className="mb-12">
        <h2 className="text-5xl font-extrabold text-blue-600 leading-tight">
          BRIGHTFEED
        </h2>
        <p className="text-xl text-blue-500 mt-2">
          YOUR PLAYFUL GATEWAY TO THE LATEST STORIES—PICK A CATEGORY AND DIVE IN!
        </p>
      </section>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Link
            key={category}
            to={`/${category}`}
            className="relative bg-white rounded-2xl shadow-md overflow-hidden flex items-center p-6"
          >
            <div className="absolute top-2 right-2 text-purple-400 text-xl">➜</div>
            <div className="flex items-center gap-4">
              <span className="text-4xl">
                {category === "world" && "🌍"}
                {category === "art" && "🎨"}
                {category === "tech" && "💻"}
                {category === "science" && "🔬"}
                {category === "gaming" && "🎮"}
                {category === "sport" && "⚽"}
                {category === "business" && "💼"}
              </span>
              <h3 className="text-2xl font-semibold text-blue-600 capitalize">
                {category} News
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default App;