import React from 'react';
import { Link } from 'react-router-dom';

const Navigation = ({ next, previous }) => {
    const categories = ["sports", "tech", "world", "politics", "other"];

    return (
        <div className="flex justify-between mt-8">
            {/* Previous Button */}
            <button
                onClick={previous}
                className="px-5 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center gap-2"
            >
                <span>Previous</span>
                <span className="text-purple-400">➜</span>
            </button>

            {/* Category Links */}
            <div className="space-x-6">
                {categories.map((category) => (
                    <Link
                        key={category}
                        to={`/${category}`}
                        className="text-lg font-medium text-white hover:text-blue-500"
                    >
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                    </Link>
                ))}
            </div>

            {/* Next Button */}
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