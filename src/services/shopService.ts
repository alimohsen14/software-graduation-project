import api from "../lib/api";
import { ProductCategory } from "./marketplace.service";

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
  category: ProductCategory | string;
  badge?: string;
  badges?: string[];
  avgRating?: number;
  reviewsCount?: number;
  store?: {
    id: number;
    name: string;
    logo?: string;
    isOfficial: boolean;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ProductFilters = {
  category?: ProductCategory | "ALL";
  page?: number;
  limit?: number;
  search?: string;
};

export type ProductResponse = {
  products: Product[];
  totalPages: number;
  totalProducts: number;
  currentPage: number;
};

// Create payload (Admin)
export type CreateProductPayload = {
  name: string;
  shortDescription?: string;
  fullDescription?: string;
  price: number;
  image: string;
  stock: number;
  category: ProductCategory | string;
  badge?: string;
};

// Update payload (Admin) => Partial
export type UpdateProductPayload = Partial<CreateProductPayload>;

// =========================
// Public (Shop)
// =========================
export const getAllProducts = async (filters?: ProductFilters): Promise<ProductResponse> => {
  const params = { ...filters };
  if (params.category === "ALL") {
    delete params.category;
  }
  const res = await api.get<any>("/products", { params });

  // Handle case where backend returns array directly
  if (Array.isArray(res.data)) {
    return {
      products: res.data,
      totalPages: 1,
      totalProducts: res.data.length,
      currentPage: 1
    };
  }

  return res.data;
};

export const getProductById = async (id: number): Promise<Product> => {
  const res = await api.get<Product>(`/products/${id}`);
  return res.data;
};

// =========================
// Admin (CRUD)
// =========================

export const createProduct = async (
  data: CreateProductPayload
): Promise<Product> => {
  const res = await api.post<Product>("/products", data);
  return res.data;
};

export const updateProduct = async (
  id: number,
  data: UpdateProductPayload
): Promise<Product> => {
  const res = await api.patch<Product>(
    `/products/${id}`,
    data
  );
  return res.data;
};

export const deleteProduct = async (
  id: number
): Promise<Product> => {
  const res = await api.delete<Product>(
    `/products/${id}`
  );
  return res.data;
};
