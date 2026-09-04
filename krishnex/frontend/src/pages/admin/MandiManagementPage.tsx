import React, { useEffect, useState } from 'react';
import { Card } from '../../components/common/Card';
import { Table, Column } from '../../components/common/Table';
import { Button } from '../../components/common/Button';
import { Building2, Plus } from 'lucide-react';
import { adminApi } from '../../services/adminApi';
import type { Mandi } from '../../types';

export const MandiManagementPage: React.FC = () => {
  const [mandis, setMandis] = useState<Mandi[]>([]);
  const [error, setError] = useState('');
  useEffect(() => { adminApi.getMandis().then(setMandis).catch(() => setError('Unable to load mandi registry.')); }, []);
  const columns: Column<Mandi>[] = [
    { header: 'Mandi Name', accessorKey: 'name', cell: (r) => <span className="font-bold text-white">{r.name}</span> },
    { header: 'Code', accessorKey: 'code', cell: (r) => <span className="font-mono text-cyan-400">{r.code}</span> },
    { header: 'District', accessorKey: 'district' },
    { header: 'Capacity (Tons)', cell: (r) => <span className="font-mono">{r.capacityTons.toLocaleString()} Tons</span> },
    { header: 'Scales', cell: (r) => r.activeScales ?? 0 },
    { header: 'Status', cell: (r) => <span className="font-mono font-bold text-emerald-400">{r.status}</span> },
    { header: 'Actions', cell: () => <Button size="sm" variant="outline">Configure</Button> }
  ];

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-heading font-black text-white">Mandi Node Registry & Setup</h1>
          <p className="text-xs text-slate-400">Configure connected mandi yards, electronic weighbridge scales, and capacity limits.</p>
        </div>
        <Button icon={<Plus className="w-4 h-4" />}>Add Mandi Yard</Button>
      </div>

      <Card title="Connected Mandi Nodes">
        {error && <p className="mb-4 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>}
        <Table columns={columns} data={mandis} keyExtractor={(r) => r.id} />
      </Card>
    </div>
  );
};
