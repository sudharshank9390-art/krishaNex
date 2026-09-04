import React from 'react';
import { Shield, Sparkles } from 'lucide-react';

export const GovernmentBanner: React.FC = () => {
  return (
    <div className="w-full bg-gradient-to-r from-emerald-950 via-slate-900 to-cyan-950 border-b border-emerald-800/40 px-4 py-2 text-xs font-mono flex items-center justify-between text-slate-300">
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Shield className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span className="font-bold text-white tracking-wide">KrishNex • National Agricultural Procurement Platform</span>
          <span className="hidden md:inline text-emerald-400/80">• AgriStack & PFMS Interoperable</span>
        </div>
        <div className="flex items-center gap-4 text-[11px]">
          <span className="hidden sm:flex items-center gap-1 text-cyan-400 font-semibold">
            <Sparkles className="w-3 h-3" />
            AI Mandi Queue Load Balancing Active
          </span>
          <span className="text-slate-400">Toll Free: 1800-KRISHNEX</span>
        </div>
      </div>
    </div>
  );
};
