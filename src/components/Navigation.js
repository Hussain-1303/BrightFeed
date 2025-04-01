import React from 'react';

const Navigation = ({ next, previous, darkMode }) => {
  return (
    <div className="flex justify-between mt-8">
      <button
        onClick={previous}
        className={`px-4 py-2 rounded-lg ${darkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'} flex items-center gap-2`}
      >
        <span>Previous</span>
        <span className="text-purple-400">➜</span>
      </button>
      <button
        onClick={next}
        className={`px-4 py-2 rounded-lg ${darkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'} flex items-center gap-2`}
      >
        <span>Next</span>
        <span className="text-purple-400">➜</span>
      </button>
    </div>
  );
};

export default Navigation;