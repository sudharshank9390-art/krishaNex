import React, { useEffect, useState } from 'react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { AlertTriangle, ShieldAlert, ArrowRight, CheckCircle2 } from 'lucide-react';
import { governmentApi, GovernmentAlert } from '../../services/governmentApi';

export const AlertsPage: React.FC = () => {
  const [alerts, setAlerts] = useState<GovernmentAlert[]>([]);
  const [error, setError] = useState('');
  useEffect(() => { governmentApi.getAlerts().then(setAlerts).catch(() => setError('Unable to load live alerts.')); }, []);
  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-heading font-black text-white">AI Mandi Load Balancer Alerts</h1>
        <p className="text-xs text-slate-400">Automated congestion detection and dynamic tractor queue rerouting.</p>
      </div>

      <div className="flex flex-col gap-4">
        {error && <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>}
        {alerts.map((alert) => <Card key={alert.mandiId} variant="bordered" className="border-amber-500/50 bg-slate-900">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-amber-500/10 rounded-xl text-amber-400 shrink-0">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="flex flex-col gap-2 flex-1">
              <div className="flex items-center justify-between">
                <h3 className="font-heading font-bold text-lg text-white">{alert.mandiName} - Elevated Congestion</h3>
                <span className="text-xs font-mono font-bold bg-amber-500/20 text-amber-400 px-2.5 py-1 rounded-full">{alert.severity}</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {alert.message}
              </p>
              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
                <Button size="sm" variant="secondary" icon={<ArrowRight className="w-4 h-4" />}>
                  Trigger Auto-Divert to Moga Silo 3
                </Button>
              </div>
            </div>
          </div>
        </Card>)}

        {alerts.length === 0 && !error && <Card variant="bordered" className="border-emerald-500/50 bg-slate-900">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400 shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div className="flex flex-col gap-2 flex-1">
              <div className="flex items-center justify-between">
                <h3 className="font-heading font-bold text-lg text-white">Barnala Central Mandi (Bay 02) — Optimal Flow</h3>
                <span className="text-xs font-mono font-bold bg-emerald-500/20 text-emerald-400 px-2.5 py-1 rounded-full">OPTIMAL (6 Vehicles)</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Weighbridge Scale 4 functioning at maximum throughput. Average dwell time stands at 18 minutes per tractor.
              </p>
            </div>
          </div>
        </Card>}
      </div>
    </div>
  );
};
