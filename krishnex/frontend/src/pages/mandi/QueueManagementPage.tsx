import React, { useState } from 'react';
import { MOCK_TOKENS } from '../../utils/mockData';
import { Card } from '../../components/common/Card';
import { Table, Column } from '../../components/common/Table';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Search, Filter, CheckCircle2 } from 'lucide-react';

export const QueueManagementPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('ALL');

  const filtered = MOCK_TOKENS.filter((t) => {
    const matchesSearch = t.tokenNumber.toLowerCase().includes(search.toLowerCase()) || t.farmerName.toLowerCase().includes(search.toLowerCase()) || t.vehicleNo.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'ALL' || t.status === filter;
    return matchesSearch && matchesFilter;
  });

  const columns: Column<typeof MOCK_TOKENS[0]>[] = [
    {
      header: 'Token Pass',
      accessorKey: 'tokenNumber',
      cell: (row) => <span className="font-mono font-bold text-white">{row.tokenNumber}</span>
    },
    { header: 'Farmer', accessorKey: 'farmerName' },
    { header: 'Vehicle Plate', accessorKey: 'vehicleNo', cell: (r) => <span className="font-mono text-cyan-400">{r.vehicleNo}</span> },
    { header: 'Quota', cell: (r) => <span>{r.quota} Qtl ({r.cropName.split(' ')[0]})</span> },
    { header: 'Arrival Window', accessorKey: 'slotTime' },
    { header: 'Stage Status', cell: (r) => <Badge status={r.status} /> },
    {
      header: 'ANPR Gate Status',
      cell: (r) => (
        <span className={`text-xs font-mono font-bold ${r.gateCleared ? 'text-emerald-400' : 'text-amber-400'}`}>
          {r.gateCleared ? `Cleared (${r.weighment?.timestamp || '10:32 AM'})` : 'Awaiting Gate Arrival'}
        </span>
      )
    }
  ];

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-heading font-black text-white">ANPR Optical Gate Queue Management</h1>
        <p className="text-xs text-slate-400">Live incoming tractor vehicle stream and optical plate clearance control.</p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="w-full sm:w-72">
          <Input
            placeholder="Search Token, Farmer, Plate..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={<Search className="w-4 h-4" />}
          />
        </div>

        <div className="flex items-center gap-2">
          {['ALL', 'BOOKED', 'ARRIVED', 'WEIGHED', 'PAID'].map((f) => (
            <Button
              key={f}
              size="sm"
              variant={filter === f ? 'primary' : 'outline'}
              onClick={() => setFilter(f)}
            >
              {f}
            </Button>
          ))}
        </div>
      </div>

      <Card title="Tractor Queue Control Desk">
        <Table columns={columns} data={filtered} keyExtractor={(r) => r.id} />
      </Card>
    </div>
  );
};
