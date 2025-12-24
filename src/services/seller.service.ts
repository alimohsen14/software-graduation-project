import axios from "axios";

const API_URL = "http://localhost:3000/seller";

// ================= TYPES =================
export type SellerApplication = {
    storeName: string;
    whatToSell: string;
    description: string;
};

export type SellerStore = {
    id: number;
    name: string;
    description?: string;
    isApproved: boolean;
    createdAt: string;
};

export type SellerProduct = {
    id: number;
    name: string;
    shortDescription?: string;
    description?: string;
    price: number;
    image: string;
    stock: number;
    category?: string;
    createdAt: string;
};

export type CreateProductPayload = {
    name: string;
    shortDescription?: string;
    description?: string;
    price: number;
    image: string;
    stock: number;
    category?: string;
};

// ================= API =================
const authHeaders = (token: string) => ({
    headers: {
        Authorization: `Bearer ${token}`,
    },
});

export const applyToBeSeller = async (
    token: string,
    application: SellerApplication
): Promise<SellerStore> => {
    const res = await axios.post<SellerStore>(
        `${API_URL}/apply`,
        application,
        authHeaders(token)
    );
    return res.data;
};

export const getMyStore = async (token: string): Promise<SellerStore | null> => {
    try {
        const res = await axios.get<SellerStore>(
            `${API_URL}/my-store`,
            authHeaders(token)
        );
        return res.data;
    } catch {
        return null;
    }
};

export const getMyProducts = async (
    token: string
): Promise<SellerProduct[]> => {
    const res = await axios.get<SellerProduct[]>(
        `${API_URL}/products`,
        authHeaders(token)
    );
    return res.data;
};

export const createProduct = async (
    token: string,
    product: CreateProductPayload
): Promise<SellerProduct> => {
    const res = await axios.post<SellerProduct>(
        `${API_URL}/products`,
        product,
        authHeaders(token)
    );
    return res.data;
};

export const updateProduct = async (
    token: string,
    productId: number,
    product: Partial<CreateProductPayload>
): Promise<SellerProduct> => {
    const res = await axios.patch<SellerProduct>(
        `${API_URL}/products/${productId}`,
        product,
        authHeaders(token)
    );
    return res.data;
};

export const deleteProduct = async (
    token: string,
    productId: number
): Promise<void> => {
    await axios.delete(`${API_URL}/products/${productId}`, authHeaders(token));
};

export const getMyOrders = async (token: string): Promise<any[]> => {
    const res = await axios.get<any[]>(
        `${API_URL}/orders`,
        authHeaders(token)
    );
    return res.data;
};
