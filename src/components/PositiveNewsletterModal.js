import React, { useState } from 'react';

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

export default PositiveNewsletterModal;