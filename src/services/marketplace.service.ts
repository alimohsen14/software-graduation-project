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
