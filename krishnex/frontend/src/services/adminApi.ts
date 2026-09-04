import { api } from './api';
import type { Crop, Mandi, UserRole } from '../types';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string | null;
  createdAt: string;
}

export interface AuditRecord { id: string; action: string; entity: string; entityId?: string | null; metadata?: string | null; createdAt: string; user?: { name: string; email: string } | null; }
export interface SystemSetting { id: string; key: string; value: string; updatedAt: string; }

export const adminApi = {
  getUsers: async () => (await api.get<{ data: AdminUser[] }>('/admin/users')).data.data,
  updateUserRole: async (id: string, role: UserRole) => (await api.patch<{ data: { id: string; role: UserRole } }>(`/admin/users/${id}`, { role })).data.data,
  getMandis: async () => (await api.get<{ data: Mandi[] }>('/admin/mandis')).data.data,
  getCrops: async () => (await api.get<{ data: Crop[] }>('/admin/crops')).data.data,
  getAuditLogs: async () => (await api.get<{ data: AuditRecord[] }>('/admin/audit-logs')).data.data,
  getSettings: async () => (await api.get<{ data: SystemSetting[] }>('/admin/settings')).data.data,
  updateSetting: async (key: string, value: string) => (await api.put<{ data: SystemSetting }>(`/admin/settings/${encodeURIComponent(key)}`, { value })).data.data,
};