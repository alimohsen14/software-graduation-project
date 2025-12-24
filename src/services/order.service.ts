import axios from "axios";

const API_URL = "http://localhost:3000/orders";

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
export const getAllOrders = async (token: string): Promise<OrderResponse[]> => {
  const res = await axios.get<OrderResponse[]>(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

export const approveOrder = async (
  token: string,
  orderId: number
): Promise<OrderResponse> => {
  const res = await axios.post<OrderResponse>(
    `${API_URL}/${orderId}/approve`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};

export const rejectOrder = async (
  token: string,
  orderId: number,
  rejectionReason: string
): Promise<OrderResponse> => {
  const res = await axios.post<OrderResponse>(
    `${API_URL}/${orderId}/reject`,
    { rejectionReason },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};

// ================= USER =================
export const createOrder = async (
  payload: CreateOrderPayload,
  token: string
) => {
  return axios.post(API_URL, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getMyOrders = async (token: string): Promise<OrderResponse[]> => {
  const res = await axios.get<OrderResponse[]>(`${API_URL}/my`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const getOrderById = async (
  token: string,
  orderId: number
): Promise<OrderResponse> => {
  const res = await axios.get<OrderResponse>(`${API_URL}/${orderId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

