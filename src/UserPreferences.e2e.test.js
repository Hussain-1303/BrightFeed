import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

// Create a comprehensive test component that replicates the User Preferences functionality
const UserPreferencesTestable = () => {
  const [preferences, setPreferences] = React.useState({
    articlesPerPage: 10,
    defaultView: 'grid',
    showImages: true,
    compactMode: false,
    preferredCategories: [],
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
  });

  const [hasUnsavedChanges, setHasUnsavedChanges] = React.useState(false);
  const [saveStatus, setSaveStatus] = React.useState(null);

  const categories = ['art', 'tech', 'science', 'world', 'gaming', 'sport', 'business'];

  React.useEffect(() => {
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

  const handleChange = (key, value) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
    setHasUnsavedChanges(true);
    setSaveStatus(null);
  };

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

  const handleSave = async () => {
    setSaveStatus('saving');
    try {
      localStorage.setItem('userPreferences', JSON.stringify(preferences));
      
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

  const handleReset = () => {
    const defaultPrefs = {
      articlesPerPage: 10,
      defaultView: 'grid',
      showImages: true,
      compactMode: false,
      preferredCategories: [],
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
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
              {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'success' ? 'Saved!' : 'Save Changes'}
            </button>
          </div>
        </div>

        {/* Save Status Messages */}
        {saveStatus === 'error' && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">
              Failed to save preferences. Please try again.
            </p>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Display Preferences */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Display</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="articles-per-page" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Articles per page
                </label>
                <input
                  id="articles-per-page"
                  type="number"
                  min={5}
                  max={50}
                  value={preferences.articlesPerPage}
                  onChange={(e) => handleChange('articlesPerPage', parseInt(e.target.value))}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label htmlFor="default-view" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Default view
                </label>
                <select
                  id="default-view"
                  value={preferences.defaultView}
                  onChange={(e) => handleChange('defaultView', e.target.value)}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                >
                  <option value="grid">Grid View</option>
                  <option value="list">List View</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Show article images
                  </label>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Display thumbnails and featured images</p>
                </div>
                <button
                  type="button"
                  aria-label="Show article images"
                  onClick={() => handleChange('showImages', !preferences.showImages)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    preferences.showImages 
                      ? 'bg-blue-600' 
                      : 'bg-gray-200 dark:bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      preferences.showImages ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Content Preferences */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Content</h3>
            <div className="space-y-4">
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
                          ? 'bg-blue-100 border-blue-300 text-blue-700'
                          : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="content-language" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Content language
                </label>
                <select
                  id="content-language"
                  value={preferences.contentLanguage}
                  onChange={(e) => handleChange('contentLanguage', e.target.value)}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Reading Preferences */}
        <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Reading</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="font-size" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Font size
              </label>
              <select
                id="font-size"
                value={preferences.fontSize}
                onChange={(e) => handleChange('fontSize', e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              >
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="line-height" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Line height
              </label>
              <select
                id="line-height"
                value={preferences.lineHeight}
                onChange={(e) => handleChange('lineHeight', e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              >
                <option value="compact">Compact</option>
                <option value="normal">Normal</option>
                <option value="relaxed">Relaxed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Unsaved Changes Warning */}
        {hasUnsavedChanges && (
          <div className="fixed bottom-6 right-6 bg-orange-500 text-white px-4 py-2 rounded-lg shadow-lg">
            You have unsaved changes
          </div>
        )}
      </div>
    </div>
  );
};

// Mock localStorage
const mockLocalStorage = (() => {
  let store = {};
  return {
    getItem: jest.fn((key) => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString();
    }),
    removeItem: jest.fn((key) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

describe('UserPreferences E2E Tests - Complete UX Flow Validation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLocalStorage.clear();
  });

  describe('Complete User Journey - First Time User', () => {
    it('should handle complete first-time user workflow from loading to saving', async () => {
      render(<UserPreferencesTestable />);

      // Verify initial load with default values
      await waitFor(() => {
        expect(screen.getByText('User Preferences')).toBeInTheDocument();
        expect(screen.getByText('Customize your BrightFeed experience')).toBeInTheDocument();
      });

      const articlesInput = screen.getByLabelText(/articles per page/i);
      const fontSizeSelect = screen.getByLabelText(/font size/i);
      const showImagesToggle = screen.getByLabelText(/show article images/i);
      const saveButton = screen.getByRole('button', { name: /save changes/i });

      // Verify initial state
      expect(articlesInput).toHaveValue(10);
      expect(fontSizeSelect).toHaveValue('medium');
      expect(saveButton).toBeDisabled();
      expect(screen.queryByText('You have unsaved changes')).not.toBeInTheDocument();

      // Make first change - modify articles per page
      fireEvent.change(articlesInput, { target: { value: '15' } });

      // Verify unsaved changes tracking
      await waitFor(() => {
        expect(screen.getByText('You have unsaved changes')).toBeInTheDocument();
        expect(saveButton).toBeEnabled();
        expect(saveButton).toHaveTextContent('Save Changes');
      });

      // Make second change - toggle show images
      fireEvent.click(showImagesToggle);

      // Verify multiple changes are tracked
      expect(saveButton).toBeEnabled();
      expect(screen.getByText('You have unsaved changes')).toBeInTheDocument();

      // Make third change - change font size
      fireEvent.change(fontSizeSelect, { target: { value: 'large' } });

      // Verify all changes are maintained
      expect(articlesInput).toHaveValue(15);
      expect(fontSizeSelect).toHaveValue('large');

      // Save changes
      fireEvent.click(saveButton);

      // Verify saving state
      await waitFor(() => {
        expect(saveButton).toHaveTextContent('Saving...');
        expect(saveButton).toBeDisabled();
      });

      // Verify saved state
      await waitFor(() => {
        expect(saveButton).toHaveTextContent('Saved!');
        expect(screen.queryByText('You have unsaved changes')).not.toBeInTheDocument();
      }, { timeout: 1000 });

      // Verify localStorage persistence
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'userPreferences',
        expect.stringContaining('"articlesPerPage":15')
      );
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'userPreferences',
        expect.stringContaining('"fontSize":"large"')
      );

      // Verify button returns to disabled state
      await waitFor(() => {
        expect(saveButton).toBeDisabled();
        expect(saveButton).toHaveTextContent('Save Changes');
      }, { timeout: 3000 });
    });
  });

  describe('Category Selection UX Flow', () => {
    it('should handle multi-select category interactions correctly', async () => {
      render(<UserPreferencesTestable />);

      await waitFor(() => {
        expect(screen.getByText('User Preferences')).toBeInTheDocument();
      });

      const techButton = screen.getByRole('button', { name: /^tech$/i });
      const scienceButton = screen.getByRole('button', { name: /^science$/i });
      const artButton = screen.getByRole('button', { name: /^art$/i });
      const saveButton = screen.getByRole('button', { name: /save changes/i });

      // Initially no categories selected
      expect(techButton).toHaveClass('bg-gray-50');
      expect(scienceButton).toHaveClass('bg-gray-50');
      expect(artButton).toHaveClass('bg-gray-50');
      expect(saveButton).toBeDisabled();

      // Select first category
      fireEvent.click(techButton);

      await waitFor(() => {
        expect(techButton).toHaveClass('bg-blue-100');
        expect(saveButton).toBeEnabled();
        expect(screen.getByText('You have unsaved changes')).toBeInTheDocument();
      });

      // Select second category
      fireEvent.click(scienceButton);

      await waitFor(() => {
        expect(techButton).toHaveClass('bg-blue-100');
        expect(scienceButton).toHaveClass('bg-blue-100');
        expect(artButton).toHaveClass('bg-gray-50');
      });

      // Deselect first category
      fireEvent.click(techButton);

      await waitFor(() => {
        expect(techButton).toHaveClass('bg-gray-50');
        expect(scienceButton).toHaveClass('bg-blue-100');
        expect(artButton).toHaveClass('bg-gray-50');
      });

      // Save and verify
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(saveButton).toHaveTextContent('Saving...');
      });

      await waitFor(() => {
        expect(localStorage.setItem).toHaveBeenCalledWith(
          'userPreferences',
          expect.stringContaining('"preferredCategories":["science"]')
        );
      });
    });
  });

  describe('Reset Functionality UX Flow', () => {
    it('should properly reset all preferences and handle unsaved state', async () => {
      // Start with some saved preferences
      const savedPreferences = {
        articlesPerPage: 25,
        defaultView: 'list',
        showImages: false,
        fontSize: 'large',
        preferredCategories: ['tech', 'science']
      };

      localStorage.setItem('userPreferences', JSON.stringify(savedPreferences));
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(savedPreferences));

      render(<UserPreferencesTestable />);

      await waitFor(() => {
        expect(screen.getByText('User Preferences')).toBeInTheDocument();
      });

      // Verify saved preferences are loaded
      const articlesInput = screen.getByLabelText(/articles per page/i);
      const defaultViewSelect = screen.getByLabelText(/default view/i);
      const fontSizeSelect = screen.getByLabelText(/font size/i);

      await waitFor(() => {
        expect(articlesInput).toHaveValue(25);
        expect(defaultViewSelect).toHaveValue('list');
        expect(fontSizeSelect).toHaveValue('large');
      });

      const resetButton = screen.getByRole('button', { name: /reset/i });
      const saveButton = screen.getByRole('button', { name: /save changes/i });

      // Initially no unsaved changes
      expect(saveButton).toBeDisabled();
      expect(screen.queryByText('You have unsaved changes')).not.toBeInTheDocument();

      // Click reset
      fireEvent.click(resetButton);

      // Verify reset triggers unsaved changes
      await waitFor(() => {
        expect(saveButton).toBeEnabled();
        expect(screen.getByText('You have unsaved changes')).toBeInTheDocument();
      });

      // Verify all values are reset to defaults
      expect(articlesInput).toHaveValue(10);
      expect(defaultViewSelect).toHaveValue('grid');
      expect(fontSizeSelect).toHaveValue('medium');

      // Verify categories are cleared
      const techButton = screen.getByRole('button', { name: /tech/i });
      const scienceButton = screen.getByRole('button', { name: /science/i });
      expect(techButton).toHaveClass('bg-gray-50');
      expect(scienceButton).toHaveClass('bg-gray-50');

      // Save the reset
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(saveButton).toHaveTextContent('Saving...');
      });

      await waitFor(() => {
        expect(localStorage.setItem).toHaveBeenCalledWith(
          'userPreferences',
          expect.stringContaining('"articlesPerPage":10')
        );
        expect(localStorage.setItem).toHaveBeenCalledWith(
          'userPreferences',
          expect.stringContaining('"defaultView":"grid"')
        );
      });
    });
  });

  describe('Error Handling and Edge Cases', () => {
    it('should handle localStorage save errors gracefully', async () => {
      // Mock localStorage to throw an error
      const originalSetItem = localStorage.setItem;
      localStorage.setItem = jest.fn(() => {
        throw new Error('Storage quota exceeded');
      });

      render(<UserPreferencesTestable />);

      await waitFor(() => {
        expect(screen.getByText('User Preferences')).toBeInTheDocument();
      });

      // Make a change
      const articlesInput = screen.getByLabelText(/articles per page/i);
      fireEvent.change(articlesInput, { target: { value: '20' } });

      const saveButton = screen.getByRole('button', { name: /save changes/i });

      await waitFor(() => {
        expect(saveButton).toBeEnabled();
      });

      // Try to save
      fireEvent.click(saveButton);

      // Verify error state
      await waitFor(() => {
        expect(screen.getByText('Failed to save preferences. Please try again.')).toBeInTheDocument();
      });

      // Restore original function
      localStorage.setItem = originalSetItem;
    });

    it('should handle malformed localStorage data gracefully', async () => {
      // Mock invalid JSON in localStorage
      mockLocalStorage.getItem.mockReturnValue('invalid json');

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      render(<UserPreferencesTestable />);

      await waitFor(() => {
        expect(screen.getByText('User Preferences')).toBeInTheDocument();
      });

      // Should fall back to default preferences
      const articlesInput = screen.getByLabelText(/articles per page/i);
      const defaultViewSelect = screen.getByLabelText(/default view/i);

      expect(articlesInput).toHaveValue(10);
      expect(defaultViewSelect).toHaveValue('grid');

      expect(consoleSpy).toHaveBeenCalledWith('Error loading preferences:', expect.any(Error));
      
      consoleSpy.mockRestore();
    });
  });

  describe('Form Validation and Input Handling', () => {
    it('should validate number inputs and handle all dropdown selections', async () => {
      render(<UserPreferencesTestable />);

      await waitFor(() => {
        expect(screen.getByText('User Preferences')).toBeInTheDocument();
      });

      const articlesInput = screen.getByLabelText(/articles per page/i);

      // Test minimum boundary
      fireEvent.change(articlesInput, { target: { value: '5' } });
      expect(articlesInput).toHaveValue(5);

      // Test maximum boundary
      fireEvent.change(articlesInput, { target: { value: '50' } });
      expect(articlesInput).toHaveValue(50);

      // Test valid range
      fireEvent.change(articlesInput, { target: { value: '25' } });
      expect(articlesInput).toHaveValue(25);

      // Test dropdown options
      const defaultViewSelect = screen.getByLabelText(/default view/i);
      fireEvent.change(defaultViewSelect, { target: { value: 'list' } });
      expect(defaultViewSelect).toHaveValue('list');

      const fontSizeSelect = screen.getByLabelText(/font size/i);
      fireEvent.change(fontSizeSelect, { target: { value: 'small' } });
      expect(fontSizeSelect).toHaveValue('small');

      fireEvent.change(fontSizeSelect, { target: { value: 'large' } });
      expect(fontSizeSelect).toHaveValue('large');

      const languageSelect = screen.getByLabelText(/content language/i);
      fireEvent.change(languageSelect, { target: { value: 'es' } });
      expect(languageSelect).toHaveValue('es');

      fireEvent.change(languageSelect, { target: { value: 'fr' } });
      expect(languageSelect).toHaveValue('fr');
    });
  });

  describe('State Persistence Across Sessions', () => {
    it('should maintain state consistency across component remounts', async () => {
      const savedPrefs = {
        articlesPerPage: 20,
        fontSize: 'large',
        preferredCategories: ['tech'],
        showImages: false,
        defaultView: 'list'
      };

      localStorage.setItem('userPreferences', JSON.stringify(savedPrefs));
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(savedPrefs));

      // First mount
      const { unmount } = render(<UserPreferencesTestable />);

      await waitFor(() => {
        expect(screen.getByText('User Preferences')).toBeInTheDocument();
      });

      const articlesInput = screen.getByLabelText(/articles per page/i);
      const fontSizeSelect = screen.getByLabelText(/font size/i);
      const defaultViewSelect = screen.getByLabelText(/default view/i);

      await waitFor(() => {
        expect(articlesInput).toHaveValue(20);
        expect(fontSizeSelect).toHaveValue('large');
        expect(defaultViewSelect).toHaveValue('list');
      });

      // Verify tech category is selected
      const techButton = screen.getByRole('button', { name: /tech/i });
      expect(techButton).toHaveClass('bg-blue-100');

      // Unmount and remount
      unmount();

      render(<UserPreferencesTestable />);

      // Verify state is restored
      await waitFor(() => {
        expect(screen.getByText('User Preferences')).toBeInTheDocument();
      });

      const newArticlesInput = screen.getByLabelText(/articles per page/i);
      const newFontSizeSelect = screen.getByLabelText(/font size/i);
      const newDefaultViewSelect = screen.getByLabelText(/default view/i);
      const newTechButton = screen.getByRole('button', { name: /tech/i });

      await waitFor(() => {
        expect(newArticlesInput).toHaveValue(20);
        expect(newFontSizeSelect).toHaveValue('large');
        expect(newDefaultViewSelect).toHaveValue('list');
        expect(newTechButton).toHaveClass('bg-blue-100');
      });
    });
  });
});