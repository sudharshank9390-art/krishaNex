export type UserRole = 'FARMER' | 'MANDI_OPERATOR' | 'GOVERNMENT_ADMIN' | 'SUPER_ADMIN';

export type TokenStatus = 
  | 'GENERATED'
  | 'BOOKED'
  | 'ARRIVED'
  | 'WEIGHED'
  | 'QUALITY_CHECKED'
  | 'PROCURED'
  | 'PAYMENT_PENDING'
  | 'PAID'
  | 'CANCELLED';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  agriStackId?: string;
  mandiId?: string;
  avatar?: string;
}

export interface FarmerProfile {
  id: string;
  userId: string;
  fullName: string;
  aadhaarLast4: string;
  phone: string;
  landSizeAcres: number;
  village: string;
  district: string;
  state: string;
  bankName: string;
  accountLast4: string;
  ifsc: string;
}

export interface Mandi {
  id: string;
  name: string;
  code: string;
  district: string;
  state: string;
  capacityTons: number;
  currentOccupancyTons: number;
  waitMins: number;
  queueAhead: number;
  activeScales: number;
  status: 'OPERATIONAL' | 'HEAVY_QUEUE' | 'OPTIMAL' | 'CLOSED';
}

export interface Crop {
  id: string;
  key: string;
  name: string;
  msp: number;
  bonus: number;
  category: string;
}

export interface Weighment {
  grossWeightKg: number;
  tareWeightKg: number;
  netWeightKg: number;
  netQuintals: number;
  operatorName: string;
  timestamp: string;
}

export interface QualityTest {
  moisturePercent: number;
  dockageDeductionKg: number;
  grade: 'GRADE_A' | 'GRADE_B' | 'REJECTED';
  testerName: string;
  timestamp: string;
}

export interface Payment {
  baseAmount: number;
  bonusAmount: number;
  totalAmount: number;
  formattedPayout: string;
  status: 'SCHEDULED' | 'PENDING' | 'PAID' | 'FAILED';
  pfmsTxnId: string;
  bankName: string;
  accountLast4: string;
  paidAt?: string;
}

export interface TokenBooking {
  id: string;
  tokenNumber: string; // KN-2026-A027
  farmerName: string;
  agriStackId: string;
  vehicleNo: string;
  quota: number; // Quintals
  cropKey: string;
  cropName: string;
  mspRate: number;
  bonusRate: number;
  mandiId: string;
  mandiName: string;
  slotDate: string;
  slotTime: string;
  status: TokenStatus;
  gateCleared: boolean;
  weighment?: Weighment;
  qualityTest?: QualityTest;
  payment?: Payment;
  createdAt: string;
}

export interface GovernmentMetrics {
  dwellTimeSavedPercent: number;
  dbtRealizationPercent: number;
  dieselIdlingHoursSaved: number;
  activeMandiNodes: number;
  totalRegisteredFarmers: number;
  todayProcuredTons: number;
  todayDisbursedCrores: number;
  tractorsInTransit: number;
}
