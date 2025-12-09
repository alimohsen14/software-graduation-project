import axios from 'axios';
import type { UserProfile } from '../pages/ProfilePage';

const API_URL = 'http://localhost:3000/auth';

function getAuthToken() {
  return localStorage.getItem('accessToken');
}

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  if (!config.headers) config.headers = {};

  const token = getAuthToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('accessToken');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export const profileService = {
  async getProfile(): Promise<UserProfile> {
    const res = await api.get<{ user: UserProfile }>('/profile');
    return res.data.user;
  },

  async updateProfile(data: Partial<UserProfile>): Promise<UserProfile> {
    const res = await api.patch<{ user: UserProfile }>('/profile/update', data);
    return res.data.user;
  },

  async changePassword(currentPassword: string, newPassword: string) {
    const res = await api.patch<{ message: string }>(
      '/profile/password',
      { currentPassword, newPassword }
    );
    return res.data.message;
  },

  logout() {
    localStorage.removeItem('accessToken');
    window.location.href = '/';
  }
};
