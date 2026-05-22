import { apiClient } from './axios';
import type { User } from '../types';

export interface LoginResponse {
  message: string;
  user: User;
}

interface RefreshTokenResponse {
  message: string;
}

class AuthApi {
  async login(data: { email: string; password: string }): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>('/auth/login', data, {
      skipAuthRefresh: true,
    });
    return response.data;
  }

  async logout() {
    const response = await apiClient.post('/auth/logout');
    return response.data;
  }

  async getMe(): Promise<{ user: User }> {
    const response = await apiClient.get<{ user: User }>('/auth/me');
    return response.data;
  }

  async updateProfile(data: { fullName?: string; avatarUrl?: string }) {
    const response = await apiClient.patch('/auth/update-profile', data);
    return response.data;
  }

  async updatePassword(data: { currentPassword: string; newPassword: string }) {
    const response = await apiClient.patch('/auth/update-password', data);
    return response.data;
  }

  async refreshToken(): Promise<RefreshTokenResponse> {
    const response = await apiClient.post<RefreshTokenResponse>('/auth/refresh', {}, {
      skipAuthRefresh: true,
    });
    return response.data;
  }
}

const authApi = new AuthApi();
export default authApi;
