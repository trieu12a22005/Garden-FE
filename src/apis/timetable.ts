import { apiClient } from './axios';
class TimeTableApi {
  async getTimetable(accountID: string) {
    const response = await apiClient.get(`/admin/timetables/doctor/${accountID}`);
    return response.data;
  }
}

const timeTableApi = new TimeTableApi();
export default timeTableApi;