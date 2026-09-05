import { execSync } from 'node:child_process';
import path from 'node:path';

const absoluteDbPath = path.resolve(process.cwd(), 'prisma', 'dev.db');
const dbUrl = `file:${absoluteDbPath}`;

console.log(`[DB SETUP] Ensuring SQLite database exists at absolute path: ${dbUrl}`);

try {
  execSync('npx prisma db push --schema=prisma/schema.prisma --accept-data-loss', {
    stdio: 'inherit',
    env: { ...process.env, DATABASE_URL: dbUrl },
  });
  console.log('[DB SETUP] Schema pushed successfully.');

  execSync('npx tsx prisma/seed.ts', {
    stdio: 'inherit',
    env: { ...process.env, DATABASE_URL: dbUrl },
  });
  console.log('[DB SETUP] Database seeded successfully.');
} catch (error) {
  console.error('[DB SETUP ERROR]', error);
  process.exit(1);
}
