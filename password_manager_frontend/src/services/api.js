const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const buildUrl = (endpoint) => {
  if (!endpoint) return API_URL;
  return `${API_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
};

const defaultTimeout = 15000;

const request = async (method, endpoint, body = null, options = {}) => {
  const token = localStorage.getItem('vaultlock_token');

  const headers = {
    ...(body ? { 'Content-Type': 'application/json' } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), options.timeout || defaultTimeout);

  try {
    const response = await fetch(buildUrl(endpoint), {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
      ...options.fetchOptions,
    });

    clearTimeout(timeoutId);

    if (response.status === 401) {
      localStorage.removeItem('vaultlock_token');
      localStorage.removeItem('vaultlock_user');
    }

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const err = new Error('Request failed');
      err.status = response.status;
      err.data = data;
      throw err;
    }

    return { data, status: response.status };
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Request timeout');
    }
    throw error;
  }
};

export const api = {
  get: (endpoint, options) => request('GET', endpoint, null, options),
  post: (endpoint, body, options) => request('POST', endpoint, body, options),
  put: (endpoint, body, options) => request('PUT', endpoint, body, options),
  delete: (endpoint, body, options) => request('DELETE', endpoint, body, options),
};