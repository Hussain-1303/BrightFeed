import React from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const Navigation = ({ next, previous, darkMode }) => {
  return (
    <div className="flex justify-between items-center mt-12 gap-4">
      <button
        onClick={previous}
        className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 hover:scale-105
          ${darkMode 
            ? 'bg-neutral-700 text-white hover:bg-neutral-600 border border-neutral-600' 
            : 'bg-white text-neutral-700 hover:bg-neutral-50 border border-neutral-300'
          }`}
        aria-label="Previous page"
      >
        <FiChevronLeft size={20} />
        <span>Previous</span>
      </button>

      {/* Center spacer */}
      <div className="flex-grow"></div>

      <button
        onClick={next}
        className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 hover:scale-105
          ${darkMode 
            ? 'bg-neutral-700 text-white hover:bg-neutral-600 border border-neutral-600' 
            : 'bg-white text-neutral-700 hover:bg-neutral-50 border border-neutral-300'
          }`}
        aria-label="Next page"
      >
        <span>Next</span>
        <FiChevronRight size={20} />
      </button>
    </div>
  );
};

export default Navigation;