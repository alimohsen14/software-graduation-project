import api from "../lib/api";

const API_URL = "/notifications";

// ================= TYPES =================
export type NotificationType = "ORDER_CREATED" | "ORDER_APPROVED" | "ORDER_REJECTED";

export type Notification = {
    id: number;
    type: NotificationType;
    message: string;
    isRead: boolean;
    orderId?: number;
    createdAt: string;
};

export type UnreadCountResponse = {
    count: number;
};

// ================= API =================
export const getNotifications = async (): Promise<Notification[]> => {
    const res = await api.get<Notification[]>(API_URL);
    return res.data;
};

export const getUnreadCount = async (): Promise<number> => {
    const res = await api.get<UnreadCountResponse>(
        `${API_URL}/unread`
    );
    return res.data.count;
};

export const markAsRead = async (
    notificationId: number
): Promise<Notification> => {
    const res = await api.patch<Notification>(
        `${API_URL}/${notificationId}/read`,
        {}
    );
    return res.data;
};

export const markAllAsRead = async (): Promise<void> => {
    await api.patch(`${API_URL}/read-all`, {});
};
