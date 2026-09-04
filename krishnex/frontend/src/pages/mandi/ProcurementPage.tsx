import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { MOCK_TOKENS } from '../../utils/mockData';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Banknote, FileCheck, CheckCircle2, Printer } from 'lucide-react';
import { mandiApi } from '../../services/mandiApi';

export const ProcurementPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const tokenId = searchParams.get('token') || 'KN-2026-A027';
  const [message, setMessage] = React.useState('');
  const [error, setError] = React.useState('');
  const token = MOCK_TOKENS[0];

  const finalize = async () => {
    setError('');
    try {
      await mandiApi.finalizeProcurement(tokenId);
      setMessage('Procurement approved and payment marked pending.');
    } catch {
      setError('Unable to finalize procurement. Complete weighment and quality testing first.');
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-heading font-black text-white">Procurement Settlement & Digital J-Form Receipt</h1>
        <p className="text-xs text-slate-400">Final J-Form clearance, PFMS bank transaction trigger, and grain silo dispatch.</p>
      </div>
      {message && <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{message}</p>}
      {error && <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card title="Official Government J-Form Procurement Receipt" variant="accent">
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <FileCheck className="w-6 h-6 text-emerald-400" />
                  <span className="font-heading font-bold text-lg text-white">Receipt #JFORM-2026-8819027</span>
                </div>
                <Badge status="PAID" />
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                <div>
                  <span className="text-slate-500 block">Farmer Name</span>
                  <span className="text-white font-bold text-sm">{token.farmerName}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">AgriStack ID</span>
                  <span className="text-white font-bold text-sm">{token.agriStackId}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Gross Weight</span>
                  <span className="text-white font-bold">14,850 kg</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Tare Weight</span>
                  <span className="text-white font-bold">3,850 kg</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Net Quintals</span>
                  <span className="text-emerald-400 font-bold text-sm">110.0 Qtl</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Moisture Assay</span>
                  <span className="text-cyan-400 font-bold text-sm">12.4% (Passed)</span>
                </div>
              </div>

              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex flex-col gap-2">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Base MSP (110.0 Qtl @ ₹2,275/Qtl):</span>
                  <span className="font-mono text-white">₹2,50,250</span>
                </div>
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Early Mandi Incentive Bonus (₹150/Qtl):</span>
                  <span className="font-mono text-emerald-400">+₹16,500</span>
                </div>
                <div className="pt-2 border-t border-slate-800 flex justify-between items-center">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">Total Disbursed Amount</span>
                  <span className="font-mono font-black text-emerald-400 text-xl">₹2,66,750</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex flex-wrap gap-3">
                  <Button size="lg" icon={<CheckCircle2 className="w-5 h-5" />} onClick={finalize}>Approve Procurement</Button>
                  <Button variant="outline" size="lg" icon={<Printer className="w-5 h-5" />} onClick={() => window.print()}>Print J-Form Tax Receipt</Button>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div>
          <Card title="PFMS Bank Gateway" variant="cyan">
            <div className="flex flex-col gap-3 text-xs">
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <CheckCircle2 className="w-4 h-4" /> PFMS Settlement Realized
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono text-[11px] flex flex-col gap-1 text-slate-400">
                <div><span className="text-slate-500">Txn ID:</span> PFMS-2026-0904-8819027</div>
                <div><span className="text-slate-500">Bank:</span> State Bank of India</div>
                <div><span className="text-slate-500">Account:</span> ****8819</div>
                <div><span className="text-slate-500">Status:</span> SUCCESS (0.4s)</div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
