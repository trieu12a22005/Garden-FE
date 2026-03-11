// src/hooks/useTimetable.ts
import timeTableApi from '@/apis/timetable';
import type { TimetableResponse } from '@/types/timetable';
import { useQuery } from '@tanstack/react-query';
export const useTimetable = (doctorId: string) => {
    // Mang toàn bộ logic useQuery vào đây
    const query = useQuery({
        queryKey: ['timetables', doctorId],
        queryFn: async () => {
            const res = await timeTableApi.getTimetable(doctorId);
            return res.timetables as TimetableResponse[];
        },
        enabled: !!doctorId, // (Mẹo) Chỉ gọi API khi doctorId có giá trị
    });
    return {
        timetables: query.data,
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error,
    };
};