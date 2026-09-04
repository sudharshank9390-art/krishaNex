import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { TokenBooking } from '../../types';
import { Badge } from './Badge';
import { ShieldCheck, Truck, Scale, CheckCircle2 } from 'lucide-react';

export const QRTokenCard: React.FC<{ token: TokenBooking }> = ({ token }) => {
  return (
    <div className="bg-slate-900 border-2 border-emerald-500/40 rounded-2xl p-6 shadow-2xl shadow-emerald-950/30 flex flex-col gap-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 bg-emerald-600 text-white font-mono font-bold text-[10px] uppercase px-3 py-1 rounded-bl-xl tracking-wider">
        KrishNex Verified
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-slate-800">
        <div className="bg-white p-3 rounded-2xl shadow-inner border border-slate-300 shrink-0">
          <QRCodeSVG value={`KRISHNEX-${token.tokenNumber}`} size={120} level="H" />
        </div>
        <div className="flex flex-col gap-1 text-center sm:text-left">
          <Badge status={token.status} />
          <h2 className="text-3xl font-heading font-black text-white tracking-tight mt-1">{token.tokenNumber}</h2>
          <p className="text-xs text-slate-400 font-medium">{token.mandiName}</p>
          <span className="text-xs font-mono font-bold text-emerald-400 mt-1">Slot: {token.slotTime} ({token.slotDate})</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-xs">
        <div className="flex flex-col gap-0.5">
          <span className="text-slate-500 font-mono uppercase font-bold text-[10px]">Farmer</span>
          <span className="text-white font-bold">{token.farmerName}</span>
          <span className="text-slate-400 text-[11px]">{token.agriStackId}</span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-slate-500 font-mono uppercase font-bold text-[10px]">Vehicle</span>
          <span className="text-white font-bold">{token.vehicleNo}</span>
          <span className="text-slate-400 text-[11px]">Tractor Trolley</span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-slate-500 font-mono uppercase font-bold text-[10px]">Produce / Quota</span>
          <span className="text-white font-bold">{token.quota} Quintals</span>
          <span className="text-slate-400 text-[11px]">{token.cropName}</span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-slate-500 font-mono uppercase font-bold text-[10px]">Estimated Payout</span>
          <span className="text-emerald-400 font-black text-sm">{token.payment?.formattedPayout || `₹${(token.quota * (token.mspRate + token.bonusRate)).toLocaleString('en-IN')}`}</span>
          <span className="text-slate-400 text-[11px]">Direct DBT to Bank</span>
        </div>
      </div>

      <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-xl flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>AgriStack KYC Encrypted</span>
        </div>
        <span className="font-mono text-[11px]">PFMS Gateway Active</span>
      </div>
    </div>
  );
};
