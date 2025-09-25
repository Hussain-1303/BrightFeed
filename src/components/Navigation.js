import React from 'react';

const Navigation = ({ next, previous, darkMode }) => {
  return (
    <div className="flex justify-between mt-8">
      <button
        onClick={previous}
        className={`px-4 py-2 rounded-lg ${darkMode ? 'bg-neutral-700 text-white hover:bg-neutral-600' : 'bg-neutral-200 text-neutral-800 hover:bg-neutral-300'} flex items-center gap-2 transition-colors`}
      >
        <span className="text-brand-400">←</span>
        <span>Previous</span>
        
      </button>
      <button
        onClick={next}
        className={`px-4 py-2 rounded-lg ${darkMode ? 'bg-neutral-700 text-white hover:bg-neutral-600' : 'bg-neutral-200 text-neutral-800 hover:bg-neutral-300'} flex items-center gap-2 transition-colors`}
      >
        <span>Next</span>
        <span className="text-brand-400">→</span>
      </button>
    </div>
  );
};

export default Navigation;