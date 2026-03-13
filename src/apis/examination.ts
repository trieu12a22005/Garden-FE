import type { GetExaminationsParams } from '@/types/examinationType';
import { apiClient } from './axios';
class ExaminationApi {
  async getExaminations(params: GetExaminationsParams) {
    const response = await apiClient.get('/examine/ticket', {
      params,
    });
    return response.data;
  }
}

const examinationApi = new ExaminationApi();
export default examinationApi;