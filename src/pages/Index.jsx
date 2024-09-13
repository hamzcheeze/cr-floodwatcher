import React, { useState, useRef, useEffect } from 'react';
import { useFloodReports, useAddFloodReport } from '../integrations/supabase/hooks/floodReports';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { supabase } from '../integrations/supabase/supabase';
import { toast } from 'sonner';
import CommentSection from '../components/CommentSection';
import CommentForm from '../components/CommentForm';
import EditReportDialog from '../components/EditReportDialog';

const Index = () => {
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newReportedBy, setNewReportedBy] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [userRole, setUserRole] = useState('user');
  const fileInputRef = useRef(null);

  const { data: floodReportsData, isLoading, error, refetch } = useFloodReports();
  const addFloodReportMutation = useAddFloodReport();

  useEffect(() => {
    const checkUserRole = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user && user.email === 'admin@example.com') {
        setUserRole('admin');
      }
    };
    checkUserRole();
  }, []);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const uploadImage = async (file) => {
    try {
      const { data: buckets } = await supabase.storage.listBuckets();
      const bucketExists = buckets.some(bucket => bucket.name === 'flood-images');
      
      if (!bucketExists) {
        console.error('Bucket "flood-images" does not exist');
        toast.error('Image upload failed: Storage bucket not found');
        return null;
      }

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

      const { data } = supabase.storage
        .from('flood-images')
        .getPublicUrl(fileName);

      if (!data || !data.publicUrl) {
        console.error('Error getting public URL');
        toast.error('Error processing image');
        return null;
      }

      return data.publicUrl;
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('An unexpected error occurred');
      return null;
    }
  };

  const handleAddNews = async () => {
    if (newTitle && newContent && newLocation) {
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
          refetch();
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

  if (isLoading) {
    return <div className="min-h-screen bg-gray-100 p-8 flex justify-center items-center">Loading...</div>;
  }

  if (error) {
    return <div className="min-h-screen bg-gray-100 p-8 flex justify-center items-center">Error: {error.message}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center text-blue-800">
          รายงานข่าวน้ำท่วมเชียงราย 2567
        </h1>
        <p className="text-center mb-4">Your role: {userRole}</p>
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
              <Button onClick={handleAddNews}>Report</Button>
            </div>
          </DialogContent>
        </Dialog>
        <div className="space-y-4">
          {floodReportsData && floodReportsData.reports && floodReportsData.reports.map(report => (
            <div key={report.id} className="bg-white shadow-md rounded-lg p-6 transition-all hover:shadow-lg">
              <h2 className="text-xl font-semibold mb-2 text-blue-700">{report.title}</h2>
              <p className="text-gray-600 mb-4">{report.content}</p>
              {report.image_url && (
                <img src={report.image_url} alt={report.title} className="w-full h-48 object-cover mb-4 rounded" />
              )}
              <p className="text-sm text-gray-500">
                สถานที่: {report.location || 'Not specified'}
              </p>
              <p className="text-sm text-gray-500">
                จาก: {report.reported_by || 'Anonymous'}
              </p>
              <p className="text-sm text-gray-500">
                {new Date(report.created_at).toLocaleString()}
              </p>
              {userRole === 'admin' && (
                <Button onClick={() => setIsOpen(true)} className="mt-2 bg-yellow-500 hover:bg-yellow-600">
                  Edit Report
                </Button>
              )}
              {isOpen && userRole === 'admin' && (
                <EditReportDialog report={report} onClose={() => { setIsOpen(false); refetch(); }} />
              )}
              <CommentSection reportId={report.id} />
              <CommentForm reportId={report.id} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;