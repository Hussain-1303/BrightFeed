import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiSave, 
  FiRefreshCw, 
  FiArrowLeft, 
  FiEye, 
  FiZap, 
  FiClock, 
  FiTrendingUp, 
  FiGlobe,
  FiCheck
} from 'react-icons/fi';

const UserPreferences = ({ darkMode }) => {
  const navigate = useNavigate();
  const [preferences, setPreferences] = useState({
    // Display Preferences
    articlesPerPage: 10,
    defaultView: 'grid', // 'grid' or 'list'
    showImages: true,
    compactMode: false,
    
    // Content Preferences  
    preferredCategories: [],
    blockedKeywords: [],
    contentLanguage: 'en',
    hideReadArticles: false,
    
    // Notification Preferences
    emailNotifications: true,
    pushNotifications: false,
    newsletterFrequency: 'daily', // 'daily', 'weekly', 'monthly'
    breakingNews: true,
    
    // Reading Preferences
    fontSize: 'medium', // 'small', 'medium', 'large'
    lineHeight: 'normal', // 'compact', 'normal', 'relaxed'
    readingTime: true,
    autoPlayVideos: false,
    
    // Privacy Preferences
    shareReadingData: false,
    personalizedAds: true,
    analyticsTracking: true
  });

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null); // 'saving', 'success', 'error'

  const categories = [
    'art', 'tech', 'science', 'world', 'gaming', 'sport', 'business'
  ];

  // Load preferences from localStorage on component mount
  useEffect(() => {
    const savedPreferences = localStorage.getItem('userPreferences');
    if (savedPreferences) {
      try {
        const parsed = JSON.parse(savedPreferences);
        setPreferences(prev => ({ ...prev, ...parsed }));
      } catch (error) {
        console.error('Error loading preferences:', error);
      }
    }
  }, []);

  // Handle preference changes
  const handleChange = (section, key, value) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
    setHasUnsavedChanges(true);
    setSaveStatus(null);
  };

  // Handle array preferences (like categories)
  const handleArrayToggle = (key, value) => {
    setPreferences(prev => ({
      ...prev,
      [key]: prev[key].includes(value) 
        ? prev[key].filter(item => item !== value)
        : [...prev[key], value]
    }));
    setHasUnsavedChanges(true);
    setSaveStatus(null);
  };

  // Save preferences
  const handleSave = async () => {
    setSaveStatus('saving');
    try {
      // Save to localStorage
      localStorage.setItem('userPreferences', JSON.stringify(preferences));
      
      // Here you could also save to your backend API
      // await axios.put('/api/user/preferences', preferences, {
      //   headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      // });
      
      setTimeout(() => {
        setSaveStatus('success');
        setHasUnsavedChanges(false);
        setTimeout(() => setSaveStatus(null), 2000);
      }, 500);
    } catch (error) {
      console.error('Error saving preferences:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus(null), 3000);
    }
  };

  // Reset preferences
  const handleReset = () => {
    const defaultPrefs = {
      articlesPerPage: 10,
      defaultView: 'grid',
      showImages: true,
      compactMode: false,
      preferredCategories: [],
      blockedKeywords: [],
      contentLanguage: 'en',
      hideReadArticles: false,
      emailNotifications: true,
      pushNotifications: false,
      newsletterFrequency: 'daily',
      breakingNews: true,
      fontSize: 'medium',
      lineHeight: 'normal',
      readingTime: true,
      autoPlayVideos: false,
      shareReadingData: false,
      personalizedAds: true,
      analyticsTracking: true
    };
    setPreferences(defaultPrefs);
    setHasUnsavedChanges(true);
    setSaveStatus(null);
  };

  const PreferenceSection = ({ title, icon: Icon, children }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-brand-100 dark:bg-brand-900 rounded-lg">
          <Icon className="text-brand-600 dark:text-brand-400" size={20} />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
      </div>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );

  const Toggle = ({ label, description, checked, onChange }) => (
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
        {description && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{description}</p>
        )}
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          checked 
            ? 'bg-brand-600 dark:bg-brand-500' 
            : 'bg-gray-200 dark:bg-gray-600'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );

  const Select = ({ label, value, options, onChange }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );

  const NumberInput = ({ label, value, min, max, onChange }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {label}
      </label>
      <input
        type="number"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <FiArrowLeft className="text-gray-600 dark:text-gray-400" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                User Preferences
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Customize your BrightFeed experience
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
            >
              <FiRefreshCw size={16} />
              Reset
            </button>
            <button
              onClick={handleSave}
              disabled={!hasUnsavedChanges || saveStatus === 'saving'}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                hasUnsavedChanges && saveStatus !== 'saving'
                  ? 'bg-brand-600 hover:bg-brand-700 text-white'
                  : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
              }`}
            >
              {saveStatus === 'saving' ? (
                <FiRefreshCw className="animate-spin" size={16} />
              ) : saveStatus === 'success' ? (
                <FiCheck size={16} />
              ) : (
                <FiSave size={16} />
              )}
              {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'success' ? 'Saved!' : 'Save Changes'}
            </button>
          </div>
        </div>

        {/* Save Status Messages */}
        {saveStatus === 'error' && (
          <div className="mb-6 p-4 bg-error-50 dark:bg-error-900/20 border border-error-200 dark:border-error-800 rounded-lg">
            <p className="text-error-700 dark:text-error-400">
              Failed to save preferences. Please try again.
            </p>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Display Preferences */}
          <PreferenceSection title="Display" icon={FiEye}>
            <NumberInput
              label="Articles per page"
              value={preferences.articlesPerPage}
              min={5}
              max={50}
              onChange={(value) => handleChange('display', 'articlesPerPage', value)}
            />
            <Select
              label="Default view"
              value={preferences.defaultView}
              options={[
                { value: 'grid', label: 'Grid View' },
                { value: 'list', label: 'List View' }
              ]}
              onChange={(value) => handleChange('display', 'defaultView', value)}
            />
            <Toggle
              label="Show article images"
              description="Display thumbnails and featured images"
              checked={preferences.showImages}
              onChange={(value) => handleChange('display', 'showImages', value)}
            />
            <Toggle
              label="Compact mode"
              description="Reduce spacing for more content"
              checked={preferences.compactMode}
              onChange={(value) => handleChange('display', 'compactMode', value)}
            />
          </PreferenceSection>

          {/* Content Preferences */}
          <PreferenceSection title="Content" icon={FiTrendingUp}>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Preferred categories
              </label>
              <div className="grid grid-cols-2 gap-2">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => handleArrayToggle('preferredCategories', category)}
                    className={`p-2 rounded-lg border transition-colors capitalize ${
                      preferences.preferredCategories.includes(category)
                        ? 'bg-brand-100 dark:bg-brand-900 border-brand-300 dark:border-brand-700 text-brand-700 dark:text-brand-300'
                        : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
            <Select
              label="Content language"
              value={preferences.contentLanguage}
              options={[
                { value: 'en', label: 'English' },
                { value: 'es', label: 'Spanish' },
                { value: 'fr', label: 'French' },
                { value: 'de', label: 'German' }
              ]}
              onChange={(value) => handleChange('content', 'contentLanguage', value)}
            />
            <Toggle
              label="Hide read articles"
              description="Don't show articles you've already read"
              checked={preferences.hideReadArticles}
              onChange={(value) => handleChange('content', 'hideReadArticles', value)}
            />
          </PreferenceSection>

          {/* Notification Preferences */}
          <PreferenceSection title="Notifications" icon={FiZap}>
            <Toggle
              label="Email notifications"
              description="Receive updates via email"
              checked={preferences.emailNotifications}
              onChange={(value) => handleChange('notifications', 'emailNotifications', value)}
            />
            <Toggle
              label="Push notifications"
              description="Browser push notifications"
              checked={preferences.pushNotifications}
              onChange={(value) => handleChange('notifications', 'pushNotifications', value)}
            />
            <Select
              label="Newsletter frequency"
              value={preferences.newsletterFrequency}
              options={[
                { value: 'daily', label: 'Daily' },
                { value: 'weekly', label: 'Weekly' },
                { value: 'monthly', label: 'Monthly' }
              ]}
              onChange={(value) => handleChange('notifications', 'newsletterFrequency', value)}
            />
            <Toggle
              label="Breaking news alerts"
              description="Get notified about urgent news"
              checked={preferences.breakingNews}
              onChange={(value) => handleChange('notifications', 'breakingNews', value)}
            />
          </PreferenceSection>

          {/* Reading Preferences */}
          <PreferenceSection title="Reading" icon={FiClock}>
            <Select
              label="Font size"
              value={preferences.fontSize}
              options={[
                { value: 'small', label: 'Small' },
                { value: 'medium', label: 'Medium' },
                { value: 'large', label: 'Large' }
              ]}
              onChange={(value) => handleChange('reading', 'fontSize', value)}
            />
            <Select
              label="Line height"
              value={preferences.lineHeight}
              options={[
                { value: 'compact', label: 'Compact' },
                { value: 'normal', label: 'Normal' },
                { value: 'relaxed', label: 'Relaxed' }
              ]}
              onChange={(value) => handleChange('reading', 'lineHeight', value)}
            />
            <Toggle
              label="Show reading time"
              description="Display estimated read time for articles"
              checked={preferences.readingTime}
              onChange={(value) => handleChange('reading', 'readingTime', value)}
            />
            <Toggle
              label="Auto-play videos"
              description="Automatically play video content"
              checked={preferences.autoPlayVideos}
              onChange={(value) => handleChange('reading', 'autoPlayVideos', value)}
            />
          </PreferenceSection>

          {/* Privacy Preferences */}
          <PreferenceSection title="Privacy" icon={FiGlobe}>
            <Toggle
              label="Share reading data"
              description="Help improve recommendations"
              checked={preferences.shareReadingData}
              onChange={(value) => handleChange('privacy', 'shareReadingData', value)}
            />
            <Toggle
              label="Personalized ads"
              description="Show ads based on your interests"
              checked={preferences.personalizedAds}
              onChange={(value) => handleChange('privacy', 'personalizedAds', value)}
            />
            <Toggle
              label="Analytics tracking"
              description="Help us improve the app with usage data"
              checked={preferences.analyticsTracking}
              onChange={(value) => handleChange('privacy', 'analyticsTracking', value)}
            />
          </PreferenceSection>
        </div>

        {/* Unsaved Changes Warning */}
        {hasUnsavedChanges && (
          <div className="fixed bottom-6 right-6 bg-warning-500 text-white px-4 py-2 rounded-lg shadow-lg">
            You have unsaved changes
          </div>
        )}
      </div>
    </div>
  );
};

export default UserPreferences;