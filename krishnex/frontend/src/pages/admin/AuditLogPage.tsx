import React, { useEffect, useState } from 'react';
import { Card } from '../../components/common/Card';
import { Table, Column } from '../../components/common/Table';
import { FileText, ShieldCheck } from 'lucide-react';
import { adminApi, AuditRecord } from '../../services/adminApi';

export const AuditLogPage: React.FC = () => {
  const [auditLogs, setAuditLogs] = useState<AuditRecord[]>([]);
  const [error, setError] = useState('');
  useEffect(() => { adminApi.getAuditLogs().then(setAuditLogs).catch(() => setError('Unable to load audit logs.')); }, []);
  const columns: Column<AuditRecord>[] = [
    { header: 'Timestamp', cell: (r) => <span className="font-mono text-slate-400">{new Date(r.createdAt).toLocaleString()}</span> },
    { header: 'Actor', cell: (r) => <span className="font-bold text-white">{r.user?.name || 'System'}</span> },
    { header: 'Action Event', accessorKey: 'action', cell: (r) => <span className="font-mono font-bold text-emerald-400">{r.action}</span> },
    { header: 'Resource Affected', cell: (r) => <span>{r.entity} {r.entityId || ''}</span> },
    { header: 'Metadata', cell: (r) => <span className="font-mono text-slate-500">{r.metadata || '-'}</span> },
  ];

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-heading font-black text-white">System Audit Log & Security Trail</h1>
        <p className="text-xs text-slate-400">Immutable security telemetry for compliance and procurement auditing.</p>
      </div>

      <Card title="Security & Telemetry Audit Trail">
        {error && <p className="mb-4 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>}
        <Table columns={columns} data={auditLogs} keyExtractor={(r) => r.id} />
      </Card>
    </div>
  );
};
