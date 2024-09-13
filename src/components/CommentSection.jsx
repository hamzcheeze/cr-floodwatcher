import React from 'react';
import { useComments } from '../integrations/supabase/hooks/comments';

const CommentSection = ({ reportId }) => {
  const { data: comments, isLoading, isError } = useComments(reportId);

  if (isLoading) return <p>Loading comments...</p>;
  if (isError) return <p>Error loading comments</p>;

  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold mb-2">Comments</h3>
      {comments && comments.map(comment => (
        <div key={comment.id} className="bg-gray-100 p-2 mb-2 rounded">
          <p>{comment.detail}</p>
          <p className="text-sm text-gray-500">By: {comment.by || 'Anonymous'}</p>
        </div>
      ))}
    </div>
  );
};

export default CommentSection;