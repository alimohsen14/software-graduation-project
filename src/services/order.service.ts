import client from "../api/client";

const API_URL = "/orders";

// ================= TYPES =================
export type OrderItemStatus = "PENDING_APPROVAL" | "APPROVED" | "REJECTED" | "SHIPPED" | "DELIVERED";

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

export type Payment = {
  id: number;
  amount: number;
  status: "SUCCESS" | "FAILED";
  createdAt: string;
};

export type Refund = {
  id: number;
  amount: number;
  reason: string;
  status: "PENDING" | "COMPLETED";
  createdAt: string;
};

export type OrderItemResponse = {
  id: number;
  productId: number;
  storeId: number;
  quantity: number;
  price: number;
  status: OrderItemStatus;
  product: {
    name: string;
    image: string;
  };
  store: {
    name: string;
  };
  refund?: Refund;
};

export type OrderResponse = {
  id: number;
  total: number;
  status: "PENDING" | "PAID" | "CANCELED" | "SHIPPED" | "COMPLETED";
  city: string;
  address: string;
  phone: string;
  createdAt: string;
  items: OrderItemResponse[];
  payments: Payment[];
  // Optional fields for Admin/Legacy compatibility
  user?: {
    name: string;
    email: string;
  };
  adminStatus?: "ADMIN_PENDING" | "ADMIN_APPROVED" | "ADMIN_REJECTED";
  rejectionReason?: string;
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
): Promise<OrderResponse> => {
  const res = await client.post<OrderResponse>(API_URL, payload);
  return res.data;
};

export const mockPayment = async (
  orderId: number
): Promise<OrderResponse> => {
  const res = await client.post<OrderResponse>(`/payments/mock`, { orderId });
  return res.data;
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

