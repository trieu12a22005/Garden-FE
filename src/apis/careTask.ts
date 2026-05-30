import { apiClient } from './axios';
import type { CareTask } from '../types';

class CareTaskApi {
  async getAll(): Promise<{ data: CareTask[] }> {
    const res = await apiClient.get('/care-tasks');
    return res.data;
  }
  async create(data: FormData) {
    const res = await apiClient.post('/care-tasks', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  }
  async update(id: string, data: Partial<CareTask>) {
    const res = await apiClient.patch(`/care-tasks/${id}`, data);
    return res.data;
  }
  async uploadCharacterImage(id: string, file: File) {
    const form = new FormData();
    form.append('image', file);
    const res = await apiClient.post(`/care-tasks/${id}/character-image`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  }
  async removeCharacterImage(id: string) {
    const res = await apiClient.delete(`/care-tasks/${id}/character-image`);
    return res.data;
  }
}

export const careTaskApi = new CareTaskApi();
