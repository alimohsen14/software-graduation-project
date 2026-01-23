// @ts-ignore
import api, { publicApi } from "../lib/api";

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
  isSeller?: boolean;
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
  return api.post<AuthEnvelope>("/auth/signup", data);
};

export const login = async (data: { email: string; password: string }) => {
  return api.post<AuthEnvelope>("/auth/login", data);
};

export const logout = async () => {
  return api.post("/auth/logout");
};

export const completeGoogleSignup = async (data: {
  name: string;
  email: string;
  country: string;
  age: number;
  gender: "MALE" | "FEMALE";
  token: string;
}) => {
  return api.post<AuthEnvelope>("/auth/complete-google-signup", data);
};

export const getMe = async () => {
  return api.get<ProfileEnvelope>("/auth/me");
};

// Kept if some components still use getProfile name, but pointing to /auth/me
export const getProfile = async () => {
  return getMe();
};

export const forgotPassword = async (email: string) => {
  return api.post<ForgotPasswordEnvelope>("/auth/forgot-password", {
    email,
  });
};

export const resetPassword = async (token: string, newPassword: string) => {
  return api.post<ResetPasswordEnvelope>("/auth/reset-password", {
    token,
    newPassword,
  });
};

export const updatePushToken = async (token: string, platform: "web" | "android" | "ios" = "web") => {
  return api.post("/users/push-token", { token, platform });
};

