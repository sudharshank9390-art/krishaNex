import React, { useEffect, useState } from 'react';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { farmerApi, BookingRecord } from '../../services/farmerApi';
import { subscribeToProcurementUpdates } from '../../services/realtime';

export const TokenTrackerPage: React.FC = () => {
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadBookings = () => farmerApi.getBookings().then(setBookings).catch(() => setError('Unable to load live token status.'));
    loadBookings();
    return subscribeToProcurementUpdates(loadBookings);
  }, []);

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-heading font-black text-white">Live Queue Telemetry & Token Tracking</h1>
        <p className="text-xs text-slate-400">Real-time status tracking for active and past procurement tokens.</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {error && <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>}
        {!error && bookings.length === 0 && <p className="text-sm text-slate-500">No live bookings found yet.</p>}
        {bookings.map((booking) => (
          <Card key={booking.token.id} variant={booking.token.status === 'PAID' ? 'accent' : 'default'}>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center font-mono font-bold text-emerald-400 text-sm">
                  {booking.token.tokenNumber.split('-').pop()}
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="font-heading font-bold text-lg text-white">{booking.token.tokenNumber}</span>
                    <Badge status={booking.token.status} />
                  </div>
                  <span className="text-xs text-slate-400">{booking.mandi.name} • Slot: {booking.slotTime}</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-6 text-xs font-mono text-slate-300">
                <div>
                  <span className="text-slate-500 block">Produce</span>
                  <span className="font-bold text-white">{booking.quantityQuintals} Qtl ({booking.crop.name.split(' ')[0]})</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Net Payout</span>
                  <span className="font-bold text-emerald-400">Pending Weighment</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Vehicle</span>
                  <span className="font-bold text-white">Vehicle details saved</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
