import bcrypt from 'bcryptjs';
import { prisma } from '../src/lib/prisma.js';

async function main() {
  const demoPasswordHash = await bcrypt.hash(process.env.DEMO_PASSWORD || 'KrishNex2026!', 12);
  const demoUsers = [
    { name: 'Ramesh Kumar', email: 'farmer@krishnex.app', role: 'FARMER' },
    { name: 'Rajesh Verma', email: 'mandi@krishnex.app', role: 'MANDI_OPERATOR' },
    { name: 'Suresh Sharma', email: 'gov@krishnex.app', role: 'GOVERNMENT_ADMIN' },
    { name: 'System Admin', email: 'admin@krishnex.app', role: 'SUPER_ADMIN' },
  ] as const;

  for (const demoUser of demoUsers) {
    await prisma.user.upsert({
      where: { email: demoUser.email },
      update: { name: demoUser.name, role: demoUser.role, passwordHash: demoPasswordHash },
      create: { ...demoUser, passwordHash: demoPasswordHash },
    });
  }

  const wheat = await prisma.crop.upsert({
    where: { key: 'wheat' },
    update: {},
    create: { key: 'wheat', name: 'Wheat (Sharbati Grade-A)', msp: 2275, bonus: 150, category: 'Rabi' },
  });

  await prisma.mandi.upsert({
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

  console.log(`Seeded crop: ${wheat.name}`);
}

main()
  .catch((error) => { console.error(error); process.exitCode = 1; })
  .finally(async () => { await prisma.$disconnect(); });