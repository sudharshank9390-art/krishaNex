import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { prisma } from '../lib/prisma.js';

type AccessClaims = { sub: string; role: string; type: 'access' };

export function createAccessToken(userId: string, role: string): string {
  return jwt.sign({ sub: userId, role, type: 'access' }, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN } as jwt.SignOptions);
}

export function authenticateUser(req: Request, res: Response, next: NextFunction): void {
  const header = req.header('authorization');
  const token = header?.startsWith('Bearer ') ? header.slice(7) : undefined;

  if (!token) {
    res.status(401).json({ success: false, error: 'Authentication required' });
    return;
  }

  try {
    const claims = jwt.verify(token, env.JWT_SECRET) as AccessClaims;
    if (claims.type !== 'access' || !claims.sub) throw new Error('Invalid access token');
    req.userId = claims.sub;
    req.userRole = claims.role;
    next();
  } catch {
    res.status(401).json({ success: false, error: 'Invalid or expired access token' });
  }
}

export function authorizeRoles(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.userRole || !roles.includes(req.userRole)) {
      res.status(403).json({ success: false, error: 'Insufficient permissions' });
      return;
    }
    next();
  };
}

export async function getAuthenticatedUser(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, role: true, phone: true, createdAt: true },
  });
}