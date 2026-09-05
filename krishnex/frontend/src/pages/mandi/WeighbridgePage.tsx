import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { MOCK_TOKENS } from '../../utils/mockData';
import { Card } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Scale, ArrowRight, CheckCircle2, ShieldCheck, Banknote } from 'lucide-react';
import { mandiApi } from '../../services/mandiApi';

export const WeighbridgePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tokenNum = searchParams.get('token') || 'KN-2026-A027';
  const token = MOCK_TOKENS.find(t => t.tokenNumber === tokenNum) || MOCK_TOKENS[0];

  const [grossWeightKg, setGrossWeightKg] = useState(14850);
  const [tareWeightKg, setTareWeightKg] = useState(3850);
  const [moisturePercent, setMoisturePercent] = useState(12.4);
  const [operatorName] = useState('Rajesh Verma (Nodal Officer)');
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const netWeightKg = Math.max(0, grossWeightKg - tareWeightKg);
  const netQuintals = netWeightKg / 100;
  const basePayout = netQuintals * token.mspRate;
  const bonusPayout = netQuintals * token.bonusRate;
  const totalPayout = basePayout + bonusPayout;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await mandiApi.recordWeighment(tokenNum, grossWeightKg, tareWeightKg);
      setIsSuccess(true);
      setTimeout(() => navigate(`/mandi/quality?token=${encodeURIComponent(tokenNum)}`), 700);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unable to record weighment. Verify the token and try again.';
      setError(msg);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-heading font-black text-white">Weighbridge Electronic Scale Operator Terminal</h1>
        <p className="text-xs text-slate-400">Record electronic scale gross/tare weights and auto-calculate net produce quintals.</p>
      </div>

      {isSuccess && (
        <div className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 p-4 rounded-xl text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5" /> Weighment recorded! Net Quintals: {netQuintals.toFixed(1)} Qtl. Advancing to Quality QC Assay...
        </div>
      )}
      {error && <div className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-xl text-sm">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <Card title={`Active Weighment Session: ${token.tokenNumber}`} subtitle={`Farmer: ${token.farmerName} • Plate: ${token.vehicleNo}`}>
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Gross Vehicle Weight (kg)"
                    type="number"
                    value={grossWeightKg}
                    onChange={(e) => setGrossWeightKg(parseFloat(e.target.value) || 0)}
                    icon={<Scale className="w-4 h-4 text-emerald-400" />}
                    required
                  />
                  <Input
                    label="Tare Empty Trolley Weight (kg)"
                    type="number"
                    value={tareWeightKg}
                    onChange={(e) => setTareWeightKg(parseFloat(e.target.value) || 0)}
                    icon={<Scale className="w-4 h-4 text-cyan-400" />}
                    required
                  />
                </div>

                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex flex-col gap-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Calculated Net Weight (kg)</span>
                    <span className="font-mono font-bold text-white">{netWeightKg.toLocaleString()} kg</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-bold uppercase tracking-wider">Calculated Net Produce Quintals</span>
                    <span className="font-mono font-black text-emerald-400 text-lg">{netQuintals.toFixed(2)} Qtl</span>
                  </div>
                </div>

                <Input
                  label="Spectrometry Moisture Content (%)"
                  type="number"
                  step="0.1"
                  value={moisturePercent}
                  onChange={(e) => setMoisturePercent(parseFloat(e.target.value) || 0)}
                  helperText="Government Upper Threshold Limit: 14.0%"
                  required
                />

                <Button type="submit" size="lg" icon={<ArrowRight className="w-5 h-5" />}>
                  Save Weighment & Proceed to Moisture QC
                </Button>
              </div>
            </Card>
          </form>
        </div>

        {/* Live Calculation Sidebar */}
        <div className="flex flex-col gap-4">
          <Card title="Instant Payout Preview" variant="accent">
            <div className="flex flex-col gap-4 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Base MSP (₹{token.mspRate}/Qtl):</span>
                <span className="font-mono font-bold text-white">₹{basePayout.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Government Bonus (₹{token.bonusRate}/Qtl):</span>
                <span className="font-mono font-bold text-emerald-400">+₹{bonusPayout.toLocaleString('en-IN')}</span>
              </div>
              <div className="pt-2 border-t border-slate-800 flex justify-between items-center">
                <span className="font-bold text-white uppercase tracking-wider">Total DBT Settlement</span>
                <span className="font-mono font-black text-emerald-300 text-xl">₹{Math.round(totalPayout).toLocaleString('en-IN')}</span>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-[11px] text-slate-400 font-mono">
                Operator: {operatorName}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
