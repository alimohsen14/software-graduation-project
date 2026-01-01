// @ts-ignore
import client from "../api/client";

// ===== Types =====
export type SellerStore = {
  id: number;
  name: string;
  description?: string;
  logo?: string | null;
  type: "SELLER" | "ADMIN";
  isApproved: boolean;
  createdAt: string;
};

export type User = {
  id: number;
  name: string;
  email: string;
  country?: string | null;
  age?: number | null;
  gender?: "MALE" | "FEMALE";
  isAdmin?: boolean;
  provider?: string;
  createdAt?: string;
  updatedAt?: string;
  store?: SellerStore;
  sellerRequest?: {
    id: number;
    status: "PENDING" | "REJECTED" | "APPROVED";
  };
};

export type AuthEnvelope = {
  message: string;
  user: User;
};

export type ProfileEnvelope = {
  message: string;
  user: User;
};

export type ForgotPasswordEnvelope = {
  message: string;
  resetToken?: string;
};

export type ResetPasswordEnvelope = {
  message: string;
};

export const signup = async (data: {
  name: string;
  email: string;
  password: string;
  country?: string;
  age?: number;
  gender: "MALE" | "FEMALE";
  isSeller?: boolean;
}) => {
  return client.post<AuthEnvelope>("/auth/signup", data);
};

export const login = async (data: { email: string; password: string }) => {
  return client.post<AuthEnvelope>("/auth/login", data);
};

export const logout = async () => {
  return client.post("/auth/logout");
};

export const completeGoogleSignup = async (data: {
  name: string;
  email: string;
  country: string;
  age: number;
  gender: "MALE" | "FEMALE";
  token: string;
}) => {
  return client.post<AuthEnvelope>("/auth/complete-google-signup", data);
};

export const getMe = async () => {
  return client.get<ProfileEnvelope>("/auth/me");
};

// Kept if some components still use getProfile name, but pointing to /auth/me
export const getProfile = async () => {
  return getMe();
};

export const forgotPassword = async (email: string) => {
  return client.post<ForgotPasswordEnvelope>("/auth/forgot-password", {
    email,
  });
};

export const resetPassword = async (token: string, newPassword: string) => {
  return client.post<ResetPasswordEnvelope>("/auth/reset-password", {
    token,
    newPassword,
  });
};

