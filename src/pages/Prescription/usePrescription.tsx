import prescriptionApi from "@/apis/medicine";
import type { Medicine } from "@/types/medicine";
import { useQuery } from "@tanstack/react-query";

export const UsePrescription = (name: string) => {
    const query = useQuery({
        queryKey: ['medicines',name],
        queryFn: async () => {
            const res = await prescriptionApi.getMedicine(name);
            return res.data as Medicine[];
        }
    });
    return {
       medicineOptions: query.data,
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error,
    };
}