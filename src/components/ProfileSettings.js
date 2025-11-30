import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import API_URL from '../config';
import { FiMail, FiUser, FiArrowLeft, FiSave, FiLoader } from 'react-icons/fi';

const ProfileSettings = () => {
  const [formData, setFormData] = useState({ username: '', email: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.get(`${API_URL}/api/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      }).then(response => {
        setFormData({ username: response.data.username, email: response.data.email });
      }).catch(err => {
        setError('Failed to load profile');
        console.error('Profile Error:', err);
      }).finally(() => {
        setLoading(false);
      });
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}/api/profile`, formData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      });
      localStorage.setItem('username', formData.username);
      setSuccess('Profile updated successfully!');
      setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md text-center">
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header with Back Button */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/')}
            className="p-2 rounded-lg bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
            aria-label="Go back"
          >
            <FiArrowLeft className="text-neutral-600 dark:text-neutral-400" size={20} />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">Profile Settings</h1>
            <p className="text-neutral-600 dark:text-neutral-400 mt-1">Update your account information</p>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-lg p-8 border border-neutral-200 dark:border-neutral-700">
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-error-50 dark:bg-error-900/20 border border-error-200 dark:border-error-800 rounded-lg flex items-start gap-3">
              <span className="text-error-500 flex-shrink-0 mt-0.5">⚠</span>
              <p className="text-error-700 dark:text-error-400 text-sm">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mb-6 p-4 bg-success-50 dark:bg-success-900/20 border border-success-200 dark:border-success-800 rounded-lg flex items-start gap-3">
              <span className="text-success-500 flex-shrink-0 mt-0.5">✓</span>
              <p className="text-success-700 dark:text-success-400 text-sm">{success}</p>
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <FiLoader className="animate-spin text-brand-500" size={32} />
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Username Field */}
              <div>
                <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                  <span className="flex items-center gap-2">
                    <FiUser size={16} />
                    Display Name
                  </span>
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Your display name"
                  className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-colors"
                  required
                />
              </div>

              {/* Email Field */}
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
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-colors"
                  required
                />
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2">
                  This email is used for account recovery and notifications
                </p>
              </div>

              {/* Divider */}
              <div className="border-t border-neutral-200 dark:border-neutral-700 pt-6"></div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="flex-1 px-6 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors text-neutral-700 dark:text-neutral-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-brand-600 hover:bg-brand-700 disabled:bg-neutral-400 text-white font-semibold py-3 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <>
                      <FiLoader className="animate-spin" size={18} />
                      Saving...
                    </>
                  ) : (
                    <>
                      <FiSave size={18} />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Info Section */}
        <div className="mt-8 bg-brand-50 dark:bg-brand-900/20 border border-brand-200 dark:border-brand-800 rounded-lg p-6">
          <h3 className="font-semibold text-brand-900 dark:text-brand-100 mb-2">📝 Profile Information</h3>
          <ul className="text-sm text-brand-800 dark:text-brand-200 space-y-1">
            <li>• Your display name is shown in comments and interactions</li>
            <li>• Email address is kept private and used only for account recovery</li>
            <li>• Changes take effect immediately after saving</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;