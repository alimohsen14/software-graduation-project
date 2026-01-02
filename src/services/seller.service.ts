import client from "../api/client";
import { SellerStore } from "./authService";

// ================= TYPES =================
export type SellerApplication = {
    storeName: string;
    productType: string;
    region: string;
    description: string;
};

export type { SellerStore };

export type UpdateStorePayload = {
    name: string;
    description?: string;
    logo?: string;
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
    badge?: string;
    isActive: boolean;
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
    badge?: string;
};

export type OrderItemStatus = 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED' | 'SHIPPED' | 'DELIVERED';

export type SellerOrderItem = {
    id: number;
    productId: number;
    productName: string;
    productImage?: string;
    quantity: number;
    price: number;
    priceAtPurchase: number;
    status: OrderItemStatus;
    rejectReason?: string | null;
};

export type SellerOrder = {
    orderId: number;
    createdAt: string;
    orderStatus: string;
    // Delivery Details (Source of Truth)
    phone: string;
    city: string;
    address: string;
    customer: {
        name: string | null;
        phone: string | null;
        city: string | null;
        address: string | null;
    };
    items: SellerOrderItem[];
};

export type SellerNotification = {
    id: number;
    message: string;
    isRead: boolean;
    createdAt: string;
    orderId?: number;
};

// ================= API =================
// ================= API =================

export const applyToBeSeller = async (
    application: SellerApplication
): Promise<SellerStore> => {
    // Mapping frontend fields to what backend probably expects if different, 
    // OR assuming backend was updated to accept these.
    // User request said POST /seller-requests. 
    // Assuming keys: storeName, productType, region, description.
    const res = await client.post<SellerStore>(
        "/seller-requests",
        application
    );
    return res.data;
};

export const getMyStore = async (): Promise<SellerStore | null> => {
    try {
        const res = await client.get<SellerStore>(
            "/seller/store"
        );
        return res.data;
    } catch {
        return null;
    }
};

export const updateStoreDetails = async (
    data: UpdateStorePayload
): Promise<SellerStore> => {
    const res = await client.patch<SellerStore>(
        "/seller/store",
        data
    );
    return res.data;
};

export const uploadStoreLogo = async (
    formData: FormData
): Promise<{ logo: string }> => {
    // client interceptor handles Auth token
    // Axios automatically sets Content-Type: multipart/form-data with boundary
    const res = await client.post<{ logo: string }>(
        "/seller/store/logo",
        formData,
        {
            headers: {
                "Content-Type": undefined // Force Axios to let browser set multipart/form-data + boundary
            }
        }
    );
    return res.data;
};

export const getMyProducts = async (): Promise<SellerProduct[]> => {
    const res = await client.get<SellerProduct[]>(
        "/seller/products"
    );
    return res.data;
};

export const createProduct = async (
    product: CreateProductPayload
): Promise<SellerProduct> => {
    const res = await client.post<SellerProduct>(
        "/seller/products",
        product
    );
    return res.data;
};

export const updateProduct = async (
    productId: number,
    product: Partial<CreateProductPayload>
): Promise<SellerProduct> => {
    const res = await client.patch<SellerProduct>(
        `/seller/products/${productId}`,
        product
    );
    return res.data;
};

export const deleteProduct = async (
    productId: number
): Promise<void> => {
    await client.delete(`/seller/products/${productId}`);
};

// Orders
export const getMyOrders = async (): Promise<{ totalOrders: number; orders: SellerOrder[] }> => {
    const res = await client.get<{ totalOrders: number; orders: SellerOrder[] }>(
        "/seller/orders"
    );
    return res.data;
};

export const approveOrderItem = async (itemId: number): Promise<void> => {
    const id = Number(itemId);
    if (!id || isNaN(id)) {
        console.error("Invalid itemId for approval:", itemId);
        throw new Error("Invalid item ID");
    }

    await client.patch(
        `/seller/orders/items/${id}/approve`,
        {}
    );
};

export const rejectOrderItem = async (itemId: number, reason: string): Promise<void> => {
    const id = Number(itemId);
    if (!id || isNaN(id) || !reason.trim()) {
        console.error("Invalid data for rejection:", { itemId, reason });
        throw new Error("Invalid item ID or missing reason");
    }

    await client.patch(
        `/seller/orders/items/${id}/reject`,
        { reason: reason.trim() }
    );
};

export const getStockAlerts = async (): Promise<SellerProduct[]> => {
    const res = await client.get<SellerProduct[]>(
        "/seller/stock-alerts"
    );
    return res.data;
};

// Notifications
export const getNotifications = async (): Promise<SellerNotification[]> => {
    const res = await client.get<SellerNotification[]>(
        "/seller/notifications"
    );
    return res.data;
};

export const markNotificationRead = async (id: number): Promise<void> => {
    await client.patch(
        `/seller/notifications/${id}/read`,
        {}
    );
};

export const importProductsFromExcel = async (
    formData: FormData
): Promise<{ count: number; message: string }> => {
    const res = await client.post<{ count: number; message: string }>(
        "/seller/products/import",
        formData,
        {
            headers: {
                "Content-Type": undefined // Let browser handle it
            }
        }
    );
    return res.data;
};
