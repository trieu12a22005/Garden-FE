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
}

export const plantUpdateApi = new PlantUpdateApi();
