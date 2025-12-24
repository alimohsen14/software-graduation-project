import axios from "axios";

const API_URL = "http://localhost:3000/stores";

// ================= TYPES =================
export type Store = {
    id: number;
    name: string;
    description?: string;
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
const authHeaders = (token: string) => ({
    headers: {
        Authorization: `Bearer ${token}`,
    },
});

export const getStoreById = async (storeId: number): Promise<Store> => {
    const res = await axios.get<Store>(`${API_URL}/${storeId}`);
    return res.data;
};

export const getStoreProducts = async (
    storeId: number
): Promise<StoreProduct[]> => {
    const res = await axios.get<StoreProduct[]>(`${API_URL}/${storeId}/products`);
    return res.data;
};

export const getAllStores = async (): Promise<Store[]> => {
    const res = await axios.get<Store[]>(API_URL);
    return res.data;
};
