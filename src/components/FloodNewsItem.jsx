import React from 'react';

const FloodNewsItem = ({ news }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 transition-all hover:shadow-lg">
      <h2 className="text-xl font-semibold mb-2 text-blue-700">{news.title}</h2>
      <p className="text-gray-600 mb-4">{news.content}</p>
      <p className="text-sm text-gray-500">
        {new Date(news.timestamp).toLocaleString()}
      </p>
    </div>
  );
};

export default FloodNewsItem;