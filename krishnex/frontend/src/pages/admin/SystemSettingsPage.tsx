import React, { useEffect, useState } from 'react';
import { Card } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Settings, Save, Server } from 'lucide-react';
import { adminApi } from '../../services/adminApi';

export const SystemSettingsPage: React.FC = () => {
  const [season, setSeason] = useState('Rabi Season 2026');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  useEffect(() => { adminApi.getSettings().then((settings) => { const setting = settings.find((item) => item.key === 'procurement.season'); if (setting) setSeason(setting.value); }).catch(() => setError('Unable to load system settings.')); }, []);
  const save = async () => { try { await adminApi.updateSetting('procurement.season', season); setError(''); setMessage('Settings saved successfully.'); } catch { setError('Unable to save system settings.'); } };
  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-heading font-black text-white">Platform System Configuration</h1>
        <p className="text-xs text-slate-400">Configure global parameters, PFMS gateway API tokens, and AI load balancing heuristics.</p>
      </div>
      {message && <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{message}</p>}
      {error && <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>}

      <Card title="Global Platform Parameters">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <Input label="Platform Name" defaultValue="KrishNex" disabled />
          <Input label="Procurement Season" value={season} onChange={(event) => setSeason(event.target.value)} />
          <Input label="PFMS Gateway Endpoint" defaultValue="https://pfms.nic.in/api/v2/disburse" />
          <Input label="AgriStack State API Endpoint" defaultValue="https://agristack.gov.in/api/v1/farmer/kyc" />
        </div>

        <div className="mt-6 flex justify-end">
          <Button icon={<Save className="w-4 h-4" />} onClick={() => void save()}>Save Platform Settings</Button>
        </div>
      </Card>
    </div>
  );
};
