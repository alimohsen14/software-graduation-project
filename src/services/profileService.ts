// @ts-ignore
import api from '../lib/api';
import { User } from './authService';

export const profileService = {
  async getProfile(): Promise<User> {
    const res = await api.get<{ user: User }>('/auth/profile');
    return res.data.user;
  },

  async updateProfile(data: Partial<User>): Promise<User> {
    // Assuming the backend endpoint is actually /auth/profile/update or similar, based on previous context.
    // The original file used '/profile/update' with baseURL '.../auth'. So full path was '/auth/profile/update'.
    const res = await api.patch<{ user: User }>('/auth/profile/update', data);
    return res.data.user;
  },

  async changePassword(oldPassword: string, newPassword: string) {
    const res = await api.patch<{ message: string }>(
      '/auth/profile/password',
      { oldPassword, newPassword }
    );
    return res.data.message;
  },

  logout() {
    window.location.href = '/';
  }
};
