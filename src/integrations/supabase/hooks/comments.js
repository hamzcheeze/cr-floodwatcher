import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase';

const fromSupabase = async (query) => {
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data;
};

/*
### comments

| name           | type      | format    | required |
|----------------|-----------|-----------|----------|
| id             | integer   | bigint    | true     |
| created_at     | string    | timestamp | true     |
| flood_report_id| integer   | bigint    | true     |
| content        | string    | text      | true     |
| user_name      | string    | text      | false    |

Note: 
- id is the Primary Key
- created_at has a default value of now()
- flood_report_id is a Foreign Key referencing flood_reports(id)
*/

export const useComments = (floodReportId) => useQuery({
    queryKey: ['comments', floodReportId],
    queryFn: () => fromSupabase(supabase.from('comments').select('*').eq('flood_report_id', floodReportId).order('created_at', { ascending: true })),
});

export const useAddComment = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newComment) => fromSupabase(supabase.from('comments').insert([newComment])),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries(['comments', variables.flood_report_id]);
        },
    });
};