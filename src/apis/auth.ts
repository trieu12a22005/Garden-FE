import { apiClient } from './axios';

class AuthApi {
    async login(data: { email: string; password: string }) {
        try {
            const response = await apiClient.post('/auth/login', data);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
}

const authApi = new AuthApi();
export default authApi;