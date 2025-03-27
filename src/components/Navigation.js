import React from 'react';

const Navigation = ({ next, previous }) => {
  return (
    <div className="flex justify-between mt-8">
      <button
        onClick={previous}
        className="px-5 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center gap-2"
      >
        <span>Previous</span>
        <span className="text-purple-400">➜</span>
      </button>
      <button
        onClick={next}
        className="px-5 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center gap-2"
      >
        <span>Next</span>
        <span className="text-purple-400">➜</span>
      </button>
    </div>
  );
};

export default Navigation;