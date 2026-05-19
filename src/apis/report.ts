import { apiClient } from './axios';

class ReportApi {
    async getBM1(date: string) {
        const response = await apiClient.get('/admin/report/examination-list', { params: { date } });
        return response.data;
    }
}

const reportApi = new ReportApi();
export default reportApi;
