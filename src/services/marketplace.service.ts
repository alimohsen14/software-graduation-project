import { publicClient } from "../api/client";

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
    badges?: string[];
    store: StoreInfo;
    avgRating?: number;
    reviewsCount?: number;
    createdAt: string;
};

export type MarketplaceFilters = {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    storeId?: number;
};

// ================= API =================

export const getMarketplaceProducts = async (
    filters?: MarketplaceFilters
): Promise<MarketplaceProduct[]> => {
    const res = await publicClient.get<MarketplaceProduct[]>(
        `/marketplace/products`, { params: filters }
    );
    return res.data;
};

export const getMarketplaceCategories = async (): Promise<string[]> => {
    const res = await publicClient.get<string[]>("/marketplace/categories");
    return res.data;
};
