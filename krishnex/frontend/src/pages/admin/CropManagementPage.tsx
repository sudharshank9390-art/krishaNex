import React, { useEffect, useState } from 'react';
import { Card } from '../../components/common/Card';
import { Table, Column } from '../../components/common/Table';
import { Button } from '../../components/common/Button';
import { Sprout, Plus } from 'lucide-react';
import { adminApi } from '../../services/adminApi';
import type { Crop } from '../../types';

export const CropManagementPage: React.FC = () => {
  const [crops, setCrops] = useState<Crop[]>([]);
  const [error, setError] = useState('');
  useEffect(() => { adminApi.getCrops().then(setCrops).catch(() => setError('Unable to load crop catalog.')); }, []);
  const columns: Column<Crop>[] = [
    { header: 'Crop Name', accessorKey: 'name', cell: (r) => <span className="font-bold text-white">{r.name}</span> },
    { header: 'Category', accessorKey: 'category', cell: (r) => <span className="font-mono text-cyan-400">{r.category}</span> },
    { header: 'Official MSP Rate', cell: (r) => <span className="font-mono font-bold text-white">₹{r.msp.toLocaleString('en-IN')} / Qtl</span> },
    { header: 'Incentive Bonus', cell: (r) => <span className="font-mono font-bold text-emerald-400">+₹{r.bonus.toLocaleString('en-IN')} / Qtl</span> },
    { header: 'Effective Rate', cell: (r) => <span className="font-mono font-black text-emerald-300">₹{(r.msp + r.bonus).toLocaleString('en-IN')} / Qtl</span> },
    { header: 'Actions', cell: () => <Button size="sm" variant="outline">Edit MSP</Button> }
  ];

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-heading font-black text-white">Crop MSP & Bonus Catalog</h1>
          <p className="text-xs text-slate-400">Configure Minimum Support Price (MSP) rates and government bonus incentives.</p>
        </div>
        <Button icon={<Plus className="w-4 h-4" />}>Add Crop Variety</Button>
      </div>

      <Card title="Active Government MSP Schedule">
        {error && <p className="mb-4 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>}
        <Table columns={columns} data={crops} keyExtractor={(r) => r.id} />
      </Card>
    </div>
  );
};
