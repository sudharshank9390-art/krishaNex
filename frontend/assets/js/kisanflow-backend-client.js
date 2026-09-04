/**
 * KisanFlow AI • Real-Time Backend Client SDK & Cross-Portal Sync
 * Connects Frontend HTML Portals with Node.js Express & Socket.io Server
 */

(function () {
  console.log("🌾 KisanFlow AI Backend Client Initializing...");

  const API_BASE = window.location.origin.startsWith('http') 
    ? window.location.origin 
    : 'http://localhost:3000';

  window.KisanFlowAPI = {
    apiBase: API_BASE,
    socket: null,
    isConnected: false,

    async getMandis() {
      try {
        const res = await fetch(`${API_BASE}/api/mandis`);
        return await res.json();
      } catch (err) {
        console.warn("Backend offline, using fallback mandi data");
        return null;
      }
    },

    async getTokens() {
      try {
        const res = await fetch(`${API_BASE}/api/tokens`);
        return await res.json();
      } catch (err) {
        console.warn("Backend offline, using local tokens data");
        return null;
      }
    },

    async bookToken(payload) {
      try {
        const res = await fetch(`${API_BASE}/api/tokens`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        return await res.json();
      } catch (err) {
        console.error("Error booking token:", err);
        return { success: false, error: err.message };
      }
    },

    async recordWeighbridge(tokenId, payload) {
      try {
        const res = await fetch(`${API_BASE}/api/tokens/${tokenId}/weighbridge`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        return await res.json();
      } catch (err) {
        console.error("Error recording weighbridge:", err);
        return { success: false, error: err.message };
      }
    },

    async getAnalytics() {
      try {
        const res = await fetch(`${API_BASE}/api/analytics/command`);
        return await res.json();
      } catch (err) {
        return null;
      }
    }
  };

  // Render floating connection indicator badge on bottom-right of page
  function renderConnectionBadge() {
    if (document.getElementById('kisanflow-backend-badge')) return;

    const badge = document.createElement('div');
    badge.id = 'kisanflow-backend-badge';
    badge.className = 'fixed bottom-4 right-4 z-[9999] bg-slate-900/90 backdrop-blur text-white px-3.5 py-2 rounded-xl text-xs font-mono border border-emerald-500/40 shadow-xl flex items-center gap-2 transition-all';
    badge.innerHTML = `
      <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" id="kisanflow-status-dot"></span>
      <span class="font-bold" id="kisanflow-status-text">Backend Connected</span>
      <span class="bg-emerald-500/20 text-emerald-300 text-[10px] px-1.5 py-0.5 rounded font-mono">PORT 3000</span>
    `;
    document.body.appendChild(badge);
  }

  // Load Socket.io script dynamically if missing
  function initSocketClient() {
    if (typeof io !== 'undefined') {
      setupSocket();
    } else {
      const script = document.createElement('script');
      script.src = "https://cdn.socket.io/4.7.5/socket.io.min.js";
      script.onload = setupSocket;
      script.onerror = () => console.warn("Socket.io CDN failed to load, API polling available");
      document.head.appendChild(script);
    }
  }

  function setupSocket() {
    try {
      const socket = io(API_BASE, {
        reconnectionAttempts: 5,
        timeout: 4000
      });

      window.KisanFlowAPI.socket = socket;

      socket.on('connect', () => {
        console.log("✅ Socket.io Connected to KisanFlow Server!");
        window.KisanFlowAPI.isConnected = true;
        const dot = document.getElementById('kisanflow-status-dot');
        const text = document.getElementById('kisanflow-status-text');
        if (dot) dot.className = "w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse";
        if (text) text.textContent = "Backend Live • Sync Active";
      });

      socket.on('disconnect', () => {
        console.warn("⚠️ Socket.io Disconnected");
        window.KisanFlowAPI.isConnected = false;
        const dot = document.getElementById('kisanflow-status-dot');
        const text = document.getElementById('kisanflow-status-text');
        if (dot) dot.className = "w-2.5 h-2.5 rounded-full bg-amber-500";
        if (text) text.textContent = "Backend Offline (Demo Mode)";
      });

      // Global Socket Event Broadcast Listeners
      socket.on('token_created', (data) => {
        console.log("🔔 [Socket Event] Token Created:", data);
        if (typeof showToast === 'function') {
          showToast(`New Token Reserved: ${data.token.tokenNumber} (${data.token.farmerName})`, 'verified', 'success');
        }
      });

      socket.on('weighbridge_updated', (data) => {
        console.log("🔔 [Socket Event] Weighbridge & J-Form Updated:", data);
        if (typeof showToast === 'function') {
          showToast(`DBT Realized: ${data.token.payout.formattedPayout} for ${data.token.farmerName}`, 'currency_rupee', 'success');
        }
      });

    } catch (e) {
      console.warn("Socket connection failed:", e);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      renderConnectionBadge();
      initSocketClient();
    });
  } else {
    renderConnectionBadge();
    initSocketClient();
  }
})();
