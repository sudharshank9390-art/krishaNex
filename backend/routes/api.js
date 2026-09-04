const express = require('express');
const router = express.Router();
const db = require('../db');

// Helper to broadcast socket events if io instance is attached
function broadcast(req, event, data) {
  if (req.app.get('io')) {
    req.app.get('io').emit(event, data);
  }
}

// 1. Health check
router.get('/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    system: 'KisanFlow AI Procurement Engine',
    sihYear: 2026,
    activeNodes: 42,
    timestamp: new Date().toISOString()
  });
});

// 2. Mandis
router.get('/mandis', (req, res) => {
  const mandis = db.getMandis();
  res.json({ success: true, count: mandis.length, data: mandis });
});

// 3. Crops & MSP
router.get('/crops', (req, res) => {
  const crops = db.getCrops();
  res.json({ success: true, data: crops });
});

// 4. Get Tokens
router.get('/tokens', (req, res) => {
  const tokens = db.getTokens();
  res.json({ success: true, count: tokens.length, data: tokens });
});

// 5. Get Single Token
router.get('/tokens/:id', (req, res) => {
  const token = db.getTokenById(req.params.id);
  if (!token) {
    return res.status(404).json({ success: false, error: 'Token not found' });
  }
  res.json({ success: true, data: token });
});

// 6. Create Token (Farmer Booking Flow)
router.post('/tokens', (req, res) => {
  try {
    const { token, mandiUpdated } = db.createToken(req.body);
    
    // Broadcast real-time WebSocket event to all connected portals
    broadcast(req, 'token_created', { token, mandiUpdated });
    broadcast(req, 'analytics_updated', db.getAnalytics());

    res.status(201).json({
      success: true,
      message: 'Token booked successfully',
      data: token
    });
  } catch (err) {
    console.error("Error creating token:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 7. Gate Clearance (Mandi Operations ANPR clearance)
router.post('/tokens/:id/gate-clearance', (req, res) => {
  const token = db.getTokenById(req.params.id);
  if (!token) {
    return res.status(404).json({ success: false, error: 'Token not found' });
  }

  token.stage = 2; // Gate cleared
  token.gateCleared = true;
  token.gateClearedTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  broadcast(req, 'gate_cleared', { token });
  res.json({ success: true, message: 'Gate cleared successfully via ANPR', data: token });
});

// 8. Weighbridge & Quality Assay Processing (Generate J-Form DBT)
router.post('/tokens/:id/weighbridge', (req, res) => {
  try {
    const updatedToken = db.updateWeighbridge(req.params.id, req.body);
    if (!updatedToken) {
      return res.status(404).json({ success: false, error: 'Token not found' });
    }

    // Broadcast real-time updates to Farmer Portal & Central Command
    broadcast(req, 'weighbridge_updated', { token: updatedToken });
    broadcast(req, 'analytics_updated', db.getAnalytics());

    res.json({
      success: true,
      message: 'Weighbridge measurement recorded & J-Form DBT realized',
      data: updatedToken
    });
  } catch (err) {
    console.error("Error updating weighbridge:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 9. Central Command Analytics
router.get('/analytics/command', (req, res) => {
  const analytics = db.getAnalytics();
  const mandis = db.getMandis();
  const tokens = db.getTokens();

  res.json({
    success: true,
    data: {
      metrics: analytics,
      mandisSummary: mandis.map(m => ({
        id: m.id,
        name: m.name,
        waitMins: m.waitMins,
        queueAhead: m.queueAhead,
        occupancyPercent: Math.round((m.currentOccupancyTons / m.capacityTons) * 100)
      })),
      recentTokens: tokens.slice(0, 10)
    }
  });
});

module.exports = router;
