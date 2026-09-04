import React, { useEffect, useState } from 'react';
import { Card } from '../../components/common/Card';
import { Table, Column } from '../../components/common/Table';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { MapPin, Activity, AlertTriangle } from 'lucide-react';
import { governmentApi, MandiLoad } from '../../services/governmentApi';

export const MandiMonitoringPage: React.FC = () => {
  const [mandis, setMandis] = useState<MandiLoad[]>([]);
  const [error, setError] = useState('');
  useEffect(() => { governmentApi.getMandiLoad().then(setMandis).catch(() => setError('Unable to load live mandi telemetry.')); }, []);
  const columns: Column<MandiLoad>[] = [
    { header: 'Mandi Node', accessorKey: 'name', cell: (r) => <span className="font-bold text-white">{r.name}</span> },
    { header: 'Code', accessorKey: 'code', cell: (r) => <span className="font-mono text-cyan-400">{r.code}</span> },
    { header: 'District', accessorKey: 'district' },
    { header: 'Active Scales', accessorKey: 'activeScales' },
    { header: 'Est. Dwell Time', cell: (r) => <span className="font-mono font-bold text-emerald-400">~{r.waitMins} Mins</span> },
    { header: 'Queue Ahead', cell: (r) => <span className="font-mono">{r.queueAhead} Vehicles</span> },
    {
      header: 'Capacity Utilization',
      cell: (r) => {
        const pct = Math.round((r.currentOccupancyTons / r.capacityTons) * 100);
        return (
          <div className="flex items-center gap-2">
            <div className="w-24 bg-slate-800 rounded-full h-2 overflow-hidden">
              <div className={`h-full ${pct > 80 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${pct}%` }} />
            </div>
            <span className="font-mono font-bold text-xs">{pct}%</span>
          </div>
        );
      }
    },
    {
      header: 'Actions',
      cell: (r) => (
        <Button size="sm" variant={r.status === 'HEAVY_QUEUE' ? 'danger' : 'outline'}>
          {r.status === 'HEAVY_QUEUE' ? 'Rebalance Queue' : 'Monitor Node'}
        </Button>
      )
    }
  ];

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-heading font-black text-white">Mandi Node Live Monitoring</h1>
        <p className="text-xs text-slate-400">Statewide telemetry of connected grain yards, scales, and congestion metrics.</p>
      </div>

      <Card title="State Grain Terminal Registry">
        {error && <p className="mb-4 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>}
        <Table columns={columns} data={mandis} keyExtractor={(r) => r.id} />
      </Card>
    </div>
  );
};
