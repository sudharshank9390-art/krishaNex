import { Router } from 'express';
import type { NextFunction, Request, RequestHandler, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { authenticateUser, authorizeRoles } from '../middleware/auth.js';
import { createNotification } from '../services/notifications.js';

const operatorOnly: RequestHandler[] = [authenticateUser, authorizeRoles('MANDI_OPERATOR')];
const idSchema = z.object({ tokenId: z.string().min(1) });
const weighmentSchema = z.object({ tokenId: z.string().min(1), grossKg: z.coerce.number().positive(), tareKg: z.coerce.number().nonnegative() });
const qualitySchema = z.object({ tokenId: z.string().min(1), moisturePercent: z.coerce.number().min(0).max(100), grade: z.enum(['GRADE_A', 'GRADE_B', 'REJECTED']) });
const procurementSchema = z.object({ tokenId: z.string().min(1), approved: z.boolean().default(true) });
const statusSchema = z.object({ status: z.enum(['GENERATED', 'BOOKED', 'ARRIVED', 'WEIGHED', 'QUALITY_CHECKED', 'PROCURED', 'PAYMENT_PENDING', 'PAID', 'CANCELLED']) });
const transitions: Record<string, string[]> = { GENERATED: ['BOOKED', 'CANCELLED'], BOOKED: ['ARRIVED', 'CANCELLED'], ARRIVED: ['WEIGHED', 'CANCELLED'], WEIGHED: ['QUALITY_CHECKED', 'CANCELLED'], QUALITY_CHECKED: ['PROCURED', 'CANCELLED'], PROCURED: ['PAYMENT_PENDING'], PAYMENT_PENDING: ['PAID'], PAID: [], CANCELLED: [] };

async function findToken(identifier: string) {
  return prisma.token.findFirst({ where: { OR: [{ id: identifier }, { tokenNumber: identifier }] }, include: { booking: { include: { farmer: { select: { name: true, email: true } }, crop: true, mandi: true } }, weighment: true, qualityTest: true, procurement: true, payment: true } });
}

export const mandiRouter = Router();
export const operatorRouter = Router();
function broadcast(req: Request, event: string, data: unknown) { req.app.get('io')?.emit(event, data); }

mandiRouter.get('/', async (_req, res, next) => {
  try { res.json({ success: true, data: await prisma.mandi.findMany({ include: { _count: { select: { queue: true } } }, orderBy: { name: 'asc' } }) }); } catch (error) { next(error); }
});

mandiRouter.get('/:id/queue', ...operatorOnly, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const queue = await prisma.mandiQueue.findMany({ where: { mandiId: req.params.id as string }, include: { booking: { include: { farmer: { select: { name: true, email: true } }, crop: true, mandi: true, token: true } } }, orderBy: { position: 'asc' } });
    res.json({ success: true, data: queue });
  } catch (error) { next(error); }
});

operatorRouter.post('/tokens/verify', ...operatorOnly, async (req: Request, res: Response, next: NextFunction) => {
  try { const { tokenId } = idSchema.parse(req.body); const token = await findToken(tokenId); if (!token) return res.status(404).json({ success: false, error: 'Token not found' }); res.json({ success: true, data: token }); } catch (error) { next(error); }
});

operatorRouter.post('/weighments', ...operatorOnly, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const input = weighmentSchema.parse(req.body); if (input.tareKg >= input.grossKg) return res.status(400).json({ success: false, error: 'Tare weight must be lower than gross weight' });
    const token = await findToken(input.tokenId); if (!token) return res.status(404).json({ success: false, error: 'Token not found' });
    if (!transitions[token.status]?.includes('WEIGHED')) return res.status(409).json({ success: false, error: `Token cannot be weighed from ${token.status}` });
    const netKg = input.grossKg - input.tareKg;
    const result = await prisma.$transaction(async (transaction) => { const weighment = await transaction.weighment.upsert({ where: { tokenId: token.id }, update: { grossKg: input.grossKg, tareKg: input.tareKg, netKg, operatorId: req.userId! }, create: { tokenId: token.id, grossKg: input.grossKg, tareKg: input.tareKg, netKg, operatorId: req.userId! } }); await transaction.token.update({ where: { id: token.id }, data: { status: 'WEIGHED' } }); return weighment; });
    broadcast(req, 'token:weighed', { tokenId: token.id, netKg: result.netKg });
    broadcast(req, 'queue:updated', { mandiId: token.booking.mandi.id });
    await createNotification(token.booking.farmerId, 'Weighment recorded', `Token ${token.tokenNumber} was weighed at ${result.netKg / 100} quintals.`);
    res.status(201).json({ success: true, data: { ...result, netQuintals: result.netKg / 100 } });
  } catch (error) { next(error); }
});

