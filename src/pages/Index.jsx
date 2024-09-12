import React, { useState } from 'react';
import { useFloodReports, useAddFloodReport } from '../integrations/supabase/hooks/floodReports';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

const Index = () => {
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newReportedBy, setNewReportedBy] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');

  const { data: floodReports, refetch } = useFloodReports();
  const addFloodReportMutation = useAddFloodReport();

  React.useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 10000);

    return () => clearInterval(interval);
  }, [refetch]);

  const handleAddNews = () => {
    if (newTitle && newContent) {
      const newReport = {
        title: newTitle,
        content: newContent,
        reported_by: newReportedBy,
        image_url: newImageUrl,
      };
      addFloodReportMutation.mutate(newReport, {
        onSuccess: () => {
          setNewTitle('');
          setNewContent('');
          setNewReportedBy('');
          setNewImageUrl('');
          refetch();
        }
      });
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
          <Input
            type="text"
            placeholder="Reported By"
            value={newReportedBy}
            onChange={(e) => setNewReportedBy(e.target.value)}
            className="w-full"
          />
          <Input
            type="text"
            placeholder="Image URL"
            value={newImageUrl}
            onChange={(e) => setNewImageUrl(e.target.value)}
            className="w-full"
          />
          <Button onClick={handleAddNews} className="w-full">
            Add News
          </Button>
        </div>
        <div className="space-y-4">
          {floodReports && floodReports.map(report => (
            <div key={report.id} className="bg-white shadow-md rounded-lg p-6 transition-all hover:shadow-lg">
              <h2 className="text-xl font-semibold mb-2 text-blue-700">{report.title}</h2>
              <p className="text-gray-600 mb-4">{report.content}</p>
              {report.image_url && (
                <img src={report.image_url} alt={report.title} className="w-full h-48 object-cover mb-4 rounded" />
              )}
              <p className="text-sm text-gray-500">
                Reported by: {report.reported_by || 'Anonymous'} | 
                {new Date(report.created_at).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;