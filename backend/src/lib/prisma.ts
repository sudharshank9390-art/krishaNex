import path from 'node:path';
import { PrismaClient } from '@prisma/client';

const getDatabaseUrl = () => {
  const envUrl = process.env.DATABASE_URL;
  if (envUrl && !envUrl.startsWith('file:')) {
    return envUrl;
  }
  const absoluteDbPath = path.resolve(process.cwd(), 'prisma', 'dev.db');
  return `file:${absoluteDbPath}`;
};

export const prisma = new PrismaClient({
  datasources: {
    db: {
      url: getDatabaseUrl(),
    },
  },
});