import { apiClient } from './axios';

export interface CommunityPost {
  id: string;
  content: string | null;
  imageUrl: string | null;
  visibility: 'PUBLIC' | 'ANONYMOUS';
  status: 'VISIBLE' | 'HIDDEN' | 'REPORTED';
  reportCount: number;
  createdAt: string;
  taskTitle: string | null;
  displayName?: string;
  avatarUrl?: string | null;
  user?: { fullName: string | null; email: string; avatarUrl: string | null };
  reactionCounts: Record<string, number>;
}

class CommunityApi {
  async getAllAdmin(params?: { page?: number; limit?: number; status?: string }): Promise<{ data: CommunityPost[]; pagination: any }> {
    const res = await apiClient.get('/community/admin/posts', { params });
    return res.data;
  }
  
  async hidePost(id: string) {
    const res = await apiClient.patch(`/community/posts/${id}/hide`);
    return res.data;
  }

  async deletePost(id: string) {
    const res = await apiClient.delete(`/community/posts/${id}`);
    return res.data;
  }
}

export const communityApi = new CommunityApi();
