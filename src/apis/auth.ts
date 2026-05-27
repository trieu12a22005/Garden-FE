import { apiClient } from './axios';
import type { User } from '../types';

export interface LoginResponse {
  message: string;
  user: User;
  accessToken: string;
  refreshToken: string;
}

interface RefreshTokenResponse {
  message: string;
  accessToken: string;
  refreshToken?: string;
}

class AuthApi {
  async login(data: { email: string; password: string }): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>('/auth/login', data, {
      skipAuthRefresh: true,
    });
    return response.data;
  }

  async logout() {
    // Get refresh token from local storage (zustand)
    const stateStr = localStorage.getItem('garden-auth');
    let refreshToken = null;
    if (stateStr) {
      try {
        const state = JSON.parse(stateStr);
        refreshToken = state.state?.refreshToken;
      } catch (e) {}
    }
    const response = await apiClient.post('/auth/logout', refreshToken ? { refreshToken } : {});
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
    const stateStr = localStorage.getItem('garden-auth');
    let refreshToken = null;
    if (stateStr) {
      try {
        const state = JSON.parse(stateStr);
        refreshToken = state.state?.refreshToken;
      } catch (e) {}
    }
    const response = await apiClient.post<RefreshTokenResponse>('/auth/refresh', refreshToken ? { refreshToken } : {}, {
      skipAuthRefresh: true,
    });
    return response.data;
  }
}

const authApi = new AuthApi();
export default authApi;
