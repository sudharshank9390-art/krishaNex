import { api } from './api';
import type { Crop, FarmerProfile, Mandi, TokenBooking } from '../types';

export interface HarvestRecord {
  id: string;
  quantityQuintals: number;
  expectedDate: string;
  crop: Crop;
  booking?: { token?: { tokenNumber: string; status: TokenBooking['status'] }; mandi: Mandi } | null;
}

export interface BookingRecord {
  id: string;
  harvestId: string;
  arrivalDate: string;
  slotTime: string;
  quantityQuintals: number;
  vehicleNo: string;
  crop: Crop;
  mandi: Mandi;
  token: { id: string; tokenNumber: string; status: TokenBooking['status'] };
  queueEntry?: { position: number } | null;
}

export interface PaymentRecord {
  id: string;
  amount: number;
  status: 'SCHEDULED' | 'PENDING' | 'PAID' | 'FAILED';
  reference?: string | null;
  createdAt: string;
  token: { tokenNumber: string; booking: { quantityQuintals: number; crop: Crop; mandi: Mandi } };
}

const unwrap = async <T>(request: Promise<{ data: { data: T } }>): Promise<T> => (await request).data.data;

export const farmerApi = {
  getProfile: () => unwrap<FarmerProfile | null>(api.get('/farmers/profile')),
  updateProfile: (profile: Partial<FarmerProfile>) => unwrap<FarmerProfile>(api.put('/farmers/profile', profile)),
  getMandis: () => unwrap<Mandi[]>(api.get('/farmers/mandis')),
  createHarvest: (input: { cropKey: string; quantityQuintals: number; expectedDate: string }) => unwrap<HarvestRecord>(api.post('/farmers/harvests', input)),
  getHarvests: () => unwrap<HarvestRecord[]>(api.get('/farmers/harvests')),
  createBooking: (input: { harvestId: string; mandiId: string; arrivalDate: string; slotTime: string; vehicleNo: string }) => unwrap<BookingRecord>(api.post('/farmers/bookings', input)),
  getBookings: () => unwrap<BookingRecord[]>(api.get('/farmers/bookings')),
  getToken: (id: string) => unwrap<Record<string, unknown>>(api.get(`/farmers/tokens/${id}`)),
  getPayments: () => unwrap<PaymentRecord[]>(api.get('/farmers/payments')),
};