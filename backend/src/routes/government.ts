import { Router } from 'express';
import type { NextFunction, Request, RequestHandler, Response } from 'express';
import { authenticateUser, authorizeRoles } from '../middleware/auth.js';
import { prisma } from '../lib/prisma.js';

const governmentOnly: RequestHandler[] = [authenticateUser, authorizeRoles('GOVERNMENT_ADMIN', 'SUPER_ADMIN')];
export const governmentRouter = Router();

governmentRouter.get('/metrics', ...governmentOnly, async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const [registeredFarmers, activeBookings, activeMandis, procuredTons, payments] = await Promise.all([
      prisma.user.count({ where: { role: 'FARMER' } }),
      prisma.booking.count({ where: { token: { status: { in: ['BOOKED', 'ARRIVED', 'WEIGHED', 'QUALITY_CHECKED', 'PROCURED', 'PAYMENT_PENDING'] } } } }),
      prisma.mandi.count({ where: { status: { not: 'CLOSED' } } }),
      prisma.weighment.aggregate({ _sum: { netKg: true } }),
      prisma.payment.aggregate({ _sum: { amount: true }, _count: { _all: true } }),
    ]);
    res.json({ success: true, data: { totalRegisteredFarmers: registeredFarmers, activeBookings, activeMandis, todayProcuredTons: (procuredTons._sum.netKg || 0) / 1000, todayDisbursed: payments._sum.amount || 0, paymentCount: payments._count._all, pendingPayments: await prisma.payment.count({ where: { status: 'PENDING' } }) } });
  } catch (error) { next(error); }
});

governmentRouter.get('/mandi-load', ...governmentOnly, async (_req: Request, res: Response, next: NextFunction) => {
  try { const mandis = await prisma.mandi.findMany({ include: { _count: { select: { queue: true } } }, orderBy: { name: 'asc' } }); res.json({ success: true, data: mandis.map(({ _count, ...mandi }) => ({ ...mandi, queueAhead: _count.queue, utilizationPercent: mandi.capacityTons ? Math.round((mandi.currentOccupancyTons / mandi.capacityTons) * 100) : 0 })) }); } catch (error) { next(error); }
});

governmentRouter.get('/procurement-trends', ...governmentOnly, async (_req: Request, res: Response, next: NextFunction) => {
  try { const weighments = await prisma.weighment.findMany({ select: { netKg: true, recordedAt: true }, orderBy: { recordedAt: 'asc' } }); res.json({ success: true, data: weighments.map((item) => ({ date: item.recordedAt.toISOString().slice(0, 10), tons: item.netKg / 1000 })) }); } catch (error) { next(error); }
});

governmentRouter.get('/payment-summary', ...governmentOnly, async (_req: Request, res: Response, next: NextFunction) => {
  try { const grouped = await prisma.payment.groupBy({ by: ['status'], _count: { _all: true }, _sum: { amount: true } }); res.json({ success: true, data: grouped }); } catch (error) { next(error); }
});

governmentRouter.get('/alerts', ...governmentOnly, async (_req: Request, res: Response, next: NextFunction) => {
  try { const mandis = await prisma.mandi.findMany({ include: { _count: { select: { queue: true } } } }); const alerts = mandis.filter((mandi) => mandi.status === 'HEAVY_QUEUE' || (mandi.capacityTons > 0 && mandi.currentOccupancyTons / mandi.capacityTons >= 0.8)).map((mandi) => ({ mandiId: mandi.id, mandiName: mandi.name, severity: 'HIGH', message: `${mandi.name} is at ${Math.round((mandi.currentOccupancyTons / mandi.capacityTons) * 100)}% capacity with ${mandi._count.queue} queued bookings.` })); res.json({ success: true, data: alerts }); } catch (error) { next(error); }
});