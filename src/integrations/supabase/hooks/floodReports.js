import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase';

const fromSupabase = async (query) => {
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data;
};

/*
### flood_reports

| name        | type                     | format    | required |
|-------------|--------------------------|-----------|----------|
| id          | integer                  | bigint    | true     |
| created_at  | string                   | timestamp | true     |
| updated_at  | string                   | timestamp | true     |
| title       | string                   | text      | true     |
| content     | string                   | text      | true     |
| reported_by | string                   | text      | false    |
| image_url   | string                   | text      | false    |
| location    | string                   | text      | false    |

Note: 
- id is the Primary Key
- created_at and updated_at have default values of now()
*/

export const useFloodReports = () => useQuery({
    queryKey: ['flood_reports'],
    queryFn: () => fromSupabase(supabase.from('flood_reports').select('*').order('created_at', { ascending: false })),
});

export const useFloodReport = (id) => useQuery({
    queryKey: ['flood_reports', id],
    queryFn: () => fromSupabase(supabase.from('flood_reports').select('*').eq('id', id).single()),
});

export const useAddFloodReport = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newReport) => fromSupabase(supabase.from('flood_reports').insert([newReport])),
        onSuccess: () => {
            queryClient.invalidateQueries(['flood_reports']);
        },
    });
};

export const useUpdateFloodReport = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, ...updateData }) => fromSupabase(supabase.from('flood_reports').update(updateData).eq('id', id)),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries(['flood_reports']);
            queryClient.invalidateQueries(['flood_reports', variables.id]);
        },
    });
};

export const useDeleteFloodReport = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => fromSupabase(supabase.from('flood_reports').delete().eq('id', id)),
        onSuccess: () => {
            queryClient.invalidateQueries(['flood_reports']);
        },
    });
};