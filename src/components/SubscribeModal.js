import React, { useState } from 'react';

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

export default SubscribeModal;