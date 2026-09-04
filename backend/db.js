const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, 'data', 'db.json');

// Baseline Seed Data matching KisanFlow AI SIH 2026 UI specifications
const defaultData = {
  mandis: [
    {
      id: "barnala",
      name: "Barnala Central Mandi (ABC Hub-1)",
      shortName: "Barnala Yard (Bay 02)",
      district: "Barnala",
      state: "Punjab",
      bay: "Bay 02",
      waitMins: 18,
      queueAhead: 6,
      distKm: 2.4,
      confidence: "98.6%",
      capacityTons: 5000,
      currentOccupancyTons: 3420,
      activeScales: 4,
      moistureMaxLimit: 14.0,
      status: "OPERATIONAL",
      lat: 30.3802,
      lng: 75.5468
    },
    {
      id: "dhuri",
      name: "Dhuri Mandi Warehouse Hub",
      shortName: "Dhuri Warehouse (Bay 01)",
      district: "Sangrur",
      state: "Punjab",
      bay: "Bay 01",
      waitMins: 45,
      queueAhead: 16,
      distKm: 8.5,
      confidence: "89.2%",
      capacityTons: 8000,
      currentOccupancyTons: 6890,
      activeScales: 6,
      moistureMaxLimit: 14.0,
      status: "HEAVY_QUEUE",
      lat: 30.3667,
      lng: 75.8667
    },
    {
      id: "sangrur",
      name: "Sangrur Apex Procurement Yard",
      shortName: "Sangrur Apex Yard",
      district: "Sangrur",
      state: "Punjab",
      bay: "Bay 04",
      waitMins: 22,
      queueAhead: 8,
      distKm: 14.1,
      confidence: "94.5%",
      capacityTons: 6500,
      currentOccupancyTons: 4100,
      activeScales: 5,
      moistureMaxLimit: 14.0,
      status: "OPERATIONAL",
      lat: 30.2458,
      lng: 75.8421
    },
    {
      id: "moga",
      name: "Moga Grain Terminal Silo 3",
      shortName: "Moga Terminal (Silo 3)",
      district: "Moga",
      state: "Punjab",
      bay: "Silo Bay 03",
      waitMins: 12,
      queueAhead: 3,
      distKm: 28.0,
      confidence: "99.1%",
      capacityTons: 12000,
      currentOccupancyTons: 5200,
      activeScales: 8,
      moistureMaxLimit: 14.0,
      status: "OPTIMAL",
      lat: 30.8165,
      lng: 75.1717
    }
  ],
  crops: {
    wheat: { name: "Wheat (Sharbati Grade-A)", msp: 2275, bonus: 150, category: "Rabi 2026" },
    paddy: { name: "Paddy (Basmati Grade-1)", msp: 2320, bonus: 100, category: "Kharif 2026" },
    mustard: { name: "Mustard (Pusa Bold)", msp: 5650, bonus: 200, category: "Rabi 2026" }
  },
  tokens: [
    {
      id: "TOK-10027",
      tokenNumber: "A-027",
      farmerName: "Ramesh Kumar",
      agriStackId: "PB-2026-8819",
      aadhaarLast4: "4912",
      phone: "+91 98765 43210",
      vehicleNo: "PB-19-T-4912",
      vehicleType: "Tractor Trolley (Eicher 557)",
      quota: 110.0,
      cropKey: "wheat",
      cropName: "Wheat (Sharbati Grade-A)",
      mspRate: 2275,
      bonusRate: 150,
      mandiId: "barnala",
      slotTime: "10:30 AM – 11:30 AM",
      slotDate: "2026-09-04",
      stage: 3, // 1: Booking, 2: Gate ANPR, 3: Weighbridge, 4: Moisture/Assay, 5: DBT Realized
      gateCleared: true,
      gateClearedTime: "10:32 AM",
      weighbridge: {
        grossWeightKg: 14850,
        tareWeightKg: 3850,
        netWeightKg: 11000,
        netQuintals: 110.0,
        moisturePercent: 12.4,
        dockageDeductionKg: 0,
        operatorName: "Rajesh Verma (Nodal Admin)"
      },
      payout: {
        baseAmount: 250250,
        bonusAmount: 16500,
        totalAmount: 266750,
        formattedPayout: "₹2,66,750",
        dbtStatus: "COMPLETED",
        pfmsTxnId: "PFMS-2026-0904-8819027",
        bankName: "State Bank of India (Moga Main)",
        ifscCode: "SBIN0001429",
        accountLast4: "8819"
      },
      createdAt: "2026-09-04T08:15:00Z"
    },
    {
      id: "TOK-10028",
      tokenNumber: "A-028",
      farmerName: "Gurpreet Singh",
      agriStackId: "PB-2026-9041",
      aadhaarLast4: "3019",
      phone: "+91 98123 77890",
      vehicleNo: "PB-19-R-3019",
      vehicleType: "Tractor Trolley (Swaraj 855)",
      quota: 95.5,
      cropKey: "wheat",
      cropName: "Wheat (Sharbati Grade-A)",
      mspRate: 2275,
      bonusRate: 150,
      mandiId: "barnala",
      slotTime: "11:30 AM – 12:30 PM",
      slotDate: "2026-09-04",
      stage: 2,
      gateCleared: true,
      gateClearedTime: "10:45 AM",
      weighbridge: null,
      payout: null,
      createdAt: "2026-09-04T08:40:00Z"
    },
    {
      id: "TOK-10029",
      tokenNumber: "A-029",
      farmerName: "Harnek Singh",
      agriStackId: "PB-2026-7712",
      aadhaarLast4: "5541",
      phone: "+91 94172 11099",
      vehicleNo: "PB-19-H-5541",
      vehicleType: "Tractor Trolley (Mahindra 575)",
      quota: 140.0,
      cropKey: "wheat",
      cropName: "Wheat (Sharbati Grade-A)",
      mspRate: 2275,
      bonusRate: 150,
      mandiId: "dhuri",
      slotTime: "01:00 PM – 02:00 PM",
      slotDate: "2026-09-04",
      stage: 1,
      gateCleared: false,
      gateClearedTime: null,
      weighbridge: null,
      payout: null,
      createdAt: "2026-09-04T09:10:00Z"
    }
  ],
  analytics: {
    dwellTimeSavedPercent: 82,
    dbtRealizationPercent: 100,
    dieselIdlingHoursSaved: 12400,
    activeMandiNodes: 42,
    totalMandiNodes: 42,
    todayProcuredTons: 18450,
    todayDisbursedCrores: 41.97,
    tractorsInTransit: 384,
    moistureAssayAccuracy: "99.8%"
  }
};

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function initDB() {
  const dir = path.dirname(DB_FILE);
  ensureDir(dir);

  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify(defaultData, null, 2), 'utf8');
  }
}

