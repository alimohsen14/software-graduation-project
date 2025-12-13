import axios from "axios";

const API_URL = "http://localhost:3000/products";

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
  rating?: number;
  reviewsCount?: number;
  createdAt: string;
  updatedAt: string;
};

export const getAllProducts = async (): Promise<Product[]> => {
  const res = await axios.get<Product[]>(API_URL);
  return res.data;
};

export const getProductById = async (id: number): Promise<Product> => {
  const res = await axios.get<Product>(`${API_URL}/${id}`);
  return res.data;
};
