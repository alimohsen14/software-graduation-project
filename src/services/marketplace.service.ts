import { publicApi } from "../lib/api";

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
    name?: string;
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
    // Normalize parameters
    const params: any = { ...filters };
    if (params.category === "ALL") {
        delete params.category;
    }

    // Map 'name' to 'search' query param as expected by backend
    if (params.name) {
        params.search = params.name;
    }

    const res = await publicApi.get<any>(
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
    const res = await publicApi.get<string[]>("/marketplace/categories");
    return res.data;
};
