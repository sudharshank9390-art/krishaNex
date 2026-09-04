import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { AuthLayout } from '../layouts/AuthLayout';
import { ProtectedRoute } from './ProtectedRoute';

// Public Pages
import { LandingPage } from '../pages/LandingPage';
import { LoginPage } from '../pages/auth/LoginPage';
import { RegisterPage } from '../pages/auth/RegisterPage';
import { DemoAccountsPage } from '../pages/auth/DemoAccountsPage';

// Farmer Pages
import { FarmerDashboardPage } from '../pages/farmer/FarmerDashboardPage';
import { FarmerProfilePage } from '../pages/farmer/FarmerProfilePage';
import { HarvestPage } from '../pages/farmer/HarvestPage';
import { BookingPage } from '../pages/farmer/BookingPage';
import { QRTokenPage } from '../pages/farmer/QRTokenPage';
import { TokenTrackerPage } from '../pages/farmer/TokenTrackerPage';
import { PaymentHistoryPage } from '../pages/farmer/PaymentHistoryPage';

// Mandi Pages
import { MandiDashboardPage } from '../pages/mandi/MandiDashboardPage';
import { QueueManagementPage } from '../pages/mandi/QueueManagementPage';
import { TokenVerificationPage } from '../pages/mandi/TokenVerificationPage';
import { WeighbridgePage } from '../pages/mandi/WeighbridgePage';
import { QualityTestingPage } from '../pages/mandi/QualityTestingPage';
import { ProcurementPage } from '../pages/mandi/ProcurementPage';

// Government Pages
import { CentralCommandPage } from '../pages/government/CentralCommandPage';
import { MandiMonitoringPage } from '../pages/government/MandiMonitoringPage';
import { ProcurementAnalyticsPage } from '../pages/government/ProcurementAnalyticsPage';
import { PaymentAnalyticsPage } from '../pages/government/PaymentAnalyticsPage';
import { AlertsPage } from '../pages/government/AlertsPage';

// Mobile Pages
import { MobileSuitePage } from '../pages/mobile/MobileSuitePage';
import { USSDSimulatorPage } from '../pages/mobile/USSDSimulatorPage';
import { MobileBookingPage } from '../pages/mobile/MobileBookingPage';
import { MobileTokenPage } from '../pages/mobile/MobileTokenPage';

// Admin Pages
import { UserManagementPage } from '../pages/admin/UserManagementPage';
import { MandiManagementPage } from '../pages/admin/MandiManagementPage';
import { CropManagementPage } from '../pages/admin/CropManagementPage';
import { AuditLogPage } from '../pages/admin/AuditLogPage';
import { SystemSettingsPage } from '../pages/admin/SystemSettingsPage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Auth Layout Pages */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/demo-accounts" element={<DemoAccountsPage />} />
      </Route>

      {/* Main Layout Pages */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<LandingPage />} />

        <Route element={<ProtectedRoute allowedRoles={['FARMER']} />}>
          <Route path="/farmer" element={<FarmerDashboardPage />} />
          <Route path="/farmer/profile" element={<FarmerProfilePage />} />
          <Route path="/farmer/harvest" element={<HarvestPage />} />
          <Route path="/farmer/booking" element={<BookingPage />} />
          <Route path="/farmer/token" element={<QRTokenPage />} />
          <Route path="/farmer/tracker" element={<TokenTrackerPage />} />
          <Route path="/farmer/payments" element={<PaymentHistoryPage />} />
        </Route>

        {/* Mandi Operations Desk */}
        <Route element={<ProtectedRoute allowedRoles={['MANDI_OPERATOR']} />}>
          <Route path="/mandi" element={<MandiDashboardPage />} />
          <Route path="/mandi/queue" element={<QueueManagementPage />} />
          <Route path="/mandi/verify" element={<TokenVerificationPage />} />
          <Route path="/mandi/weighbridge" element={<WeighbridgePage />} />
          <Route path="/mandi/quality" element={<QualityTestingPage />} />
          <Route path="/mandi/procurement" element={<ProcurementPage />} />
        </Route>

        {/* Government Central Command */}
        <Route element={<ProtectedRoute allowedRoles={['GOVERNMENT_ADMIN']} />}>
          <Route path="/government" element={<CentralCommandPage />} />
          <Route path="/government/mandis" element={<MandiMonitoringPage />} />
          <Route path="/government/procurement" element={<ProcurementAnalyticsPage />} />
          <Route path="/government/payments" element={<PaymentAnalyticsPage />} />
          <Route path="/government/alerts" element={<AlertsPage />} />
        </Route>

        {/* Mobile & USSD Suite */}
        <Route element={<ProtectedRoute allowedRoles={['FARMER']} />}>
          <Route path="/mobile" element={<MobileSuitePage />} />
          <Route path="/mobile/ussd" element={<USSDSimulatorPage />} />
          <Route path="/mobile/booking" element={<MobileBookingPage />} />
          <Route path="/mobile/token" element={<MobileTokenPage />} />
        </Route>

        {/* Super Admin Suite */}
        <Route element={<ProtectedRoute allowedRoles={['SUPER_ADMIN']} />}>
          <Route path="/admin" element={<UserManagementPage />} />
          <Route path="/admin/users" element={<UserManagementPage />} />
          <Route path="/admin/mandis" element={<MandiManagementPage />} />
          <Route path="/admin/crops" element={<CropManagementPage />} />
          <Route path="/admin/audit" element={<AuditLogPage />} />
          <Route path="/admin/settings" element={<SystemSettingsPage />} />
        </Route>
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
