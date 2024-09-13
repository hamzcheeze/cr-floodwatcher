// Import all the relevant exports from other files in the supabase directory
import { supabase } from './supabase.js';
import { SupabaseAuthProvider, useSupabaseAuth, SupabaseAuthUI } from './auth.jsx';
import {
  useFloodReports,
  useFloodReport,
  useAddFloodReport,
  useUpdateFloodReport,
  useDeleteFloodReport
} from './hooks/floodReports.js';
import {
  useComments,
  useAddComment,
  useUpdateComment,
  useDeleteComment
} from './hooks/comments.js';

// Export all the imported functions and objects
export {
  supabase,
  SupabaseAuthProvider,
  useSupabaseAuth,
  SupabaseAuthUI,
  useFloodReports,
  useFloodReport,
  useAddFloodReport,
  useUpdateFloodReport,
  useDeleteFloodReport,
  useComments,
  useAddComment,
  useUpdateComment,
  useDeleteComment
};