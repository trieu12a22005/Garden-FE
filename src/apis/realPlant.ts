import { apiClient } from './axios';
import type { RealPlant } from '../types';

class RealPlantApi {
  async getAll(params?: Record<string, string | number>) {
    const res = await apiClient.get('/real-plants', { params });
    return res.data;
  }
  async getOne(id: string): Promise<{ data: RealPlant }> {
    const res = await apiClient.get(`/real-plants/${id}`);
    return res.data;
  }
  async create(data: Partial<RealPlant>) {
    const res = await apiClient.post('/real-plants', data);
    return res.data;
  }
  async batchCreate(data: { flowerTypeId: string; gardenId: string; quantity: number; plantedAt?: string }) {
    const res = await apiClient.post('/real-plants/batch', data);
    return res.data;
  }
  async update(id: string, data: Partial<RealPlant>) {
    const res = await apiClient.put(`/real-plants/${id}`, data);
    return res.data;
  }
}

export const realPlantApi = new RealPlantApi();

