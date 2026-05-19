import { apiClient } from './axios';
class RoomApi {
  async getRooms() {
    const response = await apiClient.get('/admin/rooms');
    return response.data;
  }
}

const roomApi = new RoomApi();
export default roomApi;
