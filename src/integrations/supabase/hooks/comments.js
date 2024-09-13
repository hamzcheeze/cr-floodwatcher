import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase';

const fromSupabase = async (query) => {
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data;
};

export const useComments = (reportId) => useQuery({
    queryKey: ['comments', reportId],
    queryFn: () => fromSupabase(
        supabase
            .from('comments')
            .select('*')
            .eq('reports_id', reportId)
            .order('created_at', { ascending: true })
    ),
    refetchInterval: 10000, // Refetch every 10 seconds
});

export const useAddComment = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newComment) => fromSupabase(
            supabase
                .from('comments')
                .insert([{ 
                    detail: newComment.detail, 
                    by: newComment.by, 
                    reports_id: newComment.reports_id 
                }])
        ),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries(['comments', variables.reports_id]);
        },
    });
};

export const useUpdateComment = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, ...updateData }) => fromSupabase(
            supabase
                .from('comments')
                .update(updateData)
                .eq('id', id)
        ),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries(['comments', variables.reports_id]);
        },
    });
};

export const useDeleteComment = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => fromSupabase(
            supabase
                .from('comments')
                .delete()
                .eq('id', id)
        ),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries(['comments']);
        },
    });
};