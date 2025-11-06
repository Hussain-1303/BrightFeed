import React, { useState } from 'react';
import { FiBell, FiX, FiMail } from 'react-icons/fi';

const SubscribeModal = ({ categories, onClose, darkMode }) => {
  const [email, setEmail] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setSuccess(true);
      setLoading(false);
      setTimeout(() => {
        onClose();
        setSuccess(false);
        setEmail("");
      }, 1500);
    }, 800);
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
            <div className="w-16 h-16 bg-success-100 dark:bg-success-900/30 rounded-full flex items-center justify-center mb-4">
              <span className="text-3xl">✓</span>
            </div>
            <h3 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-neutral-900'}`}>
              Subscribed!
            </h3>
            <p className={darkMode ? 'text-neutral-400' : 'text-neutral-600'}>
              You'll receive updates for {selectedCategory} news
            </p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-accent-100 dark:bg-accent-900/30 rounded-lg">
                <FiBell className="text-accent-600 dark:text-accent-400" size={24} />
              </div>
              <div>
                <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-neutral-900'}`}>
                  Subscribe to Updates
                </h2>
                <p className={`text-sm ${darkMode ? 'text-neutral-400' : 'text-neutral-600'}`}>
                  Get the latest news delivered to your inbox
                </p>
              </div>
            </div>

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
              </div>

              {/* Category Select */}
              <div>
                <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-neutral-300' : 'text-neutral-700'}`}>
                  News Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg transition-colors
                    ${darkMode
                      ? 'border-neutral-600 bg-neutral-700 text-white focus:ring-2 focus:ring-accent-500 focus:border-transparent'
                      : 'border-neutral-300 bg-white text-neutral-900 focus:ring-2 focus:ring-accent-500 focus:border-transparent'
                    }`}
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)} {cat === "sport" ? "News" : ""}
                    </option>
                  ))}
                </select>
                <p className={`text-xs mt-2 ${darkMode ? 'text-neutral-500' : 'text-neutral-500'}`}>
                  We'll send you curated stories from this category
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
                    <FiBell size={18} />
                    Subscribe Now
                  </>
                )}
              </button>
            </form>

            {/* Info Box */}
            <div className={`mt-6 p-4 rounded-lg border
              ${darkMode 
                ? 'bg-neutral-700/50 border-neutral-600 text-neutral-300' 
                : 'bg-neutral-50 border-neutral-200 text-neutral-600'
              }`}
            >
              <p className="text-xs">
                <strong>✓ Unsubscribe anytime</strong> from your preferences settings
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SubscribeModal;