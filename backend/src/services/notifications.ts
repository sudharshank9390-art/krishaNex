import { prisma } from '../lib/prisma.js';

export async function createNotification(userId: string, title: string, message: string) {
  const notification = await prisma.notification.create({ data: { userId, title, message } });
  return notification;
}