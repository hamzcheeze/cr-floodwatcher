import React, { useState, useEffect } from 'react';
import FloodNewsItem from '../components/FloodNewsItem';
import { initialFloodNews } from '../data/floodNewsData';

const Index = () => {
  const [floodNews, setFloodNews] = useState(initialFloodNews);

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      const newUpdate = {
        id: Date.now(),
        title: `New Flood Update ${Math.floor(Math.random() * 100)}`,
        content: 'Water levels continue to rise in some areas. Please stay alert.',
        timestamp: new Date().toISOString(),
      };
      setFloodNews(prevNews => [newUpdate, ...prevNews]);
    }, 10000); // Add a new update every 10 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center text-blue-800">
          Flood News: Water Flood, Chiang Rai, Thailand
        </h1>
        <div className="space-y-4">
          {floodNews.map(news => (
            <FloodNewsItem key={news.id} news={news} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;