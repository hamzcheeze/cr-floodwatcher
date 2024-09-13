import React, { useState } from 'react';
import { useAddComment } from '../integrations/supabase/hooks/comments';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';

const CommentForm = ({ reportId }) => {
  const [newComment, setNewComment] = useState('');
  const [newCommentBy, setNewCommentBy] = useState('');
  const addCommentMutation = useAddComment();

  const handleAddComment = () => {
    if (newComment) {
      addCommentMutation.mutate({
        detail: newComment,
        by: newCommentBy || 'Anonymous',
        reports_id: reportId
      }, {
        onSuccess: () => {
          setNewComment('');
          setNewCommentBy('');
          toast.success('Comment added successfully');
        },
        onError: (error) => {
          console.error('Error adding comment:', error);
          toast.error('Failed to add comment');
        }
      });
    }
  };

  return (
    <div className="mt-4">
      <Input
        type="text"
        placeholder="Your name"
        value={newCommentBy}
        onChange={(e) => setNewCommentBy(e.target.value)}
        className="mb-2"
      />
      <Textarea
        placeholder="Add a comment"
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        className="mb-2"
      />
      <Button onClick={handleAddComment}>Add Comment</Button>
    </div>
  );
};

export default CommentForm;