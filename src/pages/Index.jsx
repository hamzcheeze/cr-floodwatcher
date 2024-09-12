import React, { useState, useEffect } from 'react';
import FloodNewsItem from '../components/FloodNewsItem';
import { initialFloodNews } from '../data/floodNewsData';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

const Index = () => {
  const [floodNews, setFloodNews] = useState(initialFloodNews);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      // This interval now only triggers a re-render, 
      // allowing for real-time updates if new data is added
      setFloodNews(prevNews => [...prevNews]);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const handleAddNews = () => {
    if (newTitle && newContent) {
      const newUpdate = {
        id: Date.now(),
        title: newTitle,
        content: newContent,
        timestamp: new Date().toISOString(),
      };
      setFloodNews(prevNews => [newUpdate, ...prevNews]);
      setNewTitle('');
      setNewContent('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center text-blue-800">
          Flood News: Water Flood, Chiang Rai, Thailand
        </h1>
        <div className="mb-8 space-y-4">
          <Input
            type="text"
            placeholder="News Title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="w-full"
          />
          <Textarea
            placeholder="News Content"
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            className="w-full"
          />
          <Button onClick={handleAddNews} className="w-full">
            Add News
          </Button>
        </div>
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