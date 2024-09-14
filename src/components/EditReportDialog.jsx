import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useUpdateFloodReport } from '../integrations/supabase/hooks/floodReports';
import { toast } from 'sonner';

const EditReportDialog = ({ report, onClose }) => {
  const [title, setTitle] = useState(report.title);
  const [content, setContent] = useState(report.content);
  const [reportedBy, setReportedBy] = useState(report.reported_by);
  const [location, setLocation] = useState(report.location);

  const updateFloodReportMutation = useUpdateFloodReport();

  useEffect(() => {
    setTitle(report.title);
    setContent(report.content);
    setReportedBy(report.reported_by);
    setLocation(report.location);
  }, [report]);

  const handleUpdate = () => {
    updateFloodReportMutation.mutate(
      {
        id: report.id,
        title,
        content,
        reported_by: reportedBy,
        location,
        updated_at: new Date().toISOString(),
      },
      {
        onSuccess: () => {
          onClose();
          toast.success('Report updated successfully');
        },
        onError: (error) => {
          console.error('Error updating report:', error);
          toast.error('Failed to update report');
        },
      }
    );
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Report</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Textarea
            placeholder="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <Input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <Input
            type="text"
            placeholder="Reported By"
            value={reportedBy}
            onChange={(e) => setReportedBy(e.target.value)}
          />
          <Button onClick={handleUpdate}>Update Report</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditReportDialog;
