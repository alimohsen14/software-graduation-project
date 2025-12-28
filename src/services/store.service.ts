import client from "../api/client";

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
    badges?: {
        isSoldOut: boolean;
        isLowStock: boolean;
        isNew: boolean;
        isHot: boolean;
        isBestSeller: boolean;
    };
    createdAt: string;
};

// ================= API =================
export const getStoreById = async (storeId: number): Promise<Store> => {
    const res = await client.get<Store>(`/store/${storeId}`);
    return res.data;
};

export const getStoreProducts = async (
    storeId: number
): Promise<StoreProduct[]> => {
    const res = await client.get<StoreProduct[]>(`/store/${storeId}/products`);
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

export const getStoreSocialStatus = async (storeId: number): Promise<StoreSocialStatus> => {
    const res = await client.get<StoreSocialStatus>(`/store/${storeId}/social-status`);
    return res.data;
};

export const followStore = async (storeId: number): Promise<void> => {
    await client.post(`/store/${storeId}/follow`);
};

export const unfollowStore = async (storeId: number): Promise<void> => {
    await client.delete(`/store/${storeId}/follow`);
};

export const favoriteStore = async (storeId: number): Promise<void> => {
    await client.post(`/store/${storeId}/favorite`);
};

export const unfavoriteStore = async (storeId: number): Promise<void> => {
    await client.delete(`/store/${storeId}/favorite`);
};

export const getFollowedStores = async (): Promise<Store[]> => {
    const res = await client.get<{ stores: Store[] }>("/me/followed-stores");
    return res.data.stores;
};

export const getFavoriteStores = async (): Promise<Store[]> => {
    const res = await client.get<{ stores: Store[] }>("/me/favorite-stores");
    return res.data.stores;
};
