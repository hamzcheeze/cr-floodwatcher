import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase';

const fromSupabase = async (query) => {
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data;
};

/*
### comments

| name       | type    | format    | required |
|------------|---------|-----------|----------|
| id         | integer | bigint    | true     |
| created_at | string  | timestamp | true     |
| detail     | string  | text      | true     |
| by         | string  | text      | false    |
| reports_id | integer | bigint    | true     |

Note:
- id is the Primary Key
- created_at has a default value of now()
- reports_id is a Foreign Key referencing flood_reports(id)
*/

export const useComments = (floodReportId) => useQuery({
    queryKey: ['comments', floodReportId],
    queryFn: () => fromSupabase(supabase.from('comments').select('*').eq('reports_id', floodReportId).order('created_at', { ascending: true })),
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
            queryClient.invalidateQueries(['comments']);
            queryClient.invalidateQueries(['comments', variables.reports_id]);
        },
    });
};

export const useDeleteComment = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => fromSupabase(supabase.from('comments').delete().eq('id', id)),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries(['comments']);
            queryClient.invalidateQueries(['comments', variables.reports_id]);
        },
    });
};