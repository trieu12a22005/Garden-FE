export interface Notification {
    id: string;
    title: string;
    description?: string | null;
    link?: string | null;
    isRead: boolean;
    createdAt: string;
}

export interface CreateNotificationPayload {
    title: string;
    description?: string;
    link?: string;
}