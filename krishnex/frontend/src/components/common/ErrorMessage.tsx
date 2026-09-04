import React from 'react';
import { AlertCircle } from 'lucide-react';

export const ErrorMessage: React.FC<{ message: string }> = ({ message }) => (
  <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-4 flex items-center gap-3 text-rose-300 text-xs font-semibold">
    <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
    <span>{message}</span>
  </div>
);
