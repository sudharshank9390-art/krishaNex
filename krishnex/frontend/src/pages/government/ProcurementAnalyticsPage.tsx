import React, { useEffect, useState } from 'react';
import { Card } from '../../components/common/Card';
import { StatCard } from '../../components/common/StatCard';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Scale, BarChart3, TrendingUp } from 'lucide-react';
import { governmentApi } from '../../services/governmentApi';

export const ProcurementAnalyticsPage: React.FC = () => {
  const [liveData, setLiveData] = useState<{ date: string; tons: number }[]>([]);
  useEffect(() => { governmentApi.getTrends().then(setLiveData).catch(() => undefined); }, []);
  const data = liveData.length ? liveData : [
    { day: 'Mon', wheat: 3400, paddy: 1200 },
    { day: 'Tue', wheat: 4100, paddy: 1500 },
    { day: 'Wed', wheat: 3800, paddy: 1100 },
    { day: 'Thu', wheat: 5200, paddy: 1800 },
    { day: 'Fri', wheat: 6100, paddy: 2100 },
  ];

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-heading font-black text-white">State Procurement Analytics</h1>
        <p className="text-xs text-slate-400">Daily grain arrival trends, MSP realization, and volume forecasts.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Total Procured Volume" value="18,450 Tons" subtext="Rabi Season 2026" icon={<Scale className="w-6 h-6 text-emerald-400" />} />
        <StatCard label="Weekly Growth" value="+14.2%" subtext="Arrival velocity" icon={<TrendingUp className="w-6 h-6 text-cyan-400" />} />
        <StatCard label="Average Moisture" value="12.2%" subtext="FAQ Standard Pass" icon={<BarChart3 className="w-6 h-6 text-purple-400" />} />
      </div>

      <Card title="Daily Procurement Arrival Trend (Metric Tons)">
        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis dataKey="day" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }} />
              <Bar dataKey={liveData.length ? 'tons' : 'wheat'} fill="#15803d" name="Procurement (Tons)" radius={[6, 6, 0, 0]} />
              {!liveData.length && <Bar dataKey="paddy" fill="#0ea5e9" name="Paddy (Tons)" radius={[6, 6, 0, 0]} />}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};
