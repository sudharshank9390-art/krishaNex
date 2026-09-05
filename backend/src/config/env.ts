import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  PORT: z.coerce.number().int().positive().default(3000),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  CLIENT_ORIGIN: z.string().default('http://localhost:5173'),
  DATABASE_URL: z.string().min(1).default('file:./prisma/dev.db'),
  JWT_SECRET: z.string().min(32).default('krishnex-local-development-secret-change-me'),
  JWT_EXPIRES_IN: z.string().default('15m'),
});

export const env = envSchema.parse(process.env);