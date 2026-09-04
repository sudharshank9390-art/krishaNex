import { Router } from 'express';
import type { NextFunction, Request, RequestHandler, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { authenticateUser } from '../middleware/auth.js';

const protectedRoute: RequestHandler[] = [authenticateUser];
const idSchema = z.object({ id: z.string().min(1) });
export const notificationRouter = Router();

notificationRouter.get('/', ...protectedRoute, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const notifications = await prisma.notification.findMany({ where: { userId: req.userId! }, orderBy: { createdAt: 'desc' }, take: 30 });
    res.json({ success: true, data: notifications, unreadCount: notifications.filter((item) => !item.readAt).length });
  } catch (error) { next(error); }
});

notificationRouter.patch('/:id/read', ...protectedRoute, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = idSchema.parse(req.params);
    const notification = await prisma.notification.updateMany({ where: { id, userId: req.userId! }, data: { readAt: new Date() } });
    if (!notification.count) return res.status(404).json({ success: false, error: 'Notification not found' });
    res.status(204).send();
  } catch (error) { next(error); }
});