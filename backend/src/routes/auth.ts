import { randomBytes, createHash } from 'node:crypto';
import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { env } from '../config/env.js';
import { prisma } from '../lib/prisma.js';
import { authenticateUser, createAccessToken, getAuthenticatedUser } from '../middleware/auth.js';

const registerSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().transform((email) => email.toLowerCase()),
  password: z.string().min(8).max(128),
  phone: z.string().trim().min(7).max(20).optional(),
});

const loginSchema = z.object({ email: z.string().email().transform((email) => email.toLowerCase()), password: z.string().min(1) });
const refreshSchema = z.object({ refreshToken: z.string().min(20) });

function hashRefreshToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

async function issueTokens(userId: string, role: string) {
  const refreshToken = randomBytes(48).toString('base64url');
  await prisma.refreshToken.create({
    data: { tokenHash: hashRefreshToken(refreshToken), userId, expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
  });
  return { accessToken: createAccessToken(userId, role), refreshToken };
}

export const authRouter = Router();

authRouter.post('/register', async (req, res, next) => {
  try {
    const input = registerSchema.parse(req.body);
    const existing = await prisma.user.findUnique({ where: { email: input.email } });
    if (existing) return res.status(409).json({ success: false, error: 'An account with this email already exists' });

    const user = await prisma.user.create({
      data: { name: input.name, email: input.email, passwordHash: await bcrypt.hash(input.password, 12), phone: input.phone, role: 'FARMER' },
    });
    const tokens = await issueTokens(user.id, user.role);
    res.status(201).json({ success: true, data: { user: await getAuthenticatedUser(user.id), ...tokens } });
  } catch (error) { next(error); }
});

authRouter.post('/login', async (req, res, next) => {
  try {
    const input = loginSchema.parse(req.body);
    const user = await prisma.user.findUnique({ where: { email: input.email } });
    if (!user || !(await bcrypt.compare(input.password, user.passwordHash))) {
      return res.status(401).json({ success: false, error: 'Invalid email or password' });
    }
    const tokens = await issueTokens(user.id, user.role);
    res.json({ success: true, data: { user: await getAuthenticatedUser(user.id), ...tokens } });
  } catch (error) { next(error); }
});

authRouter.post('/refresh', async (req, res, next) => {
  try {
    const { refreshToken } = refreshSchema.parse(req.body);
    const stored = await prisma.refreshToken.findUnique({ where: { tokenHash: hashRefreshToken(refreshToken) }, include: { user: true } });
    if (!stored || stored.expiresAt <= new Date()) return res.status(401).json({ success: false, error: 'Invalid or expired refresh token' });
    await prisma.refreshToken.delete({ where: { id: stored.id } });
    const tokens = await issueTokens(stored.user.id, stored.user.role);
    res.json({ success: true, data: tokens });
  } catch (error) { next(error); }
});

authRouter.post('/logout', async (req, res, next) => {
  try {
    const parsed = refreshSchema.safeParse(req.body);
    if (parsed.success) await prisma.refreshToken.deleteMany({ where: { tokenHash: hashRefreshToken(parsed.data.refreshToken) } });
    res.status(204).send();
  } catch (error) { next(error); }
});

authRouter.get('/me', authenticateUser, async (req, res, next) => {
  try {
    const user = await getAuthenticatedUser(req.userId!);
    if (!user) return res.status(404).json({ success: false, error: 'User not found' });
    res.json({ success: true, data: user });
  } catch (error) { next(error); }
});