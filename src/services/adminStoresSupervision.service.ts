import api from "../lib/api";

// --- Interfaces ---

// Use strictly what the backend returns for Overview
export interface SupervisionOverview {
    totalStores: number;
    activeStores: number;
    inactiveStores: number;
    topStore: {
        storeId: number;
        storeName: string;
        revenue: number;
        ordersCount: number;
    } | null;
}

// Use strictly what the list view needs (and what backend returns for list)
export interface StoreListItem {
    id: number;
    name: string;
    ownerName: string;
    ownerEmail: string;
    category: string; // The "Role"
    isActive: boolean;
    createdAt: string;
}

// Strict Contract for Store Details Page
export interface StrictStoreDetails {
    id: string;
    name: string;
    isActive: boolean;
    bestSeller: {
        productId: string;
        name: string;
        soldCount: number;
    } | null;
    monthlySales: {
        soldCount: number;
        revenue: number;
    };
    products: any[];
    orders: any[];
}

// Strict Backend Response Shape for /admin/supervision/stores
interface BackendStoresResponse {
    data: {
        id: number;
        name: string;
        isActive: boolean;
        category: string | null;
        owner: {
            name: string;
            email: string;
        };
        createdAt: string;
    }[];
    meta: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export interface SupervisionStoresResponse {
    stores: StoreListItem[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

// --- Service Functions ---

export const getOverview = async (): Promise<SupervisionOverview> => {
    try {
        const res = await api.get<SupervisionOverview>("/admin/supervision/overview");
        return {
            totalStores: res.data?.totalStores ?? 0,
            activeStores: res.data?.activeStores ?? 0,
            inactiveStores: res.data?.inactiveStores ?? 0,
            topStore: res.data?.topStore ?? null,
        };
    } catch (error) {
        console.error("Error fetching supervision overview:", error);
        return {
            totalStores: 0,
            activeStores: 0,
            inactiveStores: 0,
            topStore: null,
        };
    }
};

export const getStores = async (
    page: number = 1,
    limit: number = 10,
    status: string = "all",
    category: string = "",
    search: string = ""
): Promise<SupervisionStoresResponse> => {
    try {
        const res = await api.get<BackendStoresResponse>("/admin/supervision/stores", {
            params: { page, limit, status, category, search }
        });

        // Strict parsing of response.data.data and response.data.meta
        const rawStores = res.data?.data ?? [];
        const meta = res.data?.meta ?? { page: 1, limit: 10, total: 0, totalPages: 1 };

        const stores: StoreListItem[] = rawStores.map((s: BackendStoresResponse['data'][number]) => ({
            id: s.id,
            name: s.name ?? "Unknown Store",
            // Map nested owner fields
            ownerName: s.owner?.name ?? "-",
            ownerEmail: s.owner?.email ?? "-",
            // Use category as is (Role)
            category: s.category ?? "Uncategorized",
            isActive: !!s.isActive,
            createdAt: s.createdAt ?? "-",
        }));

        return {
            stores,
            total: meta.total,
            page: meta.page,
            limit: meta.limit,
            totalPages: meta.totalPages
        };
    } catch (error) {
        console.error("Error fetching stores list:", error);
        return { stores: [], total: 0, page: 1, limit: 10, totalPages: 1 };
    }
};

export async function getStoreDetails(
    id: string
): Promise<StrictStoreDetails> {
    const res = await api.get<any>(`/admin/supervision/stores/${id}`);

    console.log("STORE DETAILS RAW RESPONSE:", res.data);
    console.log("ORDERS FROM BACKEND:", res.data.orders);

    return {
        ...res.data,
        products: Array.isArray(res.data.products) ? res.data.products : [],
        orders: Array.isArray(res.data.orders) ? res.data.orders : [],
    };
}

// --- Store Actions ---

export const sendWarning = async (id: string, message: string): Promise<void> => {
    await api.post(`/admin/supervision/stores/${id}/warning`, { message });
};

export const deactivateStore = async (id: string | number, reason: string): Promise<void> => {
    // User requested POST for deactivate in this task scope
    await api.post(`/admin/supervision/stores/${id}/deactivate`, { reason });
};

export const activateStore = async (id: string | number): Promise<void> => {
    await api.post(`/admin/supervision/stores/${id}/activate`, {});
};
