import client from "../api/client";

// ================= TYPES =================
export type StoreInfo = {
    id: number;
    name: string;
    logo?: string | null;
    isOfficial: boolean;
};

export type MarketplaceProduct = {
    id: number;
    name: string;
    shortDescription?: string;
    description?: string;
    price: number;
    image: string;
    stock: number;
    category?: string;
    badge?: string;
    badges?: {
        isSoldOut: boolean;
        isLowStock: boolean;
        isNew: boolean;
        isHot: boolean;
        isBestSeller: boolean;
    };
    store: StoreInfo;
    createdAt: string;
};

export type MarketplaceFilters = {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: "newest" | "price_asc" | "price_desc";
    storeId?: number;
};

// ================= API =================
const authHeaders = (token: string) => ({
    headers: {
        Authorization: `Bearer ${token}`,
    },
});

export const getMarketplaceProducts = async (
    filters?: MarketplaceFilters
): Promise<MarketplaceProduct[]> => {
    const params = new URLSearchParams();
    if (filters?.category) params.append("category", filters.category);
    if (filters?.minPrice) params.append("minPrice", String(filters.minPrice));
    if (filters?.maxPrice) params.append("maxPrice", String(filters.maxPrice));
    if (filters?.sortBy) params.append("sortBy", filters.sortBy);
    if (filters?.storeId) params.append("storeId", String(filters.storeId));

    const res = await client.get<MarketplaceProduct[]>(
        `/marketplace/products`, { params: filters }
    );
    return res.data;
};

export const getMarketplaceCategories = async (): Promise<string[]> => {
    const res = await client.get<string[]>("/marketplace/categories");
    return res.data;
};
