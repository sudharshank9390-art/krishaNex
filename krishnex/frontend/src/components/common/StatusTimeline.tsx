import React from 'react';
import { clsx } from 'clsx';
import { TokenStatus } from '../../types';
import { CheckCircle2, Clock, Truck, Scale, ShieldCheck, Banknote } from 'lucide-react';

interface Stage {
  key: TokenStatus;
  title: string;
  desc: string;
  icon: React.ReactNode;
}

const STAGES: Stage[] = [
  { key: 'BOOKED', title: '1. AI Slot Reserved', desc: 'Quota & mandi slot confirmed', icon: <Clock className="w-4 h-4" /> },
  { key: 'ARRIVED', title: '2. Optical ANPR Gate', desc: 'Tractor scanned at Mandi Gate 02', icon: <Truck className="w-4 h-4" /> },
  { key: 'WEIGHED', title: '3. Electronic Scale', desc: 'Gross & Tare weight logged', icon: <Scale className="w-4 h-4" /> },
  { key: 'QUALITY_CHECKED', title: '4. Spectrometry Assay', desc: 'Moisture & dockage verified', icon: <ShieldCheck className="w-4 h-4" /> },
  { key: 'PAID', title: '5. Direct DBT Realized', desc: 'J-Form & bank payout settled', icon: <Banknote className="w-4 h-4" /> },
];

export const StatusTimeline: React.FC<{ currentStatus: TokenStatus }> = ({ currentStatus }) => {
  const getStageIndex = (status: TokenStatus) => {
    switch (status) {
      case 'GENERATED':
      case 'BOOKED': return 0;
      case 'ARRIVED': return 1;
      case 'WEIGHED': return 2;
      case 'QUALITY_CHECKED':
      case 'PROCURED':
      case 'PAYMENT_PENDING': return 3;
      case 'PAID': return 4;
      default: return 0;
    }
  };

  const currentIndex = getStageIndex(currentStatus);

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="hidden md:flex items-center justify-between relative">
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-800 -translate-y-1/2 z-0" />
        <div 
          className="absolute top-1/2 left-0 h-1 bg-emerald-500 -translate-y-1/2 z-0 transition-all duration-500"
          style={{ width: `${(currentIndex / (STAGES.length - 1)) * 100}%` }}
        />

        {STAGES.map((stage, idx) => {
          const isDone = idx <= currentIndex;
          const isCurrent = idx === currentIndex;

          return (
            <div key={stage.key} className="relative z-10 flex flex-col items-center gap-2 group text-center max-w-[120px]">
              <div
                className={clsx(
                  'w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all',
                  isDone ? 'bg-emerald-600 border-emerald-400 text-white shadow-lg shadow-emerald-950/40' : 'bg-slate-900 border-slate-700 text-slate-500',
                  isCurrent && 'ring-4 ring-emerald-500/30 animate-pulse'
                )}
              >
                {isDone ? <CheckCircle2 className="w-5 h-5" /> : stage.icon}
              </div>
              <span className={clsx('text-xs font-bold font-heading', isDone ? 'text-white' : 'text-slate-500')}>
                {stage.title}
              </span>
            </div>
          );
        })}
      </div>

      {/* Mobile Stacked List */}
      <div className="flex flex-col gap-3 md:hidden">
        {STAGES.map((stage, idx) => {
          const isDone = idx <= currentIndex;
          return (
            <div key={stage.key} className={clsx('p-3 rounded-xl border flex items-center gap-3', isDone ? 'bg-emerald-950/30 border-emerald-700/50 text-emerald-300' : 'bg-slate-900 border-slate-800 text-slate-500')}>
              <div className={clsx('w-8 h-8 rounded-full flex items-center justify-center border', isDone ? 'bg-emerald-600 border-emerald-400 text-white' : 'bg-slate-800 border-slate-700 text-slate-500')}>
                {isDone ? <CheckCircle2 className="w-4 h-4" /> : stage.icon}
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-white">{stage.title}</span>
                <span className="text-[11px] text-slate-400">{stage.desc}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
