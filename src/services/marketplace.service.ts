import { publicClient } from "../api/client";

// ================= TYPES =================

export enum ProductCategory {
    PALESTINIAN_FOOD = "PALESTINIAN_FOOD",
    PALESTINIAN_LIFESTYLE = "PALESTINIAN_LIFESTYLE",
    HANDMADE = "HANDMADE",
    PALESTINIAN_HERITAGE = "PALESTINIAN_HERITAGE",
}

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
    category?: ProductCategory | string;
    badge?: string;
    badges?: string[];
    store: StoreInfo;
    avgRating?: number;
    reviewsCount?: number;
    isActive: boolean;
    createdAt: string;
};

export type MarketplaceFilters = {
    category?: ProductCategory | "ALL";
    minPrice?: number;
    maxPrice?: number;
    storeId?: number;
    page?: number;
    limit?: number;
};

export type MarketplaceResponse = {
    products: MarketplaceProduct[];
    totalPages: number;
    totalProducts: number;
    currentPage: number;
};

// ================= API =================

export const getMarketplaceProducts = async (
    filters?: MarketplaceFilters
): Promise<MarketplaceResponse> => {
    // Normalize category: If "ALL", don't send it to backend
    const params = { ...filters };
    if (params.category === "ALL") {
        delete params.category;
    }

    const res = await publicClient.get<any>(
        `/marketplace/products`, { params }
    );

    // If backend returns array directly, wrap it in the expected response structure
    if (Array.isArray(res.data)) {
        return {
            products: res.data,
            totalPages: 1,
            totalProducts: res.data.length,
            currentPage: 1
        };
    }

    return res.data;
};

export const getMarketplaceCategories = async (): Promise<string[]> => {
    const res = await publicClient.get<string[]>("/marketplace/categories");
    return res.data;
};
