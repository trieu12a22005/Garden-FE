import { apiClient } from './axios';
import type { PlantUpdate } from '../types';

class PlantUpdateApi {
  async getByRealPlant(realPlantId: string): Promise<{ data: PlantUpdate[] }> {
    const res = await apiClient.get(`/plant-updates/${realPlantId}`);
    return res.data;
  }
  async create(data: {
    realPlantId: string;
    imageUrl: string;
    status: string;
    note?: string;
    healthNote?: string;
  }) {
    const res = await apiClient.post('/plant-updates', data);
    return res.data;
  }
  // ADMIN — lấy tất cả cập nhật (community feed)
  async getAll(params?: { gardenId?: string; page?: number; limit?: number }): Promise<{ data: PlantUpdate[] }> {
    const res = await apiClient.get('/plant-updates/all', { params });
    return res.data;
  }
  async delete(id: string) {
    const res = await apiClient.delete(`/plant-updates/${id}`);
    return res.data;
  }
}

export const plantUpdateApi = new PlantUpdateApi();
