import type { PostExamineData } from "@/types/examine";
import { apiClient } from "./axios";

class ExamineApi {
    async postExamination(data: PostExamineData) {
        const response = await apiClient.post('/examine/ticket', data);
        return response.data;
    }
}

const examineApi = new ExamineApi();
export default examineApi;