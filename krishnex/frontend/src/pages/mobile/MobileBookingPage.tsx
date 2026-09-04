import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Calendar, CheckCircle2 } from 'lucide-react';

export const MobileBookingPage: React.FC = () => {
  const navigate = useNavigate();

  const handle1TapBook = () => {
    navigate('/mobile/token');
  };

  return (
    <div className="flex flex-col gap-6 max-w-sm mx-auto">
      <div className="text-center flex flex-col gap-1">
        <h1 className="text-2xl font-heading font-black text-white">1-Tap Mobile Slot Booking</h1>
        <p className="text-xs text-slate-400">Simplified smartphone booking for registered crop quota.</p>
      </div>

      <Card variant="accent" className="flex flex-col gap-4">
        <div className="flex flex-col gap-1 text-center">
          <span className="text-xs text-slate-400 font-mono font-bold uppercase">Pre-Loaded Quota</span>
          <span className="text-3xl font-heading font-black text-white">110.0 Quintals</span>
          <span className="text-xs text-emerald-400 font-bold">Wheat (Sharbati Grade-A)</span>
        </div>

        <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs flex flex-col gap-2 text-slate-300 font-mono">
          <div className="flex justify-between">
            <span>Recommended Mandi:</span>
            <span className="text-white font-bold">Barnala Yard Bay 02</span>
          </div>
          <div className="flex justify-between">
            <span>Optimal Window:</span>
            <span className="text-emerald-400 font-bold">10:30 AM – 11:30 AM</span>
          </div>
        </div>

        <Button onClick={handle1TapBook} size="lg" icon={<CheckCircle2 className="w-5 h-5" />}>
          Confirm 1-Tap Booking
        </Button>
      </Card>
    </div>
  );
};