function readDB() {
  initDB();
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error("Error reading db.json, returning default data:", err);
    return defaultData;
  }
}

function writeDB(data) {
  initDB();
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
}

// Export DB API
module.exports = {
  getMandis: () => {
    return readDB().mandis;
  },
  getCrops: () => {
    return readDB().crops;
  },
  getTokens: () => {
    return readDB().tokens;
  },
  getTokenById: (id) => {
    const tokens = readDB().tokens;
    return tokens.find(t => t.id === id || t.tokenNumber === id);
  },
  createToken: (tokenPayload) => {
    const data = readDB();
    const tokenCount = data.tokens.length + 1;
    const numStr = (27 + tokenCount).toString().padStart(3, '0');
    
    const crop = data.crops[tokenPayload.cropKey] || data.crops.wheat;
    const msp = crop.msp;
    const bonus = crop.bonus;
    const quota = parseFloat(tokenPayload.quota) || 100;
    const totalPayout = quota * (msp + bonus);

    const newToken = {
      id: `TOK-${Date.now()}`,
      tokenNumber: `A-${numStr}`,
      farmerName: tokenPayload.farmerName || "Farmer User",
      agriStackId: tokenPayload.agriStackId || "PB-2026-9999",
      aadhaarLast4: tokenPayload.aadhaarLast4 || "1234",
      phone: tokenPayload.phone || "+91 98000 00000",
      vehicleNo: tokenPayload.vehicleNo || "PB-19-T-0000",
      vehicleType: tokenPayload.vehicleType || "Tractor Trolley",
      quota: quota,
      cropKey: tokenPayload.cropKey || "wheat",
      cropName: crop.name,
      mspRate: msp,
      bonusRate: bonus,
      mandiId: tokenPayload.mandiId || "barnala",
      slotTime: tokenPayload.slotTime || "11:30 AM – 12:30 PM",
      slotDate: new Date().toISOString().split('T')[0],
      stage: 1,
      gateCleared: false,
      gateClearedTime: null,
      weighbridge: null,
      payout: {
        baseAmount: quota * msp,
        bonusAmount: quota * bonus,
        totalAmount: totalPayout,
        formattedPayout: `₹${totalPayout.toLocaleString('en-IN')}`,
        dbtStatus: "SCHEDULED",
        pfmsTxnId: `PFMS-2026-PENDING-${numStr}`,
        bankName: "State Bank of India",
        accountLast4: tokenPayload.aadhaarLast4 || "1234"
      },
      createdAt: new Date().toISOString()
    };

    data.tokens.unshift(newToken);
    
    // Update mandi queue statistics
    const mandi = data.mandis.find(m => m.id === newToken.mandiId);
    if (mandi) {
      mandi.queueAhead += 1;
      mandi.waitMins += 5;
    }

    writeDB(data);
    return { token: newToken, mandiUpdated: mandi };
  },
  updateWeighbridge: (tokenId, weighbridgePayload) => {
    const data = readDB();
    const token = data.tokens.find(t => t.id === tokenId || t.tokenNumber === tokenId);
    if (!token) return null;

    const gross = parseFloat(weighbridgePayload.grossWeightKg) || 14850;
    const tare = parseFloat(weighbridgePayload.tareWeightKg) || 3850;
    const netKg = Math.max(0, gross - tare);
    const netQuintals = netKg / 100;
    const moisture = parseFloat(weighbridgePayload.moisturePercent) || 12.4;

    token.weighbridge = {
      grossWeightKg: gross,
      tareWeightKg: tare,
      netWeightKg: netKg,
      netQuintals: netQuintals,
      moisturePercent: moisture,
      dockageDeductionKg: weighbridgePayload.dockageDeductionKg || 0,
      operatorName: weighbridgePayload.operatorName || "Rajesh Verma (Nodal Admin)"
    };

    token.stage = 5; // Direct DBT Realized
    token.gateCleared = true;
    if (!token.gateClearedTime) token.gateClearedTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Recalculate Payout with exact net Quintals
    const base = netQuintals * token.mspRate;
    const bonus = netQuintals * token.bonusRate;
    const total = base + bonus;

    token.payout = {
      baseAmount: base,
      bonusAmount: bonus,
      totalAmount: total,
      formattedPayout: `₹${Math.round(total).toLocaleString('en-IN')}`,
      dbtStatus: "COMPLETED",
      pfmsTxnId: `PFMS-2026-${Date.now().toString().slice(-8)}`,
      bankName: "State Bank of India (Moga Main)",
      ifscCode: "SBIN0001429",
      accountLast4: token.aadhaarLast4 || "8819"
    };

    // Update analytics
    data.analytics.todayProcuredTons += Math.round(netQuintals / 10);
    data.analytics.todayDisbursedCrores += (total / 10000000);

    writeDB(data);
    return token;
  },
  getAnalytics: () => {
    return readDB().analytics;
  }
};
