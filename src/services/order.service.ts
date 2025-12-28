import client from "../api/client";

const API_URL = "/orders";

// ================= TYPES =================
export type OrderItemPayload = {
  productId: number;
  quantity: number;
  price: number;
};

export type CreateOrderPayload = {
  city: string;
  address: string;
  phone: string;
  total: number;
  items: OrderItemPayload[];
};

export type AdminStatus = "ADMIN_PENDING" | "ADMIN_APPROVED" | "ADMIN_REJECTED";

export type OrderResponse = {
  id: number;
  total: number;
  status: "PENDING" | "PAID" | "CANCELED" | "SHIPPED";
  adminStatus: AdminStatus;
  rejectionReason?: string;
  city: string;
  address: string;
  phone: string;
  user: {
    name: string;
    email: string;
  };
  items: {
    quantity: number;
    product: {
      name: string;
    };
  }[];
};

// ================= ADMIN =================
export const getAllOrders = async (): Promise<OrderResponse[]> => {
  const res = await client.get<OrderResponse[]>(API_URL);
  return res.data;
};

export const approveOrder = async (
  orderId: number
): Promise<OrderResponse> => {
  const res = await client.post<OrderResponse>(
    `${API_URL}/${orderId}/approve`,
    {}
  );
  return res.data;
};

export const rejectOrder = async (
  orderId: number,
  rejectionReason: string
): Promise<OrderResponse> => {
  const res = await client.post<OrderResponse>(
    `${API_URL}/${orderId}/reject`,
    { rejectionReason }
  );
  return res.data;
};

// ================= USER =================
export const createOrder = async (
  payload: CreateOrderPayload
) => {
  return client.post(API_URL, payload);
};

export const getMyOrders = async (): Promise<OrderResponse[]> => {
  const res = await client.get<OrderResponse[]>(`${API_URL}/my`);
  return res.data;
};

export const getOrderById = async (
  orderId: number
): Promise<OrderResponse> => {
  const res = await client.get<OrderResponse>(`${API_URL}/${orderId}`);
  return res.data;
};

