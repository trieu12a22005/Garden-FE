import { apiClient } from './axios';
import type { Garden } from '../types';

export interface PlantTypeSummary {
  flowerType: {
    id: string;
    name: string;
    imageUrl: string | null;
    description: string | null;
    defaultDuration: number | null;
  };
  total: number;
  available: number;
  assigned: number;
}

class GardenApi {
  async getAll(params?: { page?: number; limit?: number; status?: string }) {
    const res = await apiClient.get('/gardens', { params });
    return res.data;
  }
  async getOne(id: string): Promise<{ data: Garden }> {
    const res = await apiClient.get(`/gardens/${id}`);
    return res.data;
  }
  async getPlantSummary(id: string): Promise<{ data: PlantTypeSummary[] }> {
    const res = await apiClient.get(`/gardens/${id}/plant-summary`);
    return res.data;
  }
  async create(data: Partial<Garden> & { farmerId?: string }) {
    const res = await apiClient.post('/gardens', data);
    return res.data;
  }
  async update(id: string, data: Partial<Garden>) {
    const res = await apiClient.put(`/gardens/${id}`, data);
    return res.data;
  }
  async approve(id: string) {
    const res = await apiClient.patch(`/gardens/${id}/approve`);
    return res.data;
  }
  async reject(id: string, reason?: string) {
    const res = await apiClient.patch(`/gardens/${id}/reject`, { reason });
    return res.data;
  }
  async remove(id: string) {
    const res = await apiClient.delete(`/gardens/${id}`);
    return res.data;
  }
}

export const gardenApi = new GardenApi();

