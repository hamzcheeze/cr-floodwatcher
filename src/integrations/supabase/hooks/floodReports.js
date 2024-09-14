import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase';
import { useEffect } from 'react';

const fromSupabase = async (query) => {
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data;
};

export const useFloodReports = () => {
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: ['flood_reports'],
        queryFn: () => fromSupabase(supabase.from('flood_reports').select('*').order('created_at', { ascending: false })),
    });

    useEffect(() => {
        const subscription = supabase
            .channel('flood_reports_changes')
            .on('postgres_changes', 
                { event: 'INSERT', schema: 'public', table: 'flood_reports' },
                (payload) => {
                    queryClient.setQueryData(['flood_reports'], (oldData) => {
                        if (!oldData) return [payload.new];
                        return [payload.new, ...oldData];
                    });
                }
            )
            .subscribe();

        return () => {
            subscription.unsubscribe();
        };
    }, [queryClient]);

    return query;
};

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
