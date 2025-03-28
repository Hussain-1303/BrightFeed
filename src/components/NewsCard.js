import React from 'react';
import { Link } from 'react-router-dom';

const NewsCard = ({ article, category }) => {
    // Category icons for each category
    const categoryIcons = {
        sports: "⚽",
        tech: "💻",
        world: "🌍",
        politics: "🏛️",
        other: "🌟",
    };

    return (
        <div className="relative bg-white rounded-2xl shadow-md overflow-hidden">
            <div className="absolute top-2 right-2 text-purple-400 text-xl">➜</div>

            {article.image ? (
                <img
                    src={article.image}
                    alt={article.headline}
                    className="w-full h-48 object-cover"
                />
            ) : (
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500">No Image</span>
                </div>
            )}

            <div className="p-5">
                <div className="flex items-center gap-4 mb-4">
                    <span className="text-4xl">{categoryIcons[category]}</span>
                    <h3 className="text-xl font-semibold text-blue-600 mb-2 line-clamp-2">
                        {article.headline}
                    </h3>
                </div>
                <p className="text-gray-600 mb-3 line-clamp-3">{article.summary}</p>
                <Link
                    to={`/${category}`}
                    className="text-blue-500 hover:text-blue-700 font-medium"
                >
                    Read More
                </Link>
            </div>
        </div>
    );
};

export default NewsCard;