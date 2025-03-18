import React from 'react';

const Navigation = ({ next, previous }) => {
  return (
    <div className="flex justify-between mt-6">
      <button
        onClick={previous}
        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
      >
        Previous
      </button>
      <button
        onClick={next}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        Next
      </button>
    </div>
  );
};

export default Navigation;
