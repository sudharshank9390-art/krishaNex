import React from 'react';
import { Link } from 'react-router-dom';
import { MOCK_TOKENS, MOCK_MANDIS } from '../../utils/mockData';
import { StatCard } from '../../components/common/StatCard';
import { Card } from '../../components/common/Card';
import { Table, Column } from '../../components/common/Table';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Scale, Truck, CheckSquare, ShieldCheck, Banknote, ListOrdered, ArrowRight } from 'lucide-react';

export const MandiDashboardPage: React.FC = () => {
  const mandi = MOCK_MANDIS[0];

  const columns: Column<typeof MOCK_TOKENS[0]>[] = [
    {
      header: 'Token Pass',
      accessorKey: 'tokenNumber',
      cell: (row) => <span className="font-mono font-bold text-white">{row.tokenNumber}</span>
    },
    {
      header: 'Farmer Name',
      accessorKey: 'farmerName',
      cell: (row) => <span className="font-bold text-slate-200">{row.farmerName}</span>
    },
    {
      header: 'Vehicle No',
      accessorKey: 'vehicleNo',
      cell: (row) => <span className="font-mono text-slate-400">{row.vehicleNo}</span>
    },
    {
      header: 'Produce',
      cell: (row) => <span>{row.quota} Qtl ({row.cropName.split(' ')[0]})</span>
    },
    {
      header: 'Slot Window',
      accessorKey: 'slotTime'
    },
    {
      header: 'Status',
      cell: (row) => <Badge status={row.status} />
    },
    {
      header: 'Actions',
      cell: (row) => (
        <Link to={`/mandi/weighbridge?token=${row.tokenNumber}`}>
          <Button size="sm" variant={row.status === 'ARRIVED' ? 'primary' : 'outline'}>
            Weigh Scale
          </Button>
        </Link>
      )
    }
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">{mandi.code}</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold">ANPR Gate Active</span>
          </div>
          <h1 className="text-2xl font-heading font-black text-white">{mandi.name}</h1>
          <p className="text-xs text-slate-400">Nodal Weighbridge Operator Terminal • Rajesh Verma (Admin)</p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/mandi/verify">
            <Button icon={<CheckSquare className="w-4 h-4" />}>Verify Token Pass</Button>
          </Link>
          <Link to="/mandi/weighbridge">
            <Button variant="secondary" icon={<Scale className="w-4 h-4" />}>Weigh Scale</Button>
          </Link>
        </div>
      </div>

      {/* Operator KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Tractors in Yard Queue"
          value={mandi.queueAhead}
          subtext="Lane 02 & Lane 04 Active"
          icon={<Truck className="w-6 h-6 text-amber-400" />}
          accentColor="amber"
        />
        <StatCard
          label="Average Turnaround Dwell"
          value={`${mandi.waitMins} Mins`}
          subtext="-82% below baseline"
          icon={<Scale className="w-6 h-6 text-emerald-400" />}
          accentColor="emerald"
        />
        <StatCard
          label="Moisture QC Pass Rate"
          value="99.8%"
          subtext="Spectrometry Certified"
          icon={<ShieldCheck className="w-6 h-6 text-cyan-400" />}
          accentColor="cyan"
        />
        <StatCard
          label="Today Disbursed"
          value="₹41.97 Cr"
          subtext="PFMS Bank Clearing"
          icon={<Banknote className="w-6 h-6 text-purple-400" />}
          accentColor="purple"
        />
      </div>

      {/* Queue Table */}
      <Card title="Live Mandi Queue & Gate Verification Feed" action={
        <Link to="/mandi/queue">
          <Button size="sm" variant="ghost" icon={<ArrowRight className="w-4 h-4" />}>View All Queue</Button>
        </Link>
      }>
        <Table columns={columns} data={MOCK_TOKENS} keyExtractor={(row) => row.id} />
      </Card>
    </div>
  );
};
