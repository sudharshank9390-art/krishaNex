import React from 'react';
import { Sprout, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-slate-950 border-t border-slate-800/80 py-8 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
            <Sprout className="w-4 h-4" />
          </div>
          <span className="font-heading font-bold text-white">KrishNex • Agricultural Procurement Platform</span>
        </div>

        <div className="flex flex-wrap items-center gap-6 text-[11px] font-mono text-slate-400">
          <span className="flex items-center gap-1 text-emerald-400 font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" /> AgriStack Verified
          </span>
          <span>e-NAM Interoperable</span>
          <span>PFMS Bank Protocol Verified</span>
          <span>© 2026 KrishNex Inc.</span>
        </div>
      </div>
    </footer>
  );
};
