import examinationApi from "@/apis/examination";
import type { GetExaminationsParams } from "@/types/examinationType";
import { useQuery } from "@tanstack/react-query";

export const UseExamination = (params: GetExaminationsParams) => {
    const query = useQuery({
        queryKey: ['examinations', params],
        queryFn: async () => {
            const res = await examinationApi.getExaminations(params);
            return res.data;
        }
    });
    return {
        examinations: query.data,
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error,
    };
}