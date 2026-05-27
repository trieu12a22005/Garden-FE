import { apiClient } from './axios';
import type { FlowerType } from '../types';

class FlowerTypeApi {
  async getAll(): Promise<{ data: FlowerType[] }> {
    const res = await apiClient.get('/flower-types');
    return res.data;
  }
  async getOne(id: string): Promise<{ data: FlowerType }> {
    const res = await apiClient.get(`/flower-types/${id}`);
    return res.data;
  }
  async create(data: Partial<FlowerType>) {
    const res = await apiClient.post('/flower-types', data);
    return res.data;
  }
  async update(id: string, data: Partial<FlowerType>) {
    const res = await apiClient.put(`/flower-types/${id}`, data);
    return res.data;
  }
  async remove(id: string) {
    const res = await apiClient.delete(`/flower-types/${id}`);
    return res.data;
  }
}

export const flowerTypeApi = new FlowerTypeApi();
