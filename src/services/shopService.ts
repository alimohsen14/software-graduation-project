import client from "../api/client";

// =========================
// Types
// =========================
export type ProductBadges = {
  isSoldOut: boolean;
  isLowStock: boolean;
  isNew: boolean;
  isHot: boolean;
  isBestSeller: boolean;
};

export type Product = {
  id: number;
  name: string;
  shortDescription?: string;
  fullDescription?: string;
  price: number;
  image: string;
  stock: number;
  category: string;
  badge?: string;
  badges?: ProductBadges;
  rating?: number;
  reviewsCount?: number;
  store?: {
    id: number;
    name: string;
    logo?: string;
    isOfficial: boolean;
  };
  createdAt: string;
  updatedAt: string;
};

// Create payload (Admin)
export type CreateProductPayload = {
  name: string;
  shortDescription?: string;
  fullDescription?: string;
  price: number;
  image: string;
  stock: number;
  category: string;
  badge?: string;
};

// Update payload (Admin) => Partial
export type UpdateProductPayload = Partial<CreateProductPayload>;

// =========================
// Public (Shop)
// =========================
export const getAllProducts = async (): Promise<Product[]> => {
  const res = await client.get<Product[]>("/products");
  return res.data;
};

export const getProductById = async (id: number): Promise<Product> => {
  const res = await client.get<Product>(`/products/${id}`);
  return res.data;
};

// =========================
// Admin (CRUD)
// =========================
const authHeaders = (token: string) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export const createProduct = async (
  token: string,
  data: CreateProductPayload
): Promise<Product> => {
  const res = await client.post<Product>("/products", data, authHeaders(token));
  return res.data;
};

export const updateProduct = async (
  token: string,
  id: number,
  data: UpdateProductPayload
): Promise<Product> => {
  const res = await client.patch<Product>(
    `/products/${id}`,
    data,
    authHeaders(token)
  );
  return res.data;
};

export const deleteProduct = async (
  token: string,
  id: number
): Promise<Product> => {
  const res = await client.delete<Product>(
    `/products/${id}`,
    authHeaders(token)
  );
  return res.data;
};
