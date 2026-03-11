import { apiClient } from './axios';
class TimeTableApi {
  async getTimetable(doctorID: string) {
    const response = await apiClient.get(`/admin/timetables/doctor/${doctorID}`);
    return response.data;
  }
}

const timeTableApi = new TimeTableApi();
export default timeTableApi;