import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { Button } from '../../components/common/Button';
import { MOCK_MANDIS, MOCK_CROPS } from '../../utils/mockData';
import { Calendar, Truck, MapPin, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { farmerApi } from '../../services/farmerApi';
import type { Mandi } from '../../types';

export const BookingPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [cropKey, setCropKey] = useState(searchParams.get('crop') || 'wheat');
  const [quota, setQuota] = useState(parseFloat(searchParams.get('quota') || '110.0'));
  const [mandis, setMandis] = useState<Mandi[]>([]);
  const [selectedMandi, setSelectedMandi] = useState('');
  const [vehicleNo, setVehicleNo] = useState('PB-19-T-4912');
  const [slotTime, setSlotTime] = useState('10:30 AM – 11:30 AM');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const harvestId = searchParams.get('harvestId') || '';

  useEffect(() => {
    farmerApi.getMandis().then((availableMandis) => {
      setMandis(availableMandis);
      if (availableMandis[0]) setSelectedMandi(availableMandis[0].id);
    }).catch(() => setError('Unable to load available mandis. Please start the backend and refresh.'));
  }, []);

  const mandi = mandis.find(m => m.id === selectedMandi) || mandis[0];

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    try {
      let activeHarvestId = harvestId;
      if (!activeHarvestId) {
        const harvest = await farmerApi.createHarvest({ cropKey, quantityQuintals: quota, expectedDate: new Date().toISOString() });
        activeHarvestId = harvest.id;
      }
      if (!selectedMandi) throw new Error('No mandi selected');
      await farmerApi.createBooking({ harvestId: activeHarvestId, mandiId: selectedMandi, arrivalDate: new Date().toISOString(), slotTime, vehicleNo });
      navigate('/farmer/token');
    } catch {
      setError('Unable to create the booking. Please check your details and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-heading font-black text-white">AI Mandi Slot Reservation</h1>
        <p className="text-xs text-slate-400">Select optimal procurement mandi yard and time slot recommended by KrishNex balancing engine.</p>
      </div>

      <form onSubmit={handleBooking} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 flex flex-col gap-6">
          <Card title="Slot Reservation Details">
            <div className="flex flex-col gap-4">
              {error && <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select
                  label="Crop Type"
                  value={cropKey}
                  onChange={(e) => setCropKey(e.target.value)}
                  options={MOCK_CROPS.map(c => ({ value: c.key, label: c.name }))}
                />
                <Input
                  label="Harvest Quota (Quintals)"
                  type="number"
                  value={quota}
                  onChange={(e) => setQuota(parseFloat(e.target.value) || 0)}
                />
              </div>

              <Input
                label="Transport Vehicle Number"
                value={vehicleNo}
                onChange={(e) => setVehicleNo(e.target.value)}
                icon={<Truck className="w-4 h-4" />}
                helperText="ANPR Optical Camera will scan this plate at gate entry"
                required
              />

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300">Select Target Mandi Yard</label>
                <div className="grid grid-cols-1 gap-3">
                  {mandis.map((m) => (
                    <div
                      key={m.id}
                      onClick={() => setSelectedMandi(m.id)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                        selectedMandi === m.id
                          ? 'bg-emerald-950/60 border-emerald-500 text-white shadow-lg shadow-emerald-950/30'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2.5 rounded-lg border ${selectedMandi === m.id ? 'bg-emerald-600 text-white border-emerald-400' : 'bg-slate-900 border-slate-800 text-slate-400'}`}>
                          <MapPin className="w-5 h-5" />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-sm text-white">{m.name}</span>
                          <span className="text-xs text-slate-400">{m.district}, {m.state} • Wait time ~{m.waitMins} mins</span>
                        </div>
                      </div>
                      <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-md ${m.status === 'HEAVY_QUEUE' ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                        {m.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <Select
                label="Preferred Arrival Window"
                value={slotTime}
                onChange={(e) => setSlotTime(e.target.value)}
                options={[
                  { value: '09:00 AM – 10:00 AM', label: '09:00 AM – 10:00 AM (Morning Slot)' },
                  { value: '10:30 AM – 11:30 AM', label: '10:30 AM – 11:30 AM (Recommended - Low Queue)' },
                  { value: '01:00 PM – 02:00 PM', label: '01:00 PM – 02:00 PM (Afternoon Slot)' },
                  { value: '03:30 PM – 04:30 PM', label: '03:30 PM – 04:30 PM (Evening Slot)' },
                ]}
              />

              <Button type="submit" size="lg" isLoading={isSubmitting} icon={<CheckCircle2 className="w-5 h-5" />}>
                Confirm AI Slot & Generate QR Token
              </Button>
            </div>
          </Card>
        </div>

        {/* Mandi Intelligence Sidebar */}
        <div className="flex flex-col gap-4">
          <Card title="AI Predictive Telemetry" variant="cyan">
            <div className="flex flex-col gap-4 text-xs">
              <div className="flex items-center gap-2 text-cyan-400 font-bold">
                <Sparkles className="w-4 h-4" />
                <span>98.6% Load Balance Confidence</span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                KrishNex routing algorithm selected <strong className="text-white">{mandi?.name || 'the best available mandi'}</strong> to avoid congestion bottlenecks at adjacent yards.
              </p>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex flex-col gap-2 font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-500">Queue Ahead:</span>
                  <span className="text-white font-bold">{mandi?.queueAhead ?? 0} Vehicles</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Est. Dwell Time:</span>
                  <span className="text-emerald-400 font-bold">~{mandi?.waitMins ?? 0} Minutes</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Active Scales:</span>
                  <span className="text-cyan-400 font-bold">{mandi?.activeScales ?? 0} Scales Operational</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </form>
    </div>
  );
};
