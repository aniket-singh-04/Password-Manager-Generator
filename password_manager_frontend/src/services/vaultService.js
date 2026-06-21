import { api } from './api';

export const vaultService = {
  async list(search = '') {
    const { data } = await api.get('/vault', { params: search ? { search } : {} });
    return data.entries;
  },
  async stats() {
    const { data } = await api.get('/vault/stats');
    return data;
  },
  async create(payload) {
    const { data } = await api.post('/vault', payload);
    return data.entry;
  },
  async update(id, payload) {
    const { data } = await api.put(`/vault/${id}`, payload);
    return data.entry;
  },
  async remove(id) {
    await api.delete(`/vault/${id}`);
  }
};