operatorRouter.post('/quality-tests', ...operatorOnly, async (req: Request, res: Response, next: NextFunction) => {
  try { const input = qualitySchema.parse(req.body); const token = await findToken(input.tokenId); if (!token) return res.status(404).json({ success: false, error: 'Token not found' }); if (!transitions[token.status]?.includes('QUALITY_CHECKED')) return res.status(409).json({ success: false, error: `Token cannot enter quality check from ${token.status}` }); const result = await prisma.$transaction(async (transaction) => { const test = await transaction.qualityTest.upsert({ where: { tokenId: token.id }, update: { moisturePercent: input.moisturePercent, grade: input.grade, testerId: req.userId! }, create: { tokenId: token.id, moisturePercent: input.moisturePercent, grade: input.grade, testerId: req.userId! } }); await transaction.token.update({ where: { id: token.id }, data: { status: input.grade === 'REJECTED' ? 'CANCELLED' : 'QUALITY_CHECKED' } }); return test; }); broadcast(req, 'token:quality-checked', { tokenId: token.id, grade: result.grade }); await createNotification(token.booking.farmerId, 'Quality check complete', `Token ${token.tokenNumber} received grade ${result.grade}.`); res.status(201).json({ success: true, data: result }); } catch (error) { next(error); }
});

operatorRouter.post('/procurements', ...operatorOnly, async (req: Request, res: Response, next: NextFunction) => {
  try { const input = procurementSchema.parse(req.body); const token = await findToken(input.tokenId); if (!token || !token.weighment || !token.qualityTest) return res.status(400).json({ success: false, error: 'Weighment and quality approval are required first' }); if (!input.approved) { await prisma.token.update({ where: { id: token.id }, data: { status: 'CANCELLED' } }); return res.json({ success: true, data: { status: 'CANCELLED' } }); } if (!transitions[token.status]?.includes('PROCURED')) return res.status(409).json({ success: false, error: `Token cannot be procured from ${token.status}` }); const amount = (token.weighment.netKg / 100) * (token.booking.crop.msp + token.booking.crop.bonus); const result = await prisma.$transaction(async (transaction) => { const procurement = await transaction.procurement.upsert({ where: { tokenId: token.id }, update: { amount, operatorId: req.userId! }, create: { tokenId: token.id, amount, operatorId: req.userId! } }); const payment = await transaction.payment.upsert({ where: { tokenId: token.id }, update: { amount, status: 'PENDING' }, create: { tokenId: token.id, amount, status: 'PENDING' } }); await transaction.token.update({ where: { id: token.id }, data: { status: 'PAYMENT_PENDING' } }); return { procurement, payment }; }); broadcast(req, 'token:procured', { tokenId: token.id, amount }); broadcast(req, 'payment:updated', result.payment); await createNotification(token.booking.farmerId, 'Procurement approved', `Token ${token.tokenNumber} is approved and payment is pending.`); res.status(201).json({ success: true, data: result }); } catch (error) { next(error); }
});

operatorRouter.patch('/tokens/:id/status', ...operatorOnly, async (req: Request, res: Response, next: NextFunction) => {
  try { const { status } = statusSchema.parse(req.body); const token = await findToken(req.params.id as string); if (!token) return res.status(404).json({ success: false, error: 'Token not found' }); if (!transitions[token.status]?.includes(status)) return res.status(409).json({ success: false, error: `Invalid transition from ${token.status} to ${status}` }); const updated = await prisma.token.update({ where: { id: token.id }, data: { status } }); broadcast(req, status === 'ARRIVED' ? 'token:arrived' : 'token:status-changed', updated); res.json({ success: true, data: updated }); } catch (error) { next(error); }
});