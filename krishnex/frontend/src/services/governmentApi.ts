import { api } from './api';
import type { Mandi } from '../types';

export interface GovernmentMetrics {
  totalRegisteredFarmers: number;
  activeBookings: number;
  activeMandis: number;
  todayProcuredTons: number;
  todayDisbursed: number;
  paymentCount: number;
  pendingPayments: number;
}

export interface MandiLoad extends Mandi { queueAhead: number; utilizationPercent: number; }
export interface PaymentSummary { status: string; _count: { _all: number }; _sum: { amount: number | null }; }
export interface GovernmentAlert { mandiId: string; mandiName: string; severity: string; message: string; }

export const governmentApi = {
  getMetrics: async () => (await api.get<{ data: GovernmentMetrics }>('/dashboard/metrics')).data.data,
  getMandiLoad: async () => (await api.get<{ data: MandiLoad[] }>('/dashboard/mandi-load')).data.data,
  getTrends: async () => (await api.get<{ data: { date: string; tons: number }[] }>('/dashboard/procurement-trends')).data.data,
  getPaymentSummary: async () => (await api.get<{ data: PaymentSummary[] }>('/dashboard/payment-summary')).data.data,
  getAlerts: async () => (await api.get<{ data: GovernmentAlert[] }>('/dashboard/alerts')).data.data,
};