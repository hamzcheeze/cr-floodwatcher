import React, { useState, useRef, useEffect } from 'react';
import { useFloodReports, useAddFloodReport } from '../integrations/supabase/hooks/floodReports';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { supabase } from '../integrations/supabase/supabase';
import { toast } from 'sonner';

const Index = () => {
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newReportedBy, setNewReportedBy] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const fileInputRef = useRef(null);

  const { data: floodReports, refetch } = useFloodReports();
  const addFloodReportMutation = useAddFloodReport();

  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 10000);

    return () => clearInterval(interval);
  }, [refetch]);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const uploadImage = async (file) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('flood-images')
        .upload(fileName, file);

      if (uploadError) {
        console.error('Error uploading file:', uploadError);
        toast.error('Error uploading image');
        return null;
      }

      const { data: { publicUrl }, error: urlError } = supabase.storage
        .from('flood-images')
        .getPublicUrl(fileName);

      if (urlError) {
        console.error('Error getting public URL:', urlError);
        toast.error('Error processing image');
        return null;
      }

      return publicUrl;
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('An unexpected error occurred');
      return null;
    }
  };

  const handleAddNews = async () => {
    if (newTitle && newContent) {
      let imageUrl = null;
      if (selectedFile) {
        imageUrl = await uploadImage(selectedFile);
        if (!imageUrl) {
          return; // Exit if image upload failed
        }
      }

      const newReport = {
        title: newTitle,
        content: newContent,
        reported_by: newReportedBy,
        image_url: imageUrl,
      };

      addFloodReportMutation.mutate(newReport, {
        onSuccess: () => {
          setNewTitle('');
          setNewContent('');
          setNewReportedBy('');
          setSelectedFile(null);
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
          setIsOpen(false);
          refetch();
          toast.success('News added successfully');
        },
        onError: (error) => {
          console.error('Error adding news:', error);
          toast.error('Failed to add news');
        }
      });
    } else {
      toast.error('Please fill in the title and content');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center text-blue-800">
          Flood News: Water Flood, Chiang Rai, Thailand
        </h1>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="mb-8 w-full">Add News</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Flood Report</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                type="text"
                placeholder="News Title"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
              />
              <Textarea
                placeholder="News Content"
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
              />
              <Input
                type="text"
                placeholder="Reported By"
                value={newReportedBy}
                onChange={(e) => setNewReportedBy(e.target.value)}
              />
              <Input
                type="file"
                onChange={handleFileChange}
                ref={fileInputRef}
              />
              <Button onClick={handleAddNews}>Submit News</Button>
            </div>
          </DialogContent>
        </Dialog>
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