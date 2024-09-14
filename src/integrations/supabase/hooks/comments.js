import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase';

const fromSupabase = async (query) => {
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data;
};

/*
### comments

| name       | type                     | format | required |
|------------|--------------------------|--------|----------|
| id         | int8                     | number | true     |
| created_at | timestamp with time zone | string | true     |
| detail     | text                     | string | true     |
| by         | text                     | string | false    |
| reports_id | int8                     | number | true     |

Foreign Key Relationships:
- reports_id references flood_reports.id
*/

export const useComments = (reportId) => useQuery({
    queryKey: ['comments', reportId],
    queryFn: () => fromSupabase(supabase.from('comments').select('*').eq('reports_id', reportId)),
});

export const useAddComment = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newComment) => fromSupabase(supabase.from('comments').insert([newComment])),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries(['comments', variables.reports_id]);
        },
    });
};

export const useUpdateComment = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, ...updateData }) => fromSupabase(supabase.from('comments').update(updateData).eq('id', id)),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries(['comments', variables.reports_id]);
        },
    });
};

export const useDeleteComment = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => fromSupabase(supabase.from('comments').delete().eq('id', id)),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries(['comments', variables.reports_id]);
        },
    });
};
