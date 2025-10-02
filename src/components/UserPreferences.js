import React from 'react';

const UserPreferences = ({ categories, preferences, onChange }) => {
  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center">User Preferences</h2>
      {categories.map((category) => (
        <div key={category} className="mb-4">
          <label className="block text-gray-700">{category === 'sport' ? 'Sports' : category}</label>
          <input
            type="range"
            min="0"
            max="5"
            value={preferences[category] || 0}
            onChange={(e) => onChange(category, parseInt(e.target.value))}
            className="w-full"
          />
          <span className="text-gray-600">Priority: {preferences[category] || 0}/5</span>
        </div>
      ))}
      <button onClick={() => window.history.back()} className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
        Back
      </button>
    </div>
  );
};

export default UserPreferences;