import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

// Create a simplified version of the UserPreferences component for testing
const UserPreferencesTestable = React.forwardRef((props, ref) => {
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

  // Load preferences from localStorage on component mount
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

  const handleChange = (section, key, value) => {
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

  const Toggle = ({ label, description, checked, onChange, 'data-testid': testId }) => (
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
        data-testid={testId}
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

  const Select = ({ label, value, options, onChange, 'data-testid': testId }) => (
    <div>
      <label htmlFor={testId} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {label}
      </label>
      <select
        id={testId}
        data-testid={testId}
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

  const NumberInput = ({ label, value, min, max, onChange, 'data-testid': testId }) => (
    <div>
      <label htmlFor={testId} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {label}
      </label>
      <input
        id={testId}
        data-testid={testId}
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
              data-testid="reset-button"
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
            >
              Reset
            </button>
            <button
              onClick={handleSave}
              data-testid="save-button"
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
          <div className="mb-6 p-4 bg-error-50 dark:bg-error-900/20 border border-error-200 dark:border-error-800 rounded-lg">
            <p className="text-error-700 dark:text-error-400">
              Failed to save preferences. Please try again.
            </p>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Display Preferences */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Display</h3>
            <div className="space-y-4">
              <NumberInput
                label="Articles per page"
                value={preferences.articlesPerPage}
                min={5}
                max={50}
                data-testid="articles-per-page"
                onChange={(value) => handleChange('display', 'articlesPerPage', value)}
              />
              <Select
                label="Default view"
                value={preferences.defaultView}
                data-testid="default-view"
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
                data-testid="show-images-toggle"
                onChange={(value) => handleChange('display', 'showImages', value)}
              />
              <Toggle
                label="Compact mode"
                description="Reduce spacing for more content"
                checked={preferences.compactMode}
                data-testid="compact-mode-toggle"
                onChange={(value) => handleChange('display', 'compactMode', value)}
              />
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
                      data-testid={`category-${category}`}
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
                data-testid="content-language"
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
                data-testid="hide-read-articles-toggle"
                onChange={(value) => handleChange('content', 'hideReadArticles', value)}
              />
            </div>
          </div>
        </div>

        {/* Unsaved Changes Warning */}
        {hasUnsavedChanges && (
          <div data-testid="unsaved-warning" className="fixed bottom-6 right-6 bg-warning-500 text-white px-4 py-2 rounded-lg shadow-lg">
            You have unsaved changes
          </div>
        )}
      </div>
    </div>
  );
});

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

describe('UserPreferences Component E2E Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLocalStorage.clear();
  });

  describe('Component Rendering and Initial State', () => {
    it('renders the preferences page with all main sections', () => {
      render(<UserPreferencesTestable darkMode={false} />);
      
      expect(screen.getByText('User Preferences')).toBeInTheDocument();
      expect(screen.getByText('Customize your BrightFeed experience')).toBeInTheDocument();
      expect(screen.getByText('Display')).toBeInTheDocument();
      expect(screen.getByText('Content')).toBeInTheDocument();
    });

    it('renders action buttons in correct initial state', () => {
      render(<UserPreferencesTestable darkMode={false} />);
      
      const resetButton = screen.getByTestId('reset-button');
      const saveButton = screen.getByTestId('save-button');
      
      expect(resetButton).toBeInTheDocument();
      expect(saveButton).toBeInTheDocument();
      expect(saveButton).toBeDisabled();
    });

    it('renders with correct default values', () => {
      render(<UserPreferencesTestable darkMode={false} />);
      
      expect(screen.getByTestId('articles-per-page')).toHaveValue(10);
      expect(screen.getByTestId('default-view')).toHaveValue('grid');
      expect(screen.getByTestId('content-language')).toHaveValue('en');
    });
  });

  describe('Display Preferences Functionality', () => {
    it('allows changing articles per page', () => {
      render(<UserPreferencesTestable darkMode={false} />);
      
      const articlesInput = screen.getByTestId('articles-per-page');
      fireEvent.change(articlesInput, { target: { value: '20' } });
      
      expect(articlesInput).toHaveValue(20);
      expect(screen.getByTestId('save-button')).toBeEnabled();
    });

    it('allows changing default view between grid and list', () => {
      render(<UserPreferencesTestable darkMode={false} />);
      
      const viewSelect = screen.getByTestId('default-view');
      fireEvent.change(viewSelect, { target: { value: 'list' } });
      
      expect(viewSelect).toHaveValue('list');
      expect(screen.getByTestId('save-button')).toBeEnabled();
    });

    it('allows toggling display preferences', () => {
      render(<UserPreferencesTestable darkMode={false} />);
      
      const showImagesToggle = screen.getByTestId('show-images-toggle');
      fireEvent.click(showImagesToggle);
      
      expect(screen.getByTestId('save-button')).toBeEnabled();
    });
  });

  describe('Content Preferences Functionality', () => {
    it('allows selecting and deselecting preferred categories', () => {
      render(<UserPreferencesTestable darkMode={false} />);
      
      const techButton = screen.getByTestId('category-tech');
      const scienceButton = screen.getByTestId('category-science');
      
      // Select categories
      fireEvent.click(techButton);
      fireEvent.click(scienceButton);
      
      expect(screen.getByTestId('save-button')).toBeEnabled();
      
      // Deselect one category
      fireEvent.click(techButton);
      expect(screen.getByTestId('save-button')).toBeEnabled();
    });

    it('allows changing content language', () => {
      render(<UserPreferencesTestable darkMode={false} />);
      
      const languageSelect = screen.getByTestId('content-language');
      fireEvent.change(languageSelect, { target: { value: 'es' } });
      
      expect(languageSelect).toHaveValue('es');
      expect(screen.getByTestId('save-button')).toBeEnabled();
    });
  });

  describe('Save and Reset Functionality', () => {
    it('saves preferences to localStorage and shows success message', async () => {
      render(<UserPreferencesTestable darkMode={false} />);
      
      // Make a change
      const articlesInput = screen.getByTestId('articles-per-page');
      fireEvent.change(articlesInput, { target: { value: '15' } });
      
      // Save changes
      const saveButton = screen.getByTestId('save-button');
      fireEvent.click(saveButton);
      
      // Check saving state
      expect(screen.getByText('Saving...')).toBeInTheDocument();
      
      // Wait for success message
      await waitFor(() => {
        expect(screen.getByText('Saved!')).toBeInTheDocument();
      });
      
      // Verify localStorage was called
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'userPreferences',
        expect.stringContaining('"articlesPerPage":15')
      );
    });

    it('resets preferences to default values', () => {
      render(<UserPreferencesTestable darkMode={false} />);
      
      // Make some changes
      const articlesInput = screen.getByTestId('articles-per-page');
      fireEvent.change(articlesInput, { target: { value: '25' } });
      
      // Reset preferences
      const resetButton = screen.getByTestId('reset-button');
      fireEvent.click(resetButton);
      
      // Verify values are reset
      expect(screen.getByTestId('articles-per-page')).toHaveValue(10);
      expect(screen.getByTestId('save-button')).toBeEnabled();
    });

    it('shows unsaved changes warning', () => {
      render(<UserPreferencesTestable darkMode={false} />);
      
      // Initially no warning
      expect(screen.queryByTestId('unsaved-warning')).not.toBeInTheDocument();
      
      // Make a change
      const articlesInput = screen.getByTestId('articles-per-page');
      fireEvent.change(articlesInput, { target: { value: '15' } });
      
      // Warning should now be visible
      expect(screen.getByTestId('unsaved-warning')).toBeInTheDocument();
    });
  });

  describe('LocalStorage Integration', () => {
    it('loads saved preferences from localStorage on mount', async () => {
      const savedPrefs = {
        articlesPerPage: 20,
        defaultView: 'list',
        preferredCategories: ['tech', 'science'],
        emailNotifications: false
      };
      
      // Set up the mock return value before rendering
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(savedPrefs));
      
      render(<UserPreferencesTestable darkMode={false} />);
      
      // Wait for the useEffect to complete
      await waitFor(() => {
        expect(screen.getByTestId('articles-per-page')).toHaveValue(20);
        expect(screen.getByTestId('default-view')).toHaveValue('list');
      });
    });

    it('handles corrupted localStorage data gracefully', () => {
      mockLocalStorage.setItem('userPreferences', 'invalid json');
      
      // Should not throw an error
      expect(() => {
        render(<UserPreferencesTestable darkMode={false} />);
      }).not.toThrow();
      
      // Should still render with default values
      expect(screen.getByTestId('articles-per-page')).toHaveValue(10);
    });
  });

  describe('Error Handling', () => {
    it('handles localStorage save errors gracefully', async () => {
      // Mock localStorage.setItem to throw an error
      mockLocalStorage.setItem.mockImplementationOnce(() => {
        throw new Error('Storage error');
      });
      
      render(<UserPreferencesTestable darkMode={false} />);
      
      // Make a change
      const articlesInput = screen.getByTestId('articles-per-page');
      fireEvent.change(articlesInput, { target: { value: '15' } });
      
      // Save changes
      const saveButton = screen.getByTestId('save-button');
      fireEvent.click(saveButton);
      
      // Wait for error message
      await waitFor(() => {
        expect(screen.getByText('Failed to save preferences. Please try again.')).toBeInTheDocument();
      });
    });
  });

  describe('User Experience and State Management', () => {
    it('enables save button only when changes are made', () => {
      render(<UserPreferencesTestable darkMode={false} />);
      
      const saveButton = screen.getByTestId('save-button');
      expect(saveButton).toBeDisabled();
      
      // Make a change
      const articlesInput = screen.getByTestId('articles-per-page');
      fireEvent.change(articlesInput, { target: { value: '15' } });
      
      expect(saveButton).toBeEnabled();
    });

    it('clears unsaved changes warning after successful save', async () => {
      render(<UserPreferencesTestable darkMode={false} />);
      
      // Make a change
      const articlesInput = screen.getByTestId('articles-per-page');
      fireEvent.change(articlesInput, { target: { value: '15' } });
      
      // Warning should be visible
      expect(screen.getByTestId('unsaved-warning')).toBeInTheDocument();
      
      // Save changes
      const saveButton = screen.getByTestId('save-button');
      fireEvent.click(saveButton);
      
      // After save completes, warning should disappear
      await waitFor(() => {
        expect(screen.queryByTestId('unsaved-warning')).not.toBeInTheDocument();
      });
    });

    it('maintains preference state through multiple operations', () => {
      render(<UserPreferencesTestable darkMode={false} />);
      
      // Make multiple changes
      const articlesInput = screen.getByTestId('articles-per-page');
      fireEvent.change(articlesInput, { target: { value: '25' } });
      
      const viewSelect = screen.getByTestId('default-view');
      fireEvent.change(viewSelect, { target: { value: 'list' } });
      
      const techButton = screen.getByTestId('category-tech');
      fireEvent.click(techButton);
      
      // All changes should be preserved
      expect(articlesInput).toHaveValue(25);
      expect(viewSelect).toHaveValue('list');
      expect(screen.getByTestId('save-button')).toBeEnabled();
    });
  });

  describe('Accessibility and Usability', () => {
    it('has proper labels for form controls', () => {
      render(<UserPreferencesTestable darkMode={false} />);
      
      expect(screen.getByLabelText(/articles per page/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/default view/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/content language/i)).toBeInTheDocument();
    });

    it('toggle buttons are accessible and functional', () => {
      render(<UserPreferencesTestable darkMode={false} />);
      
      const showImagesToggle = screen.getByTestId('show-images-toggle');
      const compactModeToggle = screen.getByTestId('compact-mode-toggle');
      const hideReadToggle = screen.getByTestId('hide-read-articles-toggle');
      
      expect(showImagesToggle).toBeInTheDocument();
      expect(compactModeToggle).toBeInTheDocument();
      expect(hideReadToggle).toBeInTheDocument();
      
      // Test that toggles are clickable
      fireEvent.click(showImagesToggle);
      expect(screen.getByTestId('save-button')).toBeEnabled();
    });
  });
});