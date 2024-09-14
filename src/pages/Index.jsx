import React, { useState, useRef } from 'react';
import { useFloodReports, useAddFloodReport } from '../integrations/supabase/hooks/floodReports';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { supabase } from '../integrations/supabase/supabase';
import { toast } from 'sonner';
import FloodReportItem from '../components/FloodReportItem';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newReportedBy, setNewReportedBy] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const fileInputRef = useRef(null);
  const { userRole, logout } = useAuth();
  const navigate = useNavigate();

  const { data: floodReports, isLoading, error } = useFloodReports();
  const addFloodReportMutation = useAddFloodReport();

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const uploadImage = async (file) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const { data, error: uploadError } = await supabase.storage
        .from('flood-images')
        .upload(fileName, file);

      if (uploadError) {
        console.error('Error uploading file:', uploadError);
        toast.error(`Error uploading image: ${uploadError.message}`);
        return null;
      }

      const { data: urlData, error: urlError } = await supabase.storage
        .from('flood-images')
        .getPublicUrl(fileName);

      if (urlError) {
        console.error('Error getting public URL:', urlError);
        toast.error(`Error getting image URL: ${urlError.message}`);
        return null;
      }

      return urlData.publicUrl;
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error(`An unexpected error occurred: ${error.message}`);
      return null;
    }
  };

  const handleAddReport = async () => {
    if (newTitle && newContent && newLocation) {
      let imageUrl = null;
      if (selectedFile) {
        imageUrl = await uploadImage(selectedFile);
        if (!imageUrl) {
          return;
        }
      }

      const newReport = {
        title: newTitle,
        content: newContent,
        reported_by: newReportedBy,
        location: newLocation,
        image_url: imageUrl,
      };

      addFloodReportMutation.mutate(newReport, {
        onSuccess: () => {
          setNewTitle('');
          setNewContent('');
          setNewReportedBy('');
          setNewLocation('');
          setSelectedFile(null);
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
          setIsOpen(false);
          toast.success('Report added successfully');
        },
        onError: (error) => {
          console.error('Error adding report:', error);
          toast.error('Failed to add report');
        }
      });
    } else {
      toast.error('Please fill in the title, content, and location');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (isLoading) {
    return <div className="min-h-screen bg-gray-100 p-8 flex justify-center items-center">Loading...</div>;
  }

  if (error) {
    return <div className="min-h-screen bg-gray-100 p-8 flex justify-center items-center">Error: {error.message}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-blue-800">
            รายงานข่าวน้ำท่วมเชียงราย 2567
          </h1>
          <div>
            <p className="text-right mb-2">Role: {userRole}</p>
            {userRole === 'admin' && <Button onClick={handleLogout}>Logout</Button>}
          </div>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="mb-8 w-full">Report</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>เพิ่มข้อมูล</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                type="text"
                placeholder="หัวข้อ"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
              />
              <Textarea
                placeholder="รายละเอียด"
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
              />
              <Input
                type="text"
                placeholder="สถานที่"
                value={newLocation}
                onChange={(e) => setNewLocation(e.target.value)}
              />
              <Input
                type="text"
                placeholder="โดย"
                value={newReportedBy}
                onChange={(e) => setNewReportedBy(e.target.value)}
              />
              <Input
                type="file"
                onChange={handleFileChange}
                ref={fileInputRef}
                placeholder="อัพโหลดรูปภาพ"
              />
              <Button onClick={handleAddReport}>Report</Button>
            </div>
          </DialogContent>
        </Dialog>
        <div className="space-y-4">
          {floodReports && floodReports.map(report => (
            <FloodReportItem
              key={report.id}
              report={report}
              onEdit={() => setIsOpen(true)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;
