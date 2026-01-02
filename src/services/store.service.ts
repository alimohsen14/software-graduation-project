import client, { publicClient } from "../api/client";

// ================= TYPES =================
export type Store = {
    id: number;
    name: string;
    description?: string;
    logo?: string | null;
    isOfficial: boolean;
    ownerId: number;
    ownerName?: string;
    productCount?: number;
    createdAt: string;
};

export type StoreProduct = {
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
    isActive: boolean;
    createdAt: string;
};

// ================= API =================
/**
 * Publicly accessible store details
 * Endpoint: GET /stores/:id
 */
export const getPublicStoreById = async (storeId: number): Promise<Store> => {
    const res = await publicClient.get<Store>(`/stores/${storeId}`);
    return res.data;
};

export const getStoreById = async (storeId: number): Promise<Store> => {
    const res = await client.get<Store>(`/store/${storeId}`);
    return res.data;
};

/**
 * Public store products with optional filtering
 * Endpoint: GET /marketplace/products?storeId=:id
 */
export const getStoreProducts = async (
    storeId: number,
    filters?: { category?: string; minPrice?: number; maxPrice?: number }
): Promise<StoreProduct[]> => {
    const res = await publicClient.get<StoreProduct[]>(`/marketplace/products`, {
        params: { ...filters, storeId }
    });
    return res.data;
};

export const getAllStores = async (): Promise<Store[]> => {
    const res = await client.get<Store[]>("/store");
    return res.data;
};

// Social Features
export type StoreSocialStatus = {
    isFollowed: boolean;
    isFavorited: boolean;
};

/**
 * Get social status (follow/favorite) for a store
 * Endpoint: GET /stores/:id/social-status
 * Auth required
 */
export const getStoreSocialStatus = async (storeId: number): Promise<StoreSocialStatus> => {
    const res = await client.get<StoreSocialStatus>(`/stores/${storeId}/social-status`);
    return res.data;
};

export const followStore = async (storeId: number): Promise<void> => {
    await client.post(`/stores/${storeId}/follow`);
};

export const unfollowStore = async (storeId: number): Promise<void> => {
    await client.delete(`/stores/${storeId}/follow`);
};

export const favoriteStore = async (storeId: number): Promise<void> => {
    await client.post(`/stores/${storeId}/favorite`);
};

export const unfavoriteStore = async (storeId: number): Promise<void> => {
    await client.delete(`/stores/${storeId}/favorite`);
};

export const getFollowedStores = async (): Promise<Store[]> => {
    const res = await client.get<{ stores: Store[] }>("/me/followed-stores");
    return res.data.stores;
};

export const getFavoriteStores = async (): Promise<Store[]> => {
    const res = await client.get<{ stores: Store[] }>("/me/favorite-stores");
    return res.data.stores;
};
