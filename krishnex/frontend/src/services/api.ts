import axios from 'axios';

export const accessTokenKey = 'krishnex_access_token';
export const refreshTokenKey = 'krishnex_refresh_token';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(accessTokenKey);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(undefined, (error: unknown) => {
  if (axios.isAxiosError(error)) {
    const serverMessage = error.response?.data?.error;
    if (typeof serverMessage === 'string') return Promise.reject(new Error(serverMessage));
    if (!error.response) return Promise.reject(new Error('Unable to reach KrishNex API. Start the backend and try again.'));
  }
  return Promise.reject(error);
});

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'FARMER' | 'MANDI_OPERATOR' | 'GOVERNMENT_ADMIN' | 'SUPER_ADMIN';
  phone?: string;
}

interface AuthResponse {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
}

export const authApi = {
  async login(email: string, password: string): Promise<AuthResponse> {
    const { data } = await api.post<{ data: AuthResponse }>('/auth/login', { email, password });
    return data.data;
  },
  async register(name: string, email: string, password: string, phone: string): Promise<AuthResponse> {
    const { data } = await api.post<{ data: AuthResponse }>('/auth/register', { name, email, password, phone });
    return data.data;
  },
  async me(): Promise<AuthUser> {
    const { data } = await api.get<{ data: AuthUser }>('/auth/me');
    return data.data;
  },
  async refresh(refreshToken: string): Promise<Pick<AuthResponse, 'accessToken' | 'refreshToken'>> {
    const { data } = await api.post<{ data: Pick<AuthResponse, 'accessToken' | 'refreshToken'> }>('/auth/refresh', { refreshToken });
    return data.data;
  },
  async logout(refreshToken: string | null): Promise<void> {
    await api.post('/auth/logout', refreshToken ? { refreshToken } : {});
  },
};