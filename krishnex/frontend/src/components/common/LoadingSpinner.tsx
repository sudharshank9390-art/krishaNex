import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingSpinner: React.FC<{ label?: string }> = ({ label = 'Loading KrishNex data...' }) => (
  <div className="flex flex-col items-center justify-center p-12 gap-3 text-slate-400">
    <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
    <span className="text-xs font-mono font-medium tracking-wider uppercase">{label}</span>
  </div>
);
