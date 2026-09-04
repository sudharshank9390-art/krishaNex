const express = require('express');
const http = require('http');
const path = require('path');
const cors = require('cors');
const { Server } = require('socket.io');
const apiRoutes = require('./routes/api');

const app = express();
const server = http.createServer(app);

// Initialize Socket.io with CORS enabled for local development
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PATCH", "DELETE"]
  }
});

// Save io instance to app context so router can access it
app.set('io', io);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend files from ../frontend directory
app.use(express.static(path.join(__dirname, '../frontend')));

// Mount REST API routes
app.use('/api', apiRoutes);

// Socket.io Real-time Event Handlers
io.on('connection', (socket) => {
  console.log(`[Socket.io] Client connected: ${socket.id}`);

  // Send initial telemetry handshake to connected client
  socket.emit('system_handshake', {
    message: 'Connected to KisanFlow AI Real-time Procurement Engine',
    timestamp: new Date().toISOString()
  });

  socket.on('disconnect', () => {
    console.log(`[Socket.io] Client disconnected: ${socket.id}`);
  });
});

// Default fallback route to frontend/index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Start Server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log("==================================================================");
  console.log(`🚀 KisanFlow AI Backend Server running on http://localhost:${PORT}`);
  console.log(`🌾 SIH 2026 Procurement Engine Ready`);
  console.log(`📡 WebSocket Gateway Online (Socket.io)`);
  console.log(`🔗 API Base: http://localhost:${PORT}/api/health`);
  console.log("==================================================================");
});
