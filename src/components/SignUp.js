import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiMail, FiLock, FiUser, FiCheckCircle } from 'react-icons/fi';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

const SignUp = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
<<<<<<< HEAD
    setError('');
    
=======
>>>>>>> 76f3d614cc075500dceda278de88a966165bc1ac
    try {
      const response = await fetch(`${API_URL}/api/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (data.success) {
        navigate('/signin');
      } else {
        setError(data.message || 'Signup failed');
      }
    } catch (err) {
<<<<<<< HEAD
      setError(err.message || 'An error occurred during signup');
      console.error('Signup Error:', err);
=======
      setError(err.response?.data?.message || 'Signup failed');
>>>>>>> 76f3d614cc075500dceda278de88a966165bc1ac
    } finally {
      setLoading(false);
    }
  };

  return (
<<<<<<< HEAD
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center">Sign Up</h2>
      {error && <p className="text-red-500 text-center mb-4 font-semibold">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Username</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-400 font-semibold"
        >
          {loading ? 'Signing Up...' : 'Sign Up'}
        </button>
      </form>
      <p className="text-center mt-4">
        Already have an account? <Link to="/signin" className="text-blue-500 hover:underline font-semibold">Sign In</Link>
      </p>
=======
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800 py-12 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-lg p-8 border border-brand-100 dark:border-neutral-700">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-brand-100 dark:bg-brand-900 rounded-full mb-4">
              <FiCheckCircle className="text-brand-600 dark:text-brand-400" size={24} />
            </div>
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">Create Account</h2>
            <p className="text-neutral-600 dark:text-neutral-400">Join BrightFeed and start discovering positive news</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-error-50 dark:bg-error-900/20 border border-error-200 dark:border-error-800 rounded-lg flex items-start gap-3">
              <span className="text-error-500 flex-shrink-0 mt-0.5">⚠</span>
              <p className="text-error-700 dark:text-error-400 text-sm">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div>
              <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                <span className="flex items-center gap-2">
                  <FiUser size={16} />
                  Username
                </span>
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Choose a unique username"
                className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-colors"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                <span className="flex items-center gap-2">
                  <FiMail size={16} />
                  Email Address
                </span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-colors"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                <span className="flex items-center gap-2">
                  <FiLock size={16} />
                  Password
                </span>
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a strong password"
                className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-colors"
                required
              />
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2">
                Use at least 8 characters with a mix of letters, numbers, and symbols
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-600 hover:bg-brand-700 disabled:bg-neutral-400 text-white font-semibold py-3 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 mt-6"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Sign In Link */}
          <p className="text-center mt-6 text-neutral-600 dark:text-neutral-400">
            Already have an account?{' '}
            <Link
              to="/signin"
              className="text-brand-600 dark:text-brand-400 font-semibold hover:text-brand-700 dark:hover:text-brand-300 transition-colors"
            >
              Sign In
            </Link>
          </p>
        </div>

        {/* Footer Note */}
        <p className="text-center text-xs text-neutral-500 dark:text-neutral-400 mt-6">
          By signing up, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
>>>>>>> 76f3d614cc075500dceda278de88a966165bc1ac
    </div>
  );
};

export default SignUp;