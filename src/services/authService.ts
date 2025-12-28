// @ts-ignore
import client from "../api/client";

// ===== Types =====
export type Tokens = {
  accessToken: string;
  refreshToken: string;
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
  store?: {
    id: number;
    name: string;
    logo?: string | null;
    type: "SELLER" | "ADMIN";
  };
  sellerRequest?: {
    id: number;
    status: "PENDING" | "REJECTED";
  };
};

export type AuthEnvelope = {
  message: string;
  user: User;
  tokens: Tokens;
};

export type ProfileEnvelope = {
  message: string;
  user: User;
  tokens?: Tokens; // Sometimes returned
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

export const getProfile = async (accessToken?: string) => {
  // Client handles token via interceptor, but if we need to pass a specific one:
  const config = accessToken
    ? { headers: { Authorization: `Bearer ${accessToken}` } }
    : {};
  return client.get<ProfileEnvelope>("/auth/profile", config);
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

/* ✅ أضفنا هاد الجزء فقط بدون لمس أي كود فوق */
export const getToken = (): string | null => {
  return localStorage.getItem("accessToken");
};

