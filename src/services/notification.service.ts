import axios from "axios";

const API_URL = "http://localhost:3000/notifications";

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
const authHeaders = (token: string) => ({
    headers: {
        Authorization: `Bearer ${token}`,
    },
});

export const getNotifications = async (token: string): Promise<Notification[]> => {
    const res = await axios.get<Notification[]>(API_URL, authHeaders(token));
    return res.data;
};

export const getUnreadCount = async (token: string): Promise<number> => {
    const res = await axios.get<UnreadCountResponse>(
        `${API_URL}/unread`,
        authHeaders(token)
    );
    return res.data.count;
};

export const markAsRead = async (
    token: string,
    notificationId: number
): Promise<Notification> => {
    const res = await axios.patch<Notification>(
        `${API_URL}/${notificationId}/read`,
        {},
        authHeaders(token)
    );
    return res.data;
};

export const markAllAsRead = async (token: string): Promise<void> => {
    await axios.patch(`${API_URL}/read-all`, {}, authHeaders(token));
};
