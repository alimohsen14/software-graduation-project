import client from "../api/client";

// ================= TYPES =================
export type UpgradeRequest = {
    id: number;
    user: {
        id: number;
        name: string;
        email: string;
    };
    storeName: string;
    productType?: string;
    region?: string;
    description: string;
    status: "PENDING" | "APPROVED" | "REJECTED";
    createdAt: string;
};

// ================= API =================

export const getSellerRequests = async (): Promise<UpgradeRequest[]> => {
    const res = await client.get<UpgradeRequest[]>("/seller-requests");
    return res.data;
};

export const approveSellerRequest = async (requestId: number): Promise<void> => {
    await client.post(`/seller-requests/${requestId}/approve`);
};

export const rejectSellerRequest = async (requestId: number, reason: string): Promise<void> => {
    await client.post(`/seller-requests/${requestId}/reject`, { reason });
};
