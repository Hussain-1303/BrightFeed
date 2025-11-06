import React from 'react';
import { useNavigate } from 'react-router-dom';

const UserPreferences = ({ categories, preferences, onChange }) => {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">User Preferences</h2>
      <div className="space-y-4">
        {categories.map((category) => (
          <div key={category} className="flex items-center gap-4">
            <label className="text-gray-700 dark:text-gray-300 capitalize">
              {category === "sport" ? "Sports" : category}
            </label>
            <select
              value={preferences[category] || 'medium'}
              onChange={(e) => onChange(category, e.target.value)}
              className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
          </div>
        ))}
      </div>
      <button
        onClick={() => navigate(-1)}
        className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Save & Back
      </button>
    </div>
  );
};

export default UserPreferences;