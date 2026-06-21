import { api } from './api';

export const userService = {
  async updateProfile(payload) {
    const { data } = await api.put('/users/profile', payload);
    return data.user;
  },
  async changePassword(payload) {
    const { data } = await api.put('/users/password', payload);
    return data;
  }
};

