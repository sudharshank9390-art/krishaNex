import React from 'react';
import { clsx } from 'clsx';

interface StatCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  icon?: React.ReactNode;
  trend?: {
    value: string;
    isPositive?: boolean;
  };
  accentColor?: 'emerald' | 'cyan' | 'purple' | 'amber';
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  subtext,
  icon,
  trend,
  accentColor = 'emerald',
  className
}) => {
  const accentClasses = {
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    cyan: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  };

  return (
    <div className={clsx('bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden group hover:border-slate-700 transition-all', className)}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">{label}</span>
          <span className="text-3xl font-heading font-black text-white tracking-tight">{value}</span>
        </div>
        {icon && (
          <div className={clsx('w-12 h-12 rounded-xl border flex items-center justify-center transition-transform group-hover:scale-110', accentClasses[accentColor])}>
            {icon}
          </div>
        )}
      </div>

      {(subtext || trend) && (
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
          {subtext && <span className="text-slate-400 font-medium">{subtext}</span>}
          {trend && (
            <span className={clsx('font-mono font-bold px-2 py-0.5 rounded-md', trend.isPositive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400')}>
              {trend.value}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
