import api from "../lib/api";
import { SellerProduct, SellerOrder, UpdateStorePayload } from "./seller.service";

export interface UpgradeRequest {
    id: number;
    userId: string;
    storeName: string;
    productType: string;
    region: string;
    description: string;
    status: "PENDING" | "APPROVED" | "REJECTED";
    createdAt: string;
    user: {
        name: string;
        email: string;
    };
}

export interface GlobalAnalytics {
    totalUsers: number;
    sellersCount: number;
    regularUsersCount: number;
    sellerRatio: number;
    usersByCountry: { country: string; count: number }[];
    usersByAgeRange: { range: string; count: number }[];
}

export interface AnalyticsUser {
    id: string;
    name: string;
    email: string;
    country: string;
    age: number;
    role: string;
    createdAt: string;
}

export interface UsersListResponse {
    data: AnalyticsUser[];
    meta: {
        total: number;
        page: number;
        limit: number;
    };
}

// ================= API =================

/**
 * ADMIN counterparts to Seller services.
 * Names and response shapes match seller.service.ts for easy reuse.
 */

export const getStore = async (): Promise<any> => {
    const res = await api.get("/admin/store");
    return res.data;
};

export const updateStoreDetails = async (data: UpdateStorePayload): Promise<any> => {
    const res = await api.patch("/admin/store", data);
    return res.data;
};

export const uploadStoreLogo = async (formData: FormData): Promise<{ logo: string }> => {
    const res = await api.post<{ logo: string }>(
        "/admin/store/logo",
        formData,
        {
            headers: {
                "Content-Type": undefined
            }
        }
    );
    return res.data;
};

export const getProducts = async (): Promise<SellerProduct[]> => {
    const res = await api.get<SellerProduct[]>("/admin/store/products");
    return res.data;
};

export const createProduct = async (data: any): Promise<SellerProduct> => {
    const res = await api.post<SellerProduct>("/admin/store/products", data);
    return res.data;
};

export const updateProduct = async (productId: number, data: any): Promise<SellerProduct> => {
    const res = await api.patch<SellerProduct>(`/admin/store/products/${productId}`, data);
    return res.data;
};

export const deleteProduct = async (productId: number): Promise<void> => {
    await api.delete(`/admin/store/products/${productId}`);
};

export const getOrders = async (): Promise<{ totalOrders: number; orders: SellerOrder[] }> => {
    const res = await api.get<{ orders: SellerOrder[] }>("/admin/store/orders");
    // Ensure response shape matches { totalOrders, orders }
    return {
        totalOrders: res.data.orders.length,
        orders: res.data.orders
    };
};

export const approveOrderItem = async (itemId: number): Promise<void> => {
    await api.patch(`/admin/store/orders/items/${itemId}/approve`, {});
};

export const rejectOrderItem = async (itemId: number, reason: string): Promise<void> => {
    await api.patch(`/admin/store/orders/items/${itemId}/reject`, { reason });
};

export const getStockAlerts = async (): Promise<SellerProduct[]> => {
    const res = await api.get<SellerProduct[]>("/admin/store/products/stock-alerts");
    return res.data;
};

export const importProductsFromExcel = async (formData: FormData): Promise<{ count: number; message: string }> => {
    const res = await api.post<{ count: number; message: string }>(
        "/admin/store/products/import",
        formData,
        {
            headers: {
                "Content-Type": undefined
            }
        }
    );
    return res.data;
};

// ================= ORIGINAL ADMIN FUNCTIONS =================

export const getSellerRequests = async (): Promise<UpgradeRequest[]> => {
    const res = await api.get<UpgradeRequest[]>("/seller-requests");
    return res.data;
};

export const approveSellerRequest = async (requestId: number) => {
    await api.post(`/seller-requests/${requestId}/approve`);
};

export const rejectSellerRequest = async (requestId: number, reason: string) => {
    await api.post(`/seller-requests/${requestId}/reject`, { reason });
};

// ================= ANALYTICS FUNCTIONS =================

export const getAnalyticsGlobal = async (): Promise<GlobalAnalytics> => {
    const res = await api.get<GlobalAnalytics>("/admin/analytics/users");
    return res.data;
};

export const getAnalyticsUsersList = async (params: {
    page?: number;
    limit?: number;
    role?: string;
    country?: string;
    search?: string;
}): Promise<UsersListResponse> => {
    const res = await api.get<UsersListResponse>("/admin/analytics/users/list", { params });
    return res.data;
};
