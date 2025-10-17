import React, { useState } from 'react';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

const PositiveNewsletterModal = ({ onClose, darkMode }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch(`${API_URL}/api/newsletter/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          type: 'positive'
        })
      });

      const data = await response.json();

      if (data.success) {
        setMessage(`✅ You're signed up for Positive Vibes at ${email}! 💖`);
        setTimeout(() => onClose(), 2000);
      } else {
        setError(data.message || 'Subscription failed');
      }
    } catch (err) {
      setError('Failed to subscribe. Please try again.');
      console.error('Newsletter error:', err);
    } finally {
      setLoading(false);
    }
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
        <p className="text-pink-500 dark:text-pink-300 mb-6">
          Get feel-good stories and uplifting news delivered to your inbox!
        </p>

        {message && <p className="text-green-500 text-center mb-4 font-semibold">{message}</p>}
        {error && <p className="text-red-500 text-center mb-4 font-semibold">{error}</p>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={`w-full p-3 border rounded-lg ${darkMode ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' : 'border-pink-300 bg-white text-pink-700 placeholder-pink-300'}`}
            placeholder="you@example.com"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-pink-500 text-white font-semibold py-2 rounded-lg hover:bg-pink-600 disabled:bg-gray-400 transition-colors"
          >
            {loading ? 'Subscribing...' : 'Get Your Positive News!'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PositiveNewsletterModal;