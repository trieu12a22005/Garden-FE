import { type CreateNotificationPayload, type Notification } from '@/types/notification';
import notificationApi from '@/apis/notification';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

const QUERY_KEY = ['notifications'];
export const useNotifications = () => {
    const query = useQuery({
        queryKey: QUERY_KEY,
        queryFn: async () => {
            const res = await notificationApi.getAll();
            return res.notifications as Notification[];
        },
    });

    return {
        notifications: query.data ?? [],
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error,
        unreadCount: (query.data ?? []).filter((n) => !n.isRead).length,
    };
};
export const useCreateNotification = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateNotificationPayload) => notificationApi.create(data),
        onSuccess: () => {
            toast.success('Tạo thông báo thành công');
            queryClient.invalidateQueries({ queryKey: QUERY_KEY });
        },
        onError: (error: Error) => {
            toast.error(error?.message || 'Tạo thông báo thất bại');
        },
    });
};
export const useMarkNotificationRead = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => notificationApi.markRead(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEY });
        },
        onError: (error: Error) => {
            toast.error(error?.message || 'Không thể đánh dấu thông báo');
        },
    });
};
export const useMarkAllNotificationsRead = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => notificationApi.markAllRead(),
        onSuccess: () => {
            toast.success('Đã đánh dấu tất cả thông báo là đã đọc');
            queryClient.invalidateQueries({ queryKey: QUERY_KEY });
        },
        onError: (error: Error) => {
            toast.error(error?.message || 'Không thể cập nhật thông báo');
        },
    });
};
export const useDeleteNotification = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => notificationApi.delete(id),
        onSuccess: () => {
            toast.success('Đã xóa thông báo');
            queryClient.invalidateQueries({ queryKey: QUERY_KEY });
        },
        onError: (error: Error) => {
            toast.error(error?.message || 'Không thể xóa thông báo');
        },
    });
};

export const useUpdateNotification = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: CreateNotificationPayload }) =>
            notificationApi.update(id, data),
        onSuccess: () => {
            toast.success('Cập nhật thông báo thành công');
            queryClient.invalidateQueries({ queryKey: QUERY_KEY });
        },
        onError: (error: Error) => {
            toast.error(error?.message || 'Cập nhật thông báo thất bại');
        },
    });
};

