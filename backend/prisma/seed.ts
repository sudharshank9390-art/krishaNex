import bcrypt from 'bcryptjs';
import { prisma } from '../src/lib/prisma.js';

export async function runSeed() {
  const demoPasswordHash = await bcrypt.hash(process.env.DEMO_PASSWORD || 'KrishNex2026!', 12);

  const farmer = await prisma.user.upsert({
    where: { email: 'farmer@krishnex.app' },
    update: { name: 'Ramesh Kumar', role: 'FARMER', passwordHash: demoPasswordHash },
    create: { name: 'Ramesh Kumar', email: 'farmer@krishnex.app', role: 'FARMER', passwordHash: demoPasswordHash },
  });

  const operator = await prisma.user.upsert({
    where: { email: 'mandi@krishnex.app' },
    update: { name: 'Rajesh Verma', role: 'MANDI_OPERATOR', passwordHash: demoPasswordHash },
    create: { name: 'Rajesh Verma', email: 'mandi@krishnex.app', role: 'MANDI_OPERATOR', passwordHash: demoPasswordHash },
  });

  await prisma.user.upsert({
    where: { email: 'gov@krishnex.app' },
    update: { name: 'Suresh Sharma', role: 'GOVERNMENT_ADMIN', passwordHash: demoPasswordHash },
    create: { name: 'Suresh Sharma', email: 'gov@krishnex.app', role: 'GOVERNMENT_ADMIN', passwordHash: demoPasswordHash },
  });

  await prisma.user.upsert({
    where: { email: 'admin@krishnex.app' },
    update: { name: 'System Admin', role: 'SUPER_ADMIN', passwordHash: demoPasswordHash },
    create: { name: 'System Admin', email: 'admin@krishnex.app', role: 'SUPER_ADMIN', passwordHash: demoPasswordHash },
  });

  const wheat = await prisma.crop.upsert({
    where: { key: 'wheat' },
    update: {},
    create: { key: 'wheat', name: 'Wheat (Sharbati Grade-A)', msp: 2275, bonus: 150, category: 'Rabi' },
  });

  const mandi = await prisma.mandi.upsert({
    where: { code: 'BARNALA-01' },
    update: {},
    create: {
      name: 'Barnala Central Mandi', code: 'BARNALA-01', district: 'Barnala', state: 'Punjab',
      capacityTons: 5000, currentOccupancyTons: 3420, waitMins: 18, status: 'OPERATIONAL',
    },
  });

  await prisma.systemConfiguration.upsert({
    where: { key: 'platform.name' },
    update: { value: 'KrishNex' },
    create: { key: 'platform.name', value: 'KrishNex' },
  });

  // Seed sample tokens for Mandi Operator testing
  const sampleTokens = [
    { tokenNumber: 'KN-2026-A027', status: 'ARRIVED' },
    { tokenNumber: 'KN-2026-A028', status: 'ARRIVED' },
    { tokenNumber: 'KN-2026-B014', status: 'WEIGHED' },
    { tokenNumber: 'KN-2026-C089', status: 'QUALITY_CHECKED' },
  ];

  for (const item of sampleTokens) {
    const existingToken = await prisma.token.findUnique({ where: { tokenNumber: item.tokenNumber } });
    if (!existingToken) {
      const harvest = await prisma.harvest.create({
        data: {
          farmerId: farmer.id,
          cropId: wheat.id,
          quantityQuintals: 110,
          expectedDate: new Date(),
        },
      });

      const booking = await prisma.booking.create({
        data: {
          farmerId: farmer.id,
          harvestId: harvest.id,
          cropId: wheat.id,
          mandiId: mandi.id,
          arrivalDate: new Date(),
          slotTime: '10:00 AM',
          vehicleNo: 'PB-19-R-3019',
          quantityQuintals: 110,
        },
      });

      const token = await prisma.token.create({
        data: {
          tokenNumber: item.tokenNumber,
          bookingId: booking.id,
          status: item.status,
        },
      });

      if (item.status === 'WEIGHED' || item.status === 'QUALITY_CHECKED') {
        await prisma.weighment.upsert({
          where: { tokenId: token.id },
          update: {},
          create: {
            tokenId: token.id,
            operatorId: operator.id,
            grossKg: 14850,
            tareKg: 3850,
            netKg: 11000,
          },
        });
      }

      if (item.status === 'QUALITY_CHECKED') {
        await prisma.qualityTest.upsert({
          where: { tokenId: token.id },
          update: {},
          create: {
            tokenId: token.id,
            testerId: operator.id,
            moisturePercent: 12.4,
            grade: 'GRADE_A',
          },
        });
      }
    }
  }

  console.log('Seeded sample tokens: KN-2026-A027, KN-2026-A028, KN-2026-B014, KN-2026-C089');
}

if (process.argv[1]?.includes('seed')) {
  runSeed()
    .catch((error) => { console.error(error); process.exitCode = 1; });
}