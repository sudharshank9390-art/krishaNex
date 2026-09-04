# KrishNex • Smart Agriculture. Seamless Procurement.

**KrishNex** is a full-stack, AI-assisted agricultural procurement platform connecting Farmers, Mandi Operators, Government Administrators, and System Administrators across India.

---

## 🌾 Platform Portals

1. **Farmer Portal**: Harvest yield calculation, AI-driven slot allocation, digital QR token generation (e.g. `KN-2026-A027`), live queue tracking, and direct benefit transfer (DBT) realization.
2. **Mandi Operations Desk**: Live optical ANPR gate verification, gross & tare weighbridge scale calibration, spectrometry moisture assay testing, and instant digital J-Form issuing.
3. **Statewide Central Command**: Statewide procurement heatmaps, silo occupancy tracking, idling diesel reduction analytics, and multi-mandi dynamic load balancing.
4. **Mobile & USSD Suite**: Lightweight smartphone web app and feature-phone USSD simulator fallback for low-connectivity rural regions.
5. **Super Admin Suite**: Role-based access control (RBAC), mandi node configuration, crop MSP catalog management, and audit log telemetry.

---

## 🚀 Quick Start Instructions (VS Code)

### 1. Prerequisites
- Node.js (v18.0.0 or higher)
- npm (v9.0.0 or higher)

### Start from the workspace root
The repository root now includes scripts that work from PowerShell without changing directories:

```powershell
# Install backend and frontend dependencies
npm --prefix backend install
npm --prefix krishnex/frontend install

# Start the backend in one terminal
npm run dev:backend

# Start the frontend in a second terminal
npm run dev:frontend
```

Use `http://localhost:5173` for the frontend and `http://localhost:3000/api/health` to check the API.

### Smoke test
With the backend running, execute this from the workspace root:

```powershell
npm run test:smoke
```

### Optional PostgreSQL service
SQLite is the default zero-setup development database. To start the included PostgreSQL service:

```powershell
docker compose up -d postgres
```

The current Prisma schema is configured for SQLite fallback. Keep using `backend/.env` for local SQLite development; PostgreSQL provider migration is a deployment configuration step.

### 2. Frontend Development Server
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start Vite local server
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 👤 Development Demo Accounts

| Role | Email | Password | Access Level |
|---|---|---|---|
| **Farmer** | `farmer@krishnex.app` | `KrishNex2026!` | Harvest booking & token tracking |
| **Mandi Operator** | `mandi@krishnex.app` | `KrishNex2026!` | Weighbridge, quality assay, queue desk |
| **Government Admin** | `gov@krishnex.app` | `KrishNex2026!` | Statewide analytics & load balancing |
| **Super Admin** | `admin@krishnex.app` | `KrishNex2026!` | Full platform & user management |

---

## 🎨 Technology Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, React Router v6, Lucide Icons, Recharts, TanStack Query, Axios.
- **Backend**: Node.js, Express, TypeScript, Prisma ORM, SQLite fallback, PostgreSQL Compose service, JWT, Zod, Socket.IO.
