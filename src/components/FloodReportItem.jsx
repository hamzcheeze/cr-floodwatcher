import React from 'react';
import { Button } from "@/components/ui/button";
import CommentSection from './CommentSection';
import CommentForm from './CommentForm';
import EditReportDialog from './EditReportDialog';

const FloodReportItem = ({ report, userRole, onEdit, refetch }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="bg-white shadow-md rounded-lg p-6 transition-all hover:shadow-lg">
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
  );
};

export default FloodReportItem;