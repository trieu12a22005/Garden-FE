import { apiClient } from './axios';

class AuthApi {
    async login(data: { email: string; password: string }) {
        const response = await apiClient.post('/auth/login', data);
        return response.data;
    }
    async logout() {
        const response = await apiClient.get('/auth/logout');
        return response.data;
    }
}

const authApi = new AuthApi();
export default authApi;