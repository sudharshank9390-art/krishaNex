import React, { useEffect, useState } from 'react';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { PaymentRecord, farmerApi } from '../../services/farmerApi';

export const PaymentHistoryPage: React.FC = () => {
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [error, setError] = useState('');
  useEffect(() => { farmerApi.getPayments().then(setPayments).catch(() => setError('Unable to load payment history.')); }, []);

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-heading font-black text-white">Direct Benefit Transfer (DBT) Payouts</h1>
        <p className="text-xs text-slate-400">Official government MSP bank transfer records and J-Form receipts.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card variant="accent">
          <div className="flex flex-col gap-1">
            <span className="text-xs text-slate-400 uppercase font-mono font-bold">Total Disbursed</span>
            <span className="text-3xl font-heading font-black text-emerald-400">₹{payments.reduce((total, payment) => total + payment.amount, 0).toLocaleString('en-IN')}</span>
            <span className="text-[11px] text-slate-400 mt-1">Live records from KrishNex</span>
          </div>
        </Card>
        <Card>
          <div className="flex flex-col gap-1">
            <span className="text-xs text-slate-400 uppercase font-mono font-bold">Target Bank Account</span>
            <span className="text-lg font-bold text-white">State Bank of India</span>
            <span className="text-xs text-slate-400 font-mono">Account ending in ****8819</span>
          </div>
        </Card>
        <Card>
          <div className="flex flex-col gap-1">
            <span className="text-xs text-slate-400 uppercase font-mono font-bold">Average Settlement Time</span>
            <span className="text-2xl font-heading font-black text-cyan-400">12.4 Mins</span>
            <span className="text-[11px] text-slate-400 mt-1">Post Weighbridge Scale Clearance</span>
          </div>
        </Card>
      </div>

      <Card title="Official Procurement Payout Ledger">
        {error && <p className="mb-4 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>}
        {payments.length === 0 && !error && <p className="text-sm text-slate-500">No payment records found yet.</p>}
        {payments.length > 0 && <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr className="border-b border-slate-200 text-xs uppercase text-slate-500"><th className="px-3 py-3">Token</th><th className="px-3 py-3">Produce</th><th className="px-3 py-3">Amount</th><th className="px-3 py-3">Status</th></tr></thead><tbody>{payments.map((payment) => <tr key={payment.id} className="border-b border-slate-100"><td className="px-3 py-3 font-mono font-bold">{payment.token.tokenNumber}</td><td className="px-3 py-3">{payment.token.booking.quantityQuintals} Qtl {payment.token.booking.crop.name}</td><td className="px-3 py-3 font-mono font-bold text-emerald-700">₹{payment.amount.toLocaleString('en-IN')}</td><td className="px-3 py-3"><Badge status={payment.status === 'PAID' ? 'PAID' : 'PAYMENT_PENDING'} /></td></tr>)}</tbody></table></div>}
      </Card>
    </div>
  );
};
