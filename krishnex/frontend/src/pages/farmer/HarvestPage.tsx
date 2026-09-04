import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { Button } from '../../components/common/Button';
import { MOCK_CROPS } from '../../utils/mockData';
import { Sprout, Calculator, ArrowRight, Banknote } from 'lucide-react';
import { farmerApi } from '../../services/farmerApi';

export const HarvestPage: React.FC = () => {
  const navigate = useNavigate();
  const [cropKey, setCropKey] = useState('wheat');
  const [acres, setAcres] = useState(12.5);
  const [yieldPerAcre, setYieldPerAcre] = useState(8.8);

  const selectedCrop = MOCK_CROPS.find(c => c.key === cropKey) || MOCK_CROPS[0];
  const totalQuintals = acres * yieldPerAcre;
  const basePayout = totalQuintals * selectedCrop.msp;
  const bonusPayout = totalQuintals * selectedCrop.bonus;
  const totalPayout = basePayout + bonusPayout;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleProceed = async () => {
    setIsSubmitting(true);
    setError('');
    try {
      const harvest = await farmerApi.createHarvest({ cropKey, quantityQuintals: totalQuintals, expectedDate: new Date().toISOString() });
      navigate(`/farmer/booking?harvestId=${harvest.id}&crop=${cropKey}&quota=${totalQuintals}`);
    } catch {
      setError('Unable to save this harvest. Please confirm the backend is running and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-heading font-black text-white">Harvest Quantity & Quota Calculator</h1>
        <p className="text-xs text-slate-400">Estimate total harvest produce, official MSP government rates, and bonus eligibility.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card title="Harvest Yield Calculator">
            <div className="flex flex-col gap-5">
              {error && <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>}
              <Select
                label="Select Crop Variety"
                value={cropKey}
                onChange={(e) => setCropKey(e.target.value)}
                options={MOCK_CROPS.map(c => ({ value: c.key, label: `${c.name} — MSP ₹${c.msp}/Qtl` }))}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Harvest Area (Acres)"
                  type="number"
                  step="0.5"
                  value={acres}
                  onChange={(e) => setAcres(parseFloat(e.target.value) || 0)}
                  icon={<Sprout className="w-4 h-4 text-emerald-400" />}
                />
                <Input
                  label="Expected Yield (Quintals / Acre)"
                  type="number"
                  step="0.1"
                  value={yieldPerAcre}
                  onChange={(e) => setYieldPerAcre(parseFloat(e.target.value) || 0)}
                  icon={<Calculator className="w-4 h-4 text-cyan-400" />}
                />
              </div>

              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex flex-col gap-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Official Government MSP Rate</span>
                  <span className="font-mono font-bold text-white">₹{selectedCrop.msp.toLocaleString('en-IN')} / Qtl</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Early Mandi Delivery Incentive Bonus</span>
                  <span className="font-mono font-bold text-emerald-400">+₹{selectedCrop.bonus.toLocaleString('en-IN')} / Qtl</span>
                </div>
                <div className="pt-2 border-t border-slate-800 flex justify-between items-center">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">Effective Realized Rate</span>
                  <span className="font-mono font-black text-emerald-400 text-base">₹{(selectedCrop.msp + selectedCrop.bonus).toLocaleString('en-IN')} / Qtl</span>
                </div>
              </div>

              <Button onClick={handleProceed} size="lg" isLoading={isSubmitting} icon={<ArrowRight className="w-5 h-5" />}>
                Proceed to Mandi Slot Booking ({totalQuintals.toFixed(1)} Qtl)
              </Button>
            </div>
          </Card>
        </div>

        {/* Calculation Summary Card */}
        <div>
          <Card title="Calculated Summary" variant="accent">
            <div className="flex flex-col gap-6 text-center">
              <div className="flex flex-col gap-1">
                <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">Total Calculated Quota</span>
                <span className="text-4xl font-heading font-black text-white">{totalQuintals.toFixed(1)} <span className="text-base font-normal text-slate-400">Qtl</span></span>
              </div>

              <div className="p-4 bg-emerald-950/60 border border-emerald-700/50 rounded-xl flex flex-col gap-1">
                <span className="text-xs font-mono text-emerald-400 uppercase font-bold">Estimated Bank DBT Payout</span>
                <span className="text-2xl font-heading font-black text-emerald-300">₹{totalPayout.toLocaleString('en-IN')}</span>
                <span className="text-[10px] text-slate-400 mt-1">Direct Bank Settlement to SBI Account ****8819</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
