import { api } from './api';
import type { TokenBooking } from '../types';

export interface MandiToken {
  id: string;
  tokenNumber: string;
  status: TokenBooking['status'];
  booking: { farmer: { name: string; email: string }; crop: { key: string; name: string; msp: number; bonus: number }; mandi: { id: string; name: string }; quantityQuintals: number; slotTime: string; vehicleNo: string; arrivalDate: string };
  weighment?: { grossKg: number; tareKg: number; netKg: number } | null;
}

export const mandiApi = {
  verifyToken: async (tokenId: string) => (await api.post<{ data: MandiToken }>('/tokens/verify', { tokenId })).data.data,
  updateStatus: async (tokenId: string, status: TokenBooking['status']) => (await api.patch(`/tokens/${tokenId}/status`, { status })).data.data,
  recordWeighment: async (tokenId: string, grossKg: number, tareKg: number) => (await api.post('/weighments', { tokenId, grossKg, tareKg })).data.data,
  recordQuality: async (tokenId: string, moisturePercent: number, grade: 'GRADE_A' | 'GRADE_B' | 'REJECTED') => (await api.post('/quality-tests', { tokenId, moisturePercent, grade })).data.data,
  finalizeProcurement: async (tokenId: string, approved = true) => (await api.post('/procurements', { tokenId, approved })).data.data,
};