import { apiClient } from './axios';
class FacultyApi {
  async getFaculty() {
    const response = await apiClient.get('/admin/faculty');
    return response.data;
  }
}

const facultyApi = new FacultyApi();
export default facultyApi;