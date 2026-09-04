import { Crop, Mandi, TokenBooking, GovernmentMetrics, User } from '../types';

export const DEMO_USERS: Record<string, User> = {
  farmer: {
    id: 'usr-farmer-1',
    name: 'Ramesh Kumar',
    email: 'farmer@krishnex.app',
    role: 'FARMER',
    phone: '+91 98765 43210',
    agriStackId: 'PB-2026-8819',
    avatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=150&q=80'
  },
  mandi: {
    id: 'usr-mandi-1',
    name: 'Rajesh Verma',
    email: 'mandi@krishnex.app',
    role: 'MANDI_OPERATOR',
    phone: '+91 98123 45678',
    mandiId: 'mandi-barnala',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'
  },
  gov: {
    id: 'usr-gov-1',
    name: 'Suresh Sharma, IAS',
    email: 'gov@krishnex.app',
    role: 'GOVERNMENT_ADMIN',
    phone: '+91 94170 00111',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80'
  },
  admin: {
    id: 'usr-admin-1',
    name: 'System Admin',
    email: 'admin@krishnex.app',
    role: 'SUPER_ADMIN',
    phone: '+91 1800 572 2026'
  }
};

export const MOCK_CROPS: Crop[] = [
  { id: 'c1', key: 'wheat', name: 'Wheat (Sharbati Grade-A)', msp: 2275, bonus: 150, category: 'Rabi 2026' },
  { id: 'c2', key: 'paddy', name: 'Paddy (Basmati Grade-1)', msp: 2320, bonus: 100, category: 'Kharif 2026' },
  { id: 'c3', key: 'mustard', name: 'Mustard (Pusa Bold)', msp: 5650, bonus: 200, category: 'Rabi 2026' },
  { id: 'c4', key: 'cotton', name: 'Cotton (Long Staple)', msp: 6620, bonus: 250, category: 'Kharif 2026' }
];

export const MOCK_MANDIS: Mandi[] = [
  {
    id: 'mandi-barnala',
    name: 'Barnala Central Grain Yard (Bay 02)',
    code: 'MND-PB-01',
    district: 'Barnala',
    state: 'Punjab',
    capacityTons: 5000,
    currentOccupancyTons: 3420,
    waitMins: 18,
    queueAhead: 6,
    activeScales: 4,
    status: 'OPERATIONAL'
  },
  {
    id: 'mandi-dhuri',
    name: 'Dhuri Warehouse Procurement Hub',
    code: 'MND-PB-02',
    district: 'Sangrur',
    state: 'Punjab',
    capacityTons: 8000,
    currentOccupancyTons: 6890,
    waitMins: 45,
    queueAhead: 16,
    activeScales: 6,
    status: 'HEAVY_QUEUE'
  },
  {
    id: 'mandi-sangrur',
    name: 'Sangrur Apex Yard',
    code: 'MND-PB-03',
    district: 'Sangrur',
    state: 'Punjab',
    capacityTons: 6500,
    currentOccupancyTons: 4100,
    waitMins: 22,
    queueAhead: 8,
    activeScales: 5,
    status: 'OPERATIONAL'
  },
  {
    id: 'mandi-moga',
    name: 'Moga Grain Terminal Silo 3',
    code: 'MND-PB-04',
    district: 'Moga',
    state: 'Punjab',
    capacityTons: 12000,
    currentOccupancyTons: 5200,
    waitMins: 12,
    queueAhead: 3,
    activeScales: 8,
    status: 'OPTIMAL'
  }
];

export const MOCK_TOKENS: TokenBooking[] = [
  {
    id: 'tok-10027',
    tokenNumber: 'KN-2026-A027',
    farmerName: 'Ramesh Kumar',
    agriStackId: 'PB-2026-8819',
    vehicleNo: 'PB-19-T-4912',
    quota: 110.0,
    cropKey: 'wheat',
    cropName: 'Wheat (Sharbati Grade-A)',
    mspRate: 2275,
    bonusRate: 150,
    mandiId: 'mandi-barnala',
    mandiName: 'Barnala Central Grain Yard (Bay 02)',
    slotDate: '2026-09-04',
    slotTime: '10:30 AM – 11:30 AM',
    status: 'PAID',
    gateCleared: true,
    weighment: {
      grossWeightKg: 14850,
      tareWeightKg: 3850,
      netWeightKg: 11000,
      netQuintals: 110.0,
      operatorName: 'Rajesh Verma',
      timestamp: '10:32 AM'
    },
    qualityTest: {
      moisturePercent: 12.4,
      dockageDeductionKg: 0,
      grade: 'GRADE_A',
      testerName: 'QC Officer S. Singh',
      timestamp: '10:40 AM'
    },
    payment: {
      baseAmount: 250250,
      bonusAmount: 16500,
      totalAmount: 266750,
      formattedPayout: '₹2,66,750',
      status: 'PAID',
      pfmsTxnId: 'PFMS-2026-0904-8819027',
      bankName: 'State Bank of India',
      accountLast4: '8819',
      paidAt: '2026-09-04 10:45 AM'
    },
    createdAt: '2026-09-04 08:15 AM'
  },
  {
    id: 'tok-10028',
    tokenNumber: 'KN-2026-A028',
    farmerName: 'Gurpreet Singh',
    agriStackId: 'PB-2026-9041',
    vehicleNo: 'PB-19-R-3019',
    quota: 95.5,
    cropKey: 'wheat',
    cropName: 'Wheat (Sharbati Grade-A)',
    mspRate: 2275,
    bonusRate: 150,
    mandiId: 'mandi-barnala',
    mandiName: 'Barnala Central Grain Yard (Bay 02)',
    slotDate: '2026-09-04',
    slotTime: '11:30 AM – 12:30 PM',
    status: 'ARRIVED',
    gateCleared: true,
    createdAt: '2026-09-04 08:40 AM'
  },
  {
    id: 'tok-10029',
    tokenNumber: 'KN-2026-A029',
    farmerName: 'Harnek Singh',
    agriStackId: 'PB-2026-7712',
    vehicleNo: 'PB-19-H-5541',
    quota: 140.0,
    cropKey: 'wheat',
    cropName: 'Wheat (Sharbati Grade-A)',
    mspRate: 2275,
    bonusRate: 150,
    mandiId: 'mandi-dhuri',
    mandiName: 'Dhuri Warehouse Procurement Hub',
    slotDate: '2026-09-04',
    slotTime: '01:00 PM – 02:00 PM',
    status: 'BOOKED',
    gateCleared: false,
    createdAt: '2026-09-04 09:10 AM'
  }
];

export const MOCK_METRICS: GovernmentMetrics = {
  dwellTimeSavedPercent: 82,
  dbtRealizationPercent: 100,
  dieselIdlingHoursSaved: 12400,
  activeMandiNodes: 42,
  totalRegisteredFarmers: 18420,
  todayProcuredTons: 18450,
  todayDisbursedCrores: 41.97,
  tractorsInTransit: 384
};
