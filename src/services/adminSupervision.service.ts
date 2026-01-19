import api from "../lib/api";

export interface StoreAdminMetrics {
    revenue: number;
    salesCount: number;
    averageOrderValue: number;
}

export interface StoreAdminListItem {
    id: number;
    name: string;
    sellerName: string;
    sellerEmail: string;
    isActive: boolean;
    category: string;
    revenue: number;
    salesCount: number;
    averageOrderValue: number;
    createdAt: string;
}

export interface StoreAdminDetails extends StoreAdminListItem {
    description: string;
    logo?: string;
    deactivationReason?: string;
    recentProducts: any[];
    recentOrders: any[];
}

export interface StoresListResponse {
    stores: StoreAdminListItem[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export const getStoresList = async (page: number = 1, limit: number = 10, status: string = "all"): Promise<StoresListResponse> => {
    const res = await api.get<StoresListResponse>("/admin/stores", {
        params: { page, limit, status },
    });

    return {
        stores: (res.data?.stores ?? []).map(s => ({
            ...s,
            revenue: s.revenue ?? 0,
            salesCount: s.salesCount ?? 0,
            averageOrderValue: s.averageOrderValue ?? 0,
            createdAt: s.createdAt ?? "-",
        })),
        total: res.data?.total ?? 0,
        page: res.data?.page ?? 1,
        limit: res.data?.limit ?? 10,
        totalPages: res.data?.totalPages ?? 1,
    };
};

export const getStoreById = async (id: number): Promise<StoreAdminDetails> => {
    const res = await api.get<StoreAdminDetails>(`/admin/stores/${id}`);
    const data = res.data;

    return {
        ...data,
        revenue: data?.revenue ?? 0,
        salesCount: data?.salesCount ?? 0,
        averageOrderValue: data?.averageOrderValue ?? 0,
        recentProducts: data?.recentProducts ?? [],
        recentOrders: data?.recentOrders ?? [],
        isActive: !!data?.isActive,
    };
};

export const deactivateStore = async (id: number, reason: string): Promise<void> => {
    await api.patch(`/admin/stores/${id}/deactivate`, { reason });
};
