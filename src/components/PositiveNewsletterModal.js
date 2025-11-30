import React, { useState } from 'react';
import { FiX, FiMail, FiHeart } from 'react-icons/fi';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

const PositiveNewsletterModal = ({ onClose, darkMode }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

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
        setSuccess(true);
        setTimeout(() => {
          onClose();
          setSuccess(false);
          setEmail("");
          setMessage("");
        }, 2000);
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className={`rounded-2xl shadow-2xl p-8 w-full max-w-md relative border
        ${darkMode 
          ? 'bg-neutral-800 border-neutral-700' 
          : 'bg-white border-neutral-200'
        }`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 p-2 rounded-lg transition-colors
            ${darkMode 
              ? 'hover:bg-neutral-700 text-neutral-400 hover:text-white' 
              : 'hover:bg-neutral-100 text-neutral-600 hover:text-neutral-900'
            }`}
          aria-label="Close modal"
        >
          <FiX size={24} />
        </button>

        {/* Success State */}
        {success ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 bg-accent-100 dark:bg-accent-900/30 rounded-full flex items-center justify-center mb-4">
              <span className="text-3xl">💖</span>
            </div>
            <h3 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-neutral-900'}`}>
              You're All Set!
            </h3>
            <p className={darkMode ? 'text-neutral-400' : 'text-neutral-600'}>
              {message || "Get ready for feel-good stories delivered to your inbox"}
            </p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-accent-100 dark:bg-accent-900/30 rounded-lg">
                <FiHeart className="text-accent-600 dark:text-accent-400" size={24} />
              </div>
              <div>
                <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-neutral-900'}`}>
                  Positive Newsletter
                </h2>
                <p className={`text-sm ${darkMode ? 'text-neutral-400' : 'text-neutral-600'}`}>
                  Uplifting stories daily
                </p>
              </div>
            </div>

            {/* Description */}
            <p className={`mb-6 ${darkMode ? 'text-neutral-300' : 'text-neutral-700'}`}>
              Subscribe to our weekly newsletter filled with feel-good stories, inspiring human interest pieces, and uplifting news from around the world. Stay positive, stay informed! ✨
            </p>

            {error && <p className="text-red-500 text-center mb-4 font-semibold">{error}</p>}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Input */}
              <div>
                <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-neutral-300' : 'text-neutral-700'}`}>
                  <span className="flex items-center gap-2">
                    <FiMail size={16} />
                    Email Address
                  </span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  className={`w-full px-4 py-3 border rounded-lg transition-colors
                    ${darkMode
                      ? 'border-neutral-600 bg-neutral-700 text-white placeholder-neutral-500 focus:ring-2 focus:ring-accent-500 focus:border-transparent'
                      : 'border-neutral-300 bg-white text-neutral-900 placeholder-neutral-400 focus:ring-2 focus:ring-accent-500 focus:border-transparent'
                    }`}
                />
                <p className={`text-xs mt-2 ${darkMode ? 'text-neutral-500' : 'text-neutral-500'}`}>
                  We send weekly digests of positive news stories
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-accent-600 hover:bg-accent-700 disabled:bg-neutral-400 text-white font-semibold py-3 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 mt-6"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Subscribing...
                  </>
                ) : (
                  <>
                    <FiHeart size={18} />
                    Subscribe Now
                  </>
                )}
              </button>
            </form>

            {/* Benefits */}
            <div className={`mt-6 space-y-2 p-4 rounded-lg border
              ${darkMode 
                ? 'bg-neutral-700/50 border-neutral-600' 
                : 'bg-neutral-50 border-neutral-200'
              }`}
            >
              <p className={`text-xs font-semibold ${darkMode ? 'text-neutral-300' : 'text-neutral-700'}`}>
                What you'll get:
              </p>
              <ul className={`text-xs space-y-1 ${darkMode ? 'text-neutral-400' : 'text-neutral-600'}`}>
                <li>✓ Weekly digest of uplifting stories</li>
                <li>✓ Inspiring human interest pieces</li>
                <li>✓ Positive updates from around the world</li>
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PositiveNewsletterModal;