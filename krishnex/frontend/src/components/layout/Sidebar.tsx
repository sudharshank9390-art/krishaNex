import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, 
  Sprout, 
  Calendar, 
  QrCode, 
  Activity, 
  Banknote, 
  Scale, 
  ListOrdered, 
  CheckSquare, 
  ShieldCheck, 
  BarChart3, 
  AlertTriangle, 
  Users, 
  Building2, 
  Settings, 
  FileText,
  Smartphone,
  Radio
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const role = user?.role || 'FARMER';

  const farmerNav = [
    { to: '/farmer', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/farmer/harvest', label: 'Harvest Quota', icon: Sprout },
    { to: '/farmer/booking', label: 'Book Slot', icon: Calendar },
    { to: '/farmer/token', label: 'Digital QR Token', icon: QrCode },
    { to: '/farmer/tracker', label: 'Live Queue Tracker', icon: Activity },
    { to: '/farmer/payments', label: 'DBT Payment History', icon: Banknote },
  ];

  const mandiNav = [
    { to: '/mandi', label: 'Operations Desk', icon: LayoutDashboard },
    { to: '/mandi/queue', label: 'ANPR Gate Queue', icon: ListOrdered },
    { to: '/mandi/verify', label: 'Token Verification', icon: CheckSquare },
    { to: '/mandi/weighbridge', label: 'Weighbridge Scale', icon: Scale },
    { to: '/mandi/quality', label: 'Moisture Assay QC', icon: ShieldCheck },
    { to: '/mandi/procurement', label: 'Procurement Settlement', icon: Banknote },
  ];

  const govNav = [
    { to: '/government', label: 'State Central Command', icon: LayoutDashboard },
    { to: '/government/mandis', label: 'Mandi Node Telemetry', icon: Activity },
    { to: '/government/procurement', label: 'Procurement Analytics', icon: BarChart3 },
    { to: '/government/payments', label: 'DBT Disbursements', icon: Banknote },
    { to: '/government/alerts', label: 'Load Balancer Alerts', icon: AlertTriangle },
  ];

  const adminNav = [
    { to: '/admin/users', label: 'User Directory & Roles', icon: Users },
    { to: '/admin/mandis', label: 'Mandi Node Registry', icon: Building2 },
    { to: '/admin/crops', label: 'Crop MSP & Bonus Catalog', icon: Sprout },
    { to: '/admin/audit', label: 'System Audit Trail', icon: FileText },
    { to: '/admin/settings', label: 'Platform Configuration', icon: Settings },
  ];

  const mobileNav = [
    { to: '/mobile', label: 'Mobile App Suite', icon: Smartphone },
    { to: '/mobile/ussd', label: 'USSD Simulator (*99#)', icon: Radio },
    { to: '/mobile/booking', label: '1-Tap Booking', icon: Calendar },
    { to: '/mobile/token', label: 'Offline Pass', icon: QrCode },
  ];

  let items = farmerNav;
  if (role === 'MANDI_OPERATOR') items = mandiNav;
  if (role === 'GOVERNMENT_ADMIN') items = govNav;
  if (role === 'SUPER_ADMIN') items = adminNav;

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 p-4 shrink-0 flex flex-col justify-between hidden md:flex">
      <div className="flex flex-col gap-6">
        <div className="px-3 py-2 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">Portal View</span>
          <span className="text-xs font-bold text-emerald-400 font-mono">{role.replace('_', ' ')}</span>
        </div>

        <nav className="flex flex-col gap-1">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/farmer' || item.to === '/mandi' || item.to === '/government' || item.to === '/mobile'}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950/40 border border-emerald-500/30'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="pt-4 border-t border-slate-800 flex flex-col gap-2 text-[11px] text-slate-500 font-mono">
        <div className="flex items-center justify-between">
          <span>KrishNex Core</span>
          <span className="text-emerald-400 font-bold">ONLINE</span>
        </div>
        <span>PFMS & AgriStack Compliant</span>
      </div>
    </aside>
  );
};
