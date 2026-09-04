import { Router } from 'express';
import type { NextFunction, Request, RequestHandler, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { authenticateUser, authorizeRoles } from '../middleware/auth.js';
import { createNotification } from '../services/notifications.js';

const farmerOnly: RequestHandler[] = [authenticateUser, authorizeRoles('FARMER')];
const profileSchema = z.object({
  village: z.string().trim().max(100).optional(), district: z.string().trim().max(100).optional(),
  state: z.string().trim().max(100).optional(), landSizeAcres: z.coerce.number().nonnegative().optional(),
  bankName: z.string().trim().max(120).optional(), accountLast4: z.string().regex(/^\d{4}$/).optional(),
  ifsc: z.string().trim().max(20).optional(),
});
const harvestSchema = z.object({ cropKey: z.string().min(1), quantityQuintals: z.coerce.number().positive(), expectedDate: z.coerce.date() });
const bookingSchema = z.object({ harvestId: z.string().min(1), mandiId: z.string().min(1), arrivalDate: z.coerce.date(), slotTime: z.string().trim().min(3).max(50), vehicleNo: z.string().trim().min(3).max(20) });

export const farmerRouter = Router();
function broadcast(req: Request, event: string, data: unknown) { req.app.get('io')?.emit(event, data); }

farmerRouter.get('/profile', farmerOnly, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const profile = await prisma.farmerProfile.findUnique({ where: { userId: req.userId! }, include: { user: { select: { name: true, email: true, phone: true } } } });
    res.json({ success: true, data: profile });
  } catch (error) { next(error); }
});

farmerRouter.put('/profile', farmerOnly, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const input = profileSchema.parse(req.body);
    const profile = await prisma.farmerProfile.upsert({ where: { userId: req.userId! }, update: input, create: { userId: req.userId!, ...input } });
    res.json({ success: true, data: profile });
  } catch (error) { next(error); }
});

farmerRouter.get('/mandis', farmerOnly, async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const mandis = await prisma.mandi.findMany({ orderBy: [{ status: 'asc' }, { waitMins: 'asc' }], include: { _count: { select: { queue: true } } } });
    res.json({ success: true, data: mandis.map(({ _count, ...mandi }) => ({ ...mandi, queueAhead: _count.queue })) });
  } catch (error) { next(error); }
});

farmerRouter.post('/harvests', farmerOnly, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const input = harvestSchema.parse(req.body);
    const crop = await prisma.crop.findUnique({ where: { key: input.cropKey } });
    if (!crop) return res.status(404).json({ success: false, error: 'Crop not found' });
    const harvest = await prisma.harvest.create({ data: { farmerId: req.userId!, cropId: crop.id, quantityQuintals: input.quantityQuintals, expectedDate: input.expectedDate }, include: { crop: true } });
    res.status(201).json({ success: true, data: harvest });
  } catch (error) { next(error); }
});

farmerRouter.get('/harvests', farmerOnly, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const harvests = await prisma.harvest.findMany({ where: { farmerId: req.userId! }, include: { crop: true, booking: { include: { token: true, mandi: true } } }, orderBy: { createdAt: 'desc' } });
    res.json({ success: true, data: harvests });
  } catch (error) { next(error); }
});

farmerRouter.post('/bookings', farmerOnly, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const input = bookingSchema.parse(req.body);
    const harvest = await prisma.harvest.findFirst({ where: { id: input.harvestId, farmerId: req.userId! }, include: { crop: true, booking: true } });
    if (!harvest) return res.status(404).json({ success: false, error: 'Harvest not found' });
    if (harvest.booking) return res.status(409).json({ success: false, error: 'This harvest already has a booking' });
    const mandi = await prisma.mandi.findUnique({ where: { id: input.mandiId } });
    if (!mandi || mandi.status === 'CLOSED') return res.status(400).json({ success: false, error: 'Selected mandi is unavailable' });

    const booking = await prisma.$transaction(async (transaction) => {
      const created = await transaction.booking.create({ data: { farmerId: req.userId!, harvestId: harvest.id, cropId: harvest.cropId, mandiId: mandi.id, arrivalDate: input.arrivalDate, slotTime: input.slotTime, vehicleNo: input.vehicleNo, quantityQuintals: harvest.quantityQuintals } });
      const tokenNumber = `KN-${input.arrivalDate.getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      const token = await transaction.token.create({ data: { tokenNumber, bookingId: created.id, status: 'BOOKED' } });
      const queueCount = await transaction.mandiQueue.count({ where: { mandiId: mandi.id } });
      await transaction.mandiQueue.create({ data: { mandiId: mandi.id, bookingId: created.id, position: queueCount + 1 } });
      return transaction.booking.findUnique({ where: { id: created.id }, include: { crop: true, mandi: true, token: true, queueEntry: true } });
    });
    broadcast(req, 'token:created', booking);
    broadcast(req, 'queue:updated', { mandiId: mandi.id });
    await createNotification(req.userId!, 'Booking confirmed', `Your procurement token ${booking?.token?.tokenNumber || 'is ready'} is booked at ${mandi.name}.`);
    res.status(201).json({ success: true, data: booking });
  } catch (error) { next(error); }
});

farmerRouter.get('/bookings', farmerOnly, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const bookings = await prisma.booking.findMany({ where: { farmerId: req.userId! }, include: { crop: true, mandi: true, token: true, queueEntry: true }, orderBy: { createdAt: 'desc' } });
    res.json({ success: true, data: bookings });
  } catch (error) { next(error); }
});

farmerRouter.get('/tokens/:id', farmerOnly, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tokenId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const token = await prisma.token.findFirst({ where: { OR: [{ id: tokenId }, { tokenNumber: tokenId }], booking: { farmerId: req.userId! } }, include: { booking: { include: { crop: true, mandi: true, farmer: { select: { name: true } } } }, weighment: true, qualityTest: true, procurement: true, payment: true } });
    if (!token) return res.status(404).json({ success: false, error: 'Token not found' });
    res.json({ success: true, data: token });
  } catch (error) { next(error); }
});

farmerRouter.get('/payments', farmerOnly, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payments = await prisma.payment.findMany({ where: { token: { booking: { farmerId: req.userId! } } }, include: { token: { include: { booking: { include: { crop: true, mandi: true } } } } }, orderBy: { createdAt: 'desc' } });
    res.json({ success: true, data: payments });
  } catch (error) { next(error); }
});