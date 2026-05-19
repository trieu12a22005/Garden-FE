import { apiClient } from './axios';
import type { CreateNotificationPayload, Notification } from '@/types/notification';

class NotificationApi {
    async getAll(): Promise<{ notifications: Notification[] }> {
        const response = await apiClient.get('/notification');
        return response.data;
    }
    async getById(id: string): Promise<{ notification: Notification }> {
        const response = await apiClient.get(`/notification/${id}`);
        return response.data;
    }
    async create(data: CreateNotificationPayload): Promise<{ message: string; notification: Notification }> {
        const response = await apiClient.post('/notification', data);
        return response.data;
    }
    async markRead(id: string): Promise<{ message: string; notification: Notification }> {
        const response = await apiClient.patch(`/notification/${id}/read`);
        return response.data;
    }
    async markAllRead(): Promise<{ message: string }> {
        const response = await apiClient.patch('/notification/read-all');
        return response.data;
    }
    async update(id: string, data: CreateNotificationPayload): Promise<{ message: string; notification: Notification }> {
        const response = await apiClient.put(`/notification/${id}`, data);
        return response.data;
    }
    async delete(id: string): Promise<{ message: string }> {
        const response = await apiClient.delete(`/notification/${id}`);
        return response.data;
    }
}
const notificationApi = new NotificationApi();
export default notificationApi;
