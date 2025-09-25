import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const SignIn = ({ setIsAuthenticated }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5001/api/signin', formData);
      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('username', response.data.username);
        setIsAuthenticated(true);
        navigate('/');
      } else {
        setError(response.data.message || 'Sign-in failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred during sign-in');
      console.error('Sign-in Error:', err);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white dark:bg-neutral-800 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center text-neutral-800 dark:text-white">Sign In</h2>
      {error && <p className="text-error-500 dark:text-error-400 text-center mb-4 p-2 bg-error-50 dark:bg-error-900/20 rounded">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-neutral-700 dark:text-neutral-300 mb-2">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-800 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-colors"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-neutral-700 dark:text-neutral-300 mb-2">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-3 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-800 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-colors"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-brand-500 text-white p-3 rounded-lg hover:bg-brand-600 focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 transition-colors font-medium"
        >
          Sign In
        </button>
      </form>
      <p className="text-center mt-4 text-neutral-600 dark:text-neutral-400">
        Don't have an account? <Link to="/signup" className="text-brand-500 hover:text-brand-600 dark:text-brand-400 dark:hover:text-brand-300 font-medium hover:underline transition-colors">Sign Up</Link>
      </p>
    </div>
  );
};

export default SignIn;