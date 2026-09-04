import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import type { TokenBooking } from '../../types';
import { farmerApi } from '../../services/farmerApi';
import { QRTokenCard } from '../../components/common/QRTokenCard';
import { StatusTimeline } from '../../components/common/StatusTimeline';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Download, Share2, Printer, CheckCircle } from 'lucide-react';

export const QRTokenPage: React.FC = () => {
  const { user } = useAuth();
  const [token, setToken] = useState<TokenBooking | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    farmerApi.getBookings().then((bookings) => {
      const booking = bookings[0];
      if (!booking) return;
      setToken({
        id: booking.token.id,
        tokenNumber: booking.token.tokenNumber,
        farmerName: user?.name || 'Farmer',
        agriStackId: user?.agriStackId || 'Pending profile verification',
        vehicleNo: booking.vehicleNo,
        quota: booking.quantityQuintals,
        cropKey: booking.crop.key,
        cropName: booking.crop.name,
        mspRate: booking.crop.msp,
        bonusRate: booking.crop.bonus,
        mandiId: booking.mandi.id,
        mandiName: booking.mandi.name,
        slotDate: new Date(booking.arrivalDate).toLocaleDateString('en-IN'),
        slotTime: booking.slotTime,
        status: booking.token.status,
        gateCleared: booking.token.status !== 'BOOKED',
        createdAt: booking.arrivalDate,
      });
    }).catch(() => setError('Unable to load your live procurement token.'));
  }, [user]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-black text-white">Digital Procurement Token Pass</h1>
          <p className="text-xs text-slate-400">Present this QR token pass at the Mandi ANPR entrance gate for instant clearance.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handlePrint} icon={<Printer className="w-4 h-4" />}>Print Pass</Button>
          <Button variant="secondary" size="sm" icon={<Share2 className="w-4 h-4" />}>Send SMS Pass</Button>
        </div>
      </div>

      {error && <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>}
      {!token && !error && <p className="text-sm text-slate-500">Loading your latest procurement token...</p>}

      {token && <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 flex flex-col gap-6">
          <QRTokenCard token={token} />

          <Card title="Live Stage Status">
            <StatusTimeline currentStatus={token.status} />
          </Card>
        </div>

        <div className="flex flex-col gap-4">
          <Card title="Gate Entry Instructions">
            <div className="flex flex-col gap-3 text-xs text-slate-400">
              <div className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Drive tractor trolley into <strong>Lane 02</strong> at Barnala Central Mandi.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Optical ANPR scanner will automatically detect plate <strong>PB-19-T-4912</strong>.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Proceed directly to Weighbridge Scale #04 for electronic gross weighing.</span>
              </div>
            </div>
          </Card>
        </div>
      </div>}
    </div>
  );
};
