import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { MOCK_TOKENS, MOCK_MANDIS, MOCK_CROPS } from '../../utils/mockData';
import { Card } from '../../components/common/Card';
import { StatCard } from '../../components/common/StatCard';
import { QRTokenCard } from '../../components/common/QRTokenCard';
import { StatusTimeline } from '../../components/common/StatusTimeline';
import { Button } from '../../components/common/Button';
import { Sprout, Calendar, QrCode, ArrowRight, Banknote, Clock, MapPin, Scale } from 'lucide-react';

export const FarmerDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const activeToken = MOCK_TOKENS[0]; // Active token (A-027)

  return (
    <div className="flex flex-col gap-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-cyan-950 border border-emerald-800/40 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">AgriStack ID: {user?.agriStackId || 'PB-2026-8819'}</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold">KYC Verified</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-black text-white">
            Welcome back, {user?.name || 'Ramesh Kumar'}
          </h1>
          <p className="text-xs text-slate-400">
            Rabi Season 2026 • Barnala Cluster Yard Bay 02 Allocated
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/farmer/booking">
            <Button icon={<Calendar className="w-4 h-4" />}>Book New Slot</Button>
          </Link>
          <Link to="/farmer/token">
            <Button variant="outline" icon={<QrCode className="w-4 h-4" />}>View QR Pass</Button>
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Quota Allocated"
          value="110.0 Qtl"
          subtext="Wheat (Sharbati Grade-A)"
          icon={<Sprout className="w-6 h-6 text-emerald-400" />}
          accentColor="emerald"
        />
        <StatCard
          label="Realized DBT Payout"
          value="₹2,66,750"
          subtext="Direct Bank Settlement"
          icon={<Banknote className="w-6 h-6 text-cyan-400" />}
          accentColor="cyan"
          trend={{ value: '100% Disbursed', isPositive: true }}
        />
        <StatCard
          label="Estimated Wait Time"
          value="18 Mins"
          subtext="Queue Ahead: 6 Tractors"
          icon={<Clock className="w-6 h-6 text-amber-400" />}
          accentColor="amber"
        />
        <StatCard
          label="Assigned Mandi Yard"
          value="Barnala"
          subtext="Bay 02 Scale 4"
          icon={<MapPin className="w-6 h-6 text-purple-400" />}
          accentColor="purple"
        />
      </div>

      {/* Active Token Status & Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <Card title="Active Procurement Journey Status" subtitle={`Token: ${activeToken.tokenNumber} • Mandi Slot: ${activeToken.slotTime}`}>
            <div className="flex flex-col gap-6">
              <StatusTimeline currentStatus={activeToken.status} />

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div>
                  <span className="text-slate-500 block">Gross Scale Weight</span>
                  <span className="font-mono font-bold text-white text-sm">14,850 kg</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Tare Vehicle Weight</span>
                  <span className="font-mono font-bold text-white text-sm">3,850 kg</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Net Produce Quintals</span>
                  <span className="font-mono font-bold text-emerald-400 text-sm">110.0 Qtl</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Moisture Assay</span>
                  <span className="font-mono font-bold text-cyan-400 text-sm">12.4% (Optimal)</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link to="/farmer/harvest">
              <Card variant="bordered" className="hover:border-emerald-500/40 cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400"><Sprout className="w-5 h-5" /></div>
                  <div className="flex flex-col">
                    <span className="font-bold text-sm text-white">Harvest Quota</span>
                    <span className="text-xs text-slate-400">Calculate yield</span>
                  </div>
                </div>
              </Card>
            </Link>
            <Link to="/farmer/tracker">
              <Card variant="bordered" className="hover:border-cyan-500/40 cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-cyan-500/10 rounded-xl text-cyan-400"><Clock className="w-5 h-5" /></div>
                  <div className="flex flex-col">
                    <span className="font-bold text-sm text-white">Live Queue</span>
                    <span className="text-xs text-slate-400">Track 6 tractors</span>
                  </div>
                </div>
              </Card>
            </Link>
            <Link to="/farmer/payments">
              <Card variant="bordered" className="hover:border-purple-500/40 cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-purple-500/10 rounded-xl text-purple-400"><Banknote className="w-5 h-5" /></div>
                  <div className="flex flex-col">
                    <span className="font-bold text-sm text-white">DBT Receipts</span>
                    <span className="text-xs text-slate-400">View J-Form</span>
                  </div>
                </div>
              </Card>
            </Link>
          </div>
        </div>

        {/* Digital Pass Sidebar */}
        <div className="flex flex-col gap-4">
          <QRTokenCard token={activeToken} />
        </div>
      </div>
    </div>
  );
};
