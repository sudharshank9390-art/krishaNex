import React, { useEffect, useState } from 'react';
import { Card } from '../../components/common/Card';
import { Table, Column } from '../../components/common/Table';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { UserPlus, UserCheck } from 'lucide-react';
import { adminApi, AdminUser } from '../../services/adminApi';
import type { UserRole } from '../../types';

export const UserManagementPage: React.FC = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [error, setError] = useState('');
  useEffect(() => { adminApi.getUsers().then(setUsers).catch(() => setError('Unable to load the live user directory.')); }, []);

  const changeRole = async (user: AdminUser) => {
    const roles: UserRole[] = ['FARMER', 'MANDI_OPERATOR', 'GOVERNMENT_ADMIN', 'SUPER_ADMIN'];
    const nextRole = roles[(roles.indexOf(user.role) + 1) % roles.length];
    try { await adminApi.updateUserRole(user.id, nextRole); setUsers((current) => current.map((item) => item.id === user.id ? { ...item, role: nextRole } : item)); } catch { setError('Role update failed.'); }
  };

  const columns: Column<AdminUser>[] = [
    { header: 'Full Name', accessorKey: 'name', cell: (r) => <span className="font-bold text-white">{r.name}</span> },
    { header: 'Email Address', accessorKey: 'email', cell: (r) => <span className="font-mono text-cyan-400">{r.email}</span> },
    { header: 'Assigned Role', cell: (r) => <span className="font-mono font-bold text-emerald-400">{r.role}</span> },
    { header: 'Mobile Number', accessorKey: 'phone' },
    { header: 'Account Status', cell: () => <Badge variant="emerald">ACTIVE & VERIFIED</Badge> },
    {
      header: 'Actions',
      cell: (r) => <Button size="sm" variant="outline" onClick={() => void changeRole(r)}>Cycle Role</Button>
    }
  ];

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-heading font-black text-white">Platform User Directory & RBAC</h1>
          <p className="text-xs text-slate-400">Manage user accounts, portal roles, and access credentials.</p>
        </div>
        <Button icon={<UserPlus className="w-4 h-4" />}>Add New User</Button>
      </div>

      <Card title="Registered User Accounts">
        {error && <p className="mb-4 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>}
        <Table columns={columns} data={users} keyExtractor={(r) => r.id} />
      </Card>
    </div>
  );
};
