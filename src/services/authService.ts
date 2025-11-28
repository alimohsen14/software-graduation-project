// @ts-ignore
import axios from "axios";

const API_URL = "http://localhost:3000/auth";

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
};

export type AuthEnvelope = {
  message: string;
  user: User;
  tokens: Tokens;
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
  return axios.post<AuthEnvelope>(`${API_URL}/signup`, data);
};

export const login = async (data: { email: string; password: string }) => {
  return axios.post<AuthEnvelope>(`${API_URL}/login`, data);
};

export const completeGoogleSignup = async (data: {
  name: string;
  email: string;
  country: string;
  age: number;
  gender: "MALE" | "FEMALE";
  token: string;
}) => {
  return axios.post<AuthEnvelope>(`${API_URL}/complete-google-signup`, data);
};

export const getProfile = async (accessToken?: string) => {
  const token = accessToken ?? localStorage.getItem("accessToken") ?? "";
  return axios.get<ProfileEnvelope>(`${API_URL}/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const forgotPassword = async (email: string) => {
  return axios.post<ForgotPasswordEnvelope>(`${API_URL}/forgot-password`, {
    email,
  });
};

export const resetPassword = async (token: string, newPassword: string) => {
  return axios.post<ResetPasswordEnvelope>(`${API_URL}/reset-password`, {
    token,
    newPassword,
  });
};

/* ✅ أضفنا هاد الجزء فقط بدون لمس أي كود فوق */
export const getToken = (): string | null => {
  return localStorage.getItem("accessToken");
};
