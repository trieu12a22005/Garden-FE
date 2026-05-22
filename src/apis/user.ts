import { apiClient } from './axios';
import type { User } from '../types';

class UserApi {
  async getAll(params?: { role?: string; page?: number; limit?: number }) {
    const res = await apiClient.get('/admin/users', { params });
    return res.data;
  }
  async toggleActive(id: string, isActive: boolean) {
    const res = await apiClient.patch(`/admin/users/${id}`, { isActive });
    return res.data;
  }
}

export const userApi = new UserApi();
