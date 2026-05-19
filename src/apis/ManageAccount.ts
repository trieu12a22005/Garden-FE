import { apiClient } from './axios';
import type { RegisterPayload, RegisterManyPayload } from '@/types/ManageAccount';

class AccountApi {
    // Lấy danh sách tất cả tài khoản
    async getAccounts() {
        const response = await apiClient.get('/admin/account');
        return response.data?.accounts || response.data || [];
    }

    // Tạo tài khoản mới
    async postAccount(data: RegisterPayload) {
        const response = await apiClient.post('/admin/account/register', data);
        return response.data;
    }

    // Cập nhật thông tin tài khoản
    async updateAccount(id: string | number, data: any) {
        const response = await apiClient.put(`/admin/account/${id}`, data);
        return response.data;
    }

    // Xóa tài khoản
    async deleteAccount(id: string | number) {
        const response = await apiClient.delete(`/admin/account/${id}`);
        return response.data;
    }

    // Import tài khoản từ danh sách JSON
    async importAccounts(data: RegisterManyPayload[]) {
        const response = await apiClient.post('/admin/account/register-many', data);
        return response.data;
    }
}

const accountApi = new AccountApi();
export default accountApi;