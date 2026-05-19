import { apiClient } from './axios';

class RoleApi {
    async getRoles() {
        const response = await apiClient.get('/admin/role');
        return response.data;
    }
}

const roleApi = new RoleApi();
export default roleApi;
