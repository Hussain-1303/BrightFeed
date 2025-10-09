import React, { createContext, useContext, useState, useEffect } from 'react';

const PreferencesContext = createContext();

export const usePreferences = () => {
  const context = useContext(PreferencesContext);
  if (!context) {
    throw new Error('usePreferences must be used within a PreferencesProvider');
  }
  return context;
};

const defaultPreferences = {
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
};

export const PreferencesProvider = ({ children }) => {
  const [preferences, setPreferences] = useState(defaultPreferences);
  const [isLoading, setIsLoading] = useState(true);

  // Load preferences from localStorage on mount
  useEffect(() => {
    try {
      const savedPreferences = localStorage.getItem('userPreferences');
      if (savedPreferences) {
        const parsed = JSON.parse(savedPreferences);
        setPreferences(prev => ({ ...prev, ...parsed }));
      }
    } catch (error) {
      console.error('Error loading preferences from localStorage:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save preferences to localStorage whenever they change
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem('userPreferences', JSON.stringify(preferences));
      } catch (error) {
        console.error('Error saving preferences to localStorage:', error);
      }
    }
  }, [preferences, isLoading]);

  const updatePreference = (key, value) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const updateMultiplePreferences = (updates) => {
    setPreferences(prev => ({
      ...prev,
      ...updates
    }));
  };

  const resetPreferences = () => {
    setPreferences(defaultPreferences);
  };

  const toggleArrayPreference = (key, value) => {
    setPreferences(prev => ({
      ...prev,
      [key]: prev[key].includes(value) 
        ? prev[key].filter(item => item !== value)
        : [...prev[key], value]
    }));
  };

  // Helper functions for specific preference types
  const isPreferredCategory = (category) => {
    return preferences.preferredCategories.includes(category);
  };

  const addPreferredCategory = (category) => {
    if (!isPreferredCategory(category)) {
      toggleArrayPreference('preferredCategories', category);
    }
  };

  const removePreferredCategory = (category) => {
    if (isPreferredCategory(category)) {
      toggleArrayPreference('preferredCategories', category);
    }
  };

  const getDisplayPreferences = () => ({
    articlesPerPage: preferences.articlesPerPage,
    defaultView: preferences.defaultView,
    showImages: preferences.showImages,
    compactMode: preferences.compactMode
  });

  const getContentPreferences = () => ({
    preferredCategories: preferences.preferredCategories,
    blockedKeywords: preferences.blockedKeywords,
    contentLanguage: preferences.contentLanguage,
    hideReadArticles: preferences.hideReadArticles
  });

  const getNotificationPreferences = () => ({
    emailNotifications: preferences.emailNotifications,
    pushNotifications: preferences.pushNotifications,
    newsletterFrequency: preferences.newsletterFrequency,
    breakingNews: preferences.breakingNews
  });

  const getReadingPreferences = () => ({
    fontSize: preferences.fontSize,
    lineHeight: preferences.lineHeight,
    readingTime: preferences.readingTime,
    autoPlayVideos: preferences.autoPlayVideos
  });

  const getPrivacyPreferences = () => ({
    shareReadingData: preferences.shareReadingData,
    personalizedAds: preferences.personalizedAds,
    analyticsTracking: preferences.analyticsTracking
  });

  const value = {
    preferences,
    isLoading,
    updatePreference,
    updateMultiplePreferences,
    resetPreferences,
    toggleArrayPreference,
    
    // Helper functions
    isPreferredCategory,
    addPreferredCategory,
    removePreferredCategory,
    
    // Grouped getters
    getDisplayPreferences,
    getContentPreferences,
    getNotificationPreferences,
    getReadingPreferences,
    getPrivacyPreferences
  };

  return (
    <PreferencesContext.Provider value={value}>
      {children}
    </PreferencesContext.Provider>
  );
};

export default PreferencesContext;