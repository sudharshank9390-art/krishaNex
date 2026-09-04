import React, { useEffect, useState } from 'react';
import { MOCK_METRICS, MOCK_MANDIS } from '../../utils/mockData';
import { StatCard } from '../../components/common/StatCard';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts';
import { Shield, Activity, Truck, Banknote, AlertTriangle, Scale } from 'lucide-react';
import { governmentApi, GovernmentMetrics, MandiLoad } from '../../services/governmentApi';

export const CentralCommandPage: React.FC = () => {
  const [metrics, setMetrics] = useState<GovernmentMetrics | null>(null);
  const [mandiLoad, setMandiLoad] = useState<MandiLoad[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([governmentApi.getMetrics(), governmentApi.getMandiLoad()]).then(([liveMetrics, liveLoad]) => {
      setMetrics(liveMetrics); setMandiLoad(liveLoad);
    }).catch(() => setError('Live dashboard data is unavailable. Start the backend to connect metrics.'));
  }, []);

  const chartData = (mandiLoad.length ? mandiLoad : MOCK_MANDIS).map(m => ({
    name: m.name.split(' ')[0],
    occupancy: 'utilizationPercent' in m ? m.utilizationPercent : Math.round((m.currentOccupancyTons / m.capacityTons) * 100),
    wait: m.waitMins,
  }));

  const pieData = [
    { name: 'Wheat (Sharbati)', value: 65, color: '#22c55e' },
    { name: 'Paddy (Basmati)', value: 20, color: '#0ea5e9' },
    { name: 'Mustard (Pusa)', value: 15, color: '#a855f7' },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* State Command Header */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-emerald-950 border border-purple-800/40 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-purple-400 uppercase tracking-wider">State Agricultural Procurement Command</span>
            <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-mono font-bold">42 / 42 Silos Online</span>
          </div>
          <h1 className="text-2xl font-heading font-black text-white">Punjab & Haryana Agri-Cluster Command</h1>
          <p className="text-xs text-slate-400">Suresh Sharma, IAS • State Nodal Procurement Controller</p>
        </div>

        <div className="flex items-center gap-2 bg-slate-950 px-3 py-2 rounded-xl border border-slate-800 text-xs font-mono">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-white font-bold">Live AI Load Balancer Active</span>
        </div>
      </div>

      {/* State KPIs */}
      {error && <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Registered Farmers"
          value={(metrics?.totalRegisteredFarmers ?? 0).toLocaleString()}
          subtext="100% AgriStack Validated"
          icon={<Activity className="w-6 h-6 text-purple-400" />}
          accentColor="purple"
        />
        <StatCard
          label="Today Procured Produce"
          value={`${(metrics?.todayProcuredTons ?? 0).toLocaleString()} Tons`}
          subtext="Wheat MSP Baseline"
          icon={<Scale className="w-6 h-6 text-emerald-400" />}
          accentColor="emerald"
        />
        <StatCard
          label="DBT Direct Disbursed"
          value={`₹${((metrics?.todayDisbursed ?? 0) / 10000000).toFixed(2)} Cr`}
          subtext="Instant PFMS Settlement"
          icon={<Banknote className="w-6 h-6 text-cyan-400" />}
          accentColor="cyan"
          trend={{ value: '99.8% SLA Pass', isPositive: true }}
        />
        <StatCard
          label="Tractors in Transit"
          value={metrics?.activeBookings ?? 0}
          subtext="GPS ANPR Monitored"
          icon={<Truck className="w-6 h-6 text-amber-400" />}
          accentColor="amber"
        />
      </div>

      {/* Analytics Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card title="Mandi Yard Capacity Utilization (%)" className="lg:col-span-2">
          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} unit="%" />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }} />
                <Bar dataKey="occupancy" fill="#15803d" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Crop Volume Share">
          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
};
