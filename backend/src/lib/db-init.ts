import path from 'node:path';
import { execSync } from 'node:child_process';
import { prisma } from './prisma.js';
import { runSeed } from '../../prisma/seed.js';

export async function ensureDatabaseReady() {
  const absoluteDbPath = path.resolve(process.cwd(), 'prisma', 'dev.db');
  const dbUrl = `file:${absoluteDbPath}`;
  process.env.DATABASE_URL = dbUrl;

  try {
    const userCount = await prisma.user.count();
    if (userCount > 0) {
      console.log(`[DATABASE] Connected to SQLite database (${userCount} users found).`);
      return;
    }
    console.log('[DATABASE] Database empty. Running seed...');
    await runSeed();
  } catch (error) {
    console.log('[DATABASE] User table missing or database uninitialized. Initializing schema and seed...');
    try {
      execSync('npx prisma db push --schema=prisma/schema.prisma --accept-data-loss', {
        stdio: 'inherit',
        env: { ...process.env, DATABASE_URL: dbUrl },
      });
      console.log('[DATABASE] Schema push complete. Seeding demo accounts...');
      await runSeed();
      console.log('[DATABASE] Database initialization complete!');
    } catch (initErr) {
      console.error('[DATABASE INIT ERROR]', initErr);
    }
  }
}
