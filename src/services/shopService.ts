import client from "../api/client";

// =========================
// Types
// =========================
// Types
// =========================

export type Product = {
  id: number;
  name: string;
  shortDescription?: string;
  fullDescription?: string;
  price: number;
  image: string;
  stock: number;
  category: string;
  badge?: string; // Keep for backward compat if needed, or remove? User said "Remove any outdated frontend logic". Let's keep it optional but prioritize badges array.
  badges?: string[];
  avgRating?: number;
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

export const createProduct = async (
  data: CreateProductPayload
): Promise<Product> => {
  const res = await client.post<Product>("/products", data);
  return res.data;
};

export const updateProduct = async (
  id: number,
  data: UpdateProductPayload
): Promise<Product> => {
  const res = await client.patch<Product>(
    `/products/${id}`,
    data
  );
  return res.data;
};

export const deleteProduct = async (
  id: number
): Promise<Product> => {
  const res = await client.delete<Product>(
    `/products/${id}`
  );
  return res.data;
};
