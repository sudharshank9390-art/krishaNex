import http from 'node:http';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { Server } from 'socket.io';
import { env } from './config/env.js';
import { healthRouter } from './routes/health.js';
import { authRouter } from './routes/auth.js';
import { farmerRouter } from './routes/farmer.js';
import { mandiRouter, operatorRouter } from './routes/mandi.js';
import { governmentRouter } from './routes/government.js';
import { adminRouter } from './routes/admin.js';
import { notificationRouter } from './routes/notifications.js';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';

const app = express();
const server = http.createServer(app);

const configuredOrigins = (env.CLIENT_ORIGIN || '')
  .split(',')
  .map((o) => o.trim().replace(/\/$/, ''))
  .filter(Boolean);

const defaultOrigins = ['http://localhost:5173', 'http://127.0.0.1:5173'];
const allowedOriginsList = Array.from(new Set([...configuredOrigins, ...defaultOrigins]));

const isOriginAllowed = (origin: string | undefined): boolean => {
  if (!origin) return true;
  const cleanOrigin = origin.replace(/\/$/, '');
  if (allowedOriginsList.includes(cleanOrigin)) return true;
  if (/^https:\/\/.*\.vercel\.app$/.test(cleanOrigin)) return true;
  return false;
};

const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      if (isOriginAllowed(origin)) callback(null, true);
      else callback(new Error('Origin is not allowed by CORS'));
    },
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
  },
});
app.set('io', io);

app.use(helmet());
app.use(
  cors({
    origin: (origin, callback) => {
      if (isOriginAllowed(origin)) callback(null, true);
      else callback(new Error('Origin is not allowed by CORS'));
    },
    credentials: true,
  })
);
app.use(express.json({ limit: '1mb' }));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 300 }));

app.get('/api', (_req, res) => {
  res.json({ name: 'KrishNex API', version: '2.0.0', status: 'ONLINE' });
});
app.use('/api/health', healthRouter);
app.use('/api/auth', authRouter);
app.use('/api/farmers', farmerRouter);
app.use('/api/mandis', mandiRouter);
app.use('/api', operatorRouter);
app.use('/api/dashboard', governmentRouter);
app.use('/api/admin', adminRouter);
app.use('/api/notifications', notificationRouter);

io.on('connection', (socket) => {
  socket.emit('system_handshake', {
    message: 'Connected to KrishNex real-time procurement services',
    timestamp: new Date().toISOString(),
  });
  socket.on('disconnect', () => console.log(`Socket disconnected: ${socket.id}`));
});

app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(error);
  if (error instanceof ZodError) {
    res.status(400).json({ success: false, error: 'Request validation failed', details: error.flatten().fieldErrors });
    return;
  }
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    const status = error.code === 'P2025' ? 404 : error.code === 'P2002' ? 409 : 400;
    const msg = error.code === 'P2025' ? 'Record not found' : error.code === 'P2002' ? 'A record with these details already exists' : `Database request failed (${error.code})`;
    res.status(status).json({ success: false, error: msg });
    return;
  }
  if (error instanceof Error && error.message === 'Origin is not allowed by CORS') {
    res.status(403).json({ success: false, error: 'Origin is not allowed' });
    return;
  }
  res.status(500).json({ success: false, error: 'Internal server error' });
});

server.listen(env.PORT, () => {
  console.log(`KrishNex API running at http://localhost:${env.PORT}`);
  console.log(`Health check: http://localhost:${env.PORT}/api/health`);
});