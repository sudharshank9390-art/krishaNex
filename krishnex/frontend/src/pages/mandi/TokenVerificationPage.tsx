import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { TokenBooking } from '../../types';
import { mandiApi, MandiToken } from '../../services/mandiApi';
import { Card } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { QRTokenCard } from '../../components/common/QRTokenCard';
import { Search, QrCode, ArrowRight, CheckCircle2 } from 'lucide-react';

export const TokenVerificationPage: React.FC = () => {
  const navigate = useNavigate();
  const [tokenInput, setTokenInput] = useState('KN-2026-A027');
  const [foundToken, setFoundToken] = useState<TokenBooking | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true); setError('');
    try {
      const token: MandiToken = await mandiApi.verifyToken(tokenInput.trim());
      setFoundToken({ id: token.id, tokenNumber: token.tokenNumber, farmerName: token.booking.farmer.name, agriStackId: 'Verified farmer record', vehicleNo: token.booking.vehicleNo, quota: token.booking.quantityQuintals, cropKey: token.booking.crop.key, cropName: token.booking.crop.name, mspRate: token.booking.crop.msp, bonusRate: token.booking.crop.bonus, mandiId: token.booking.mandi.id, mandiName: token.booking.mandi.name, slotDate: new Date(token.booking.arrivalDate).toLocaleDateString('en-IN'), slotTime: token.booking.slotTime, status: token.status, gateCleared: token.status !== 'BOOKED', createdAt: token.booking.arrivalDate });
    } catch (err: unknown) {
      setFoundToken(null);
      setError(err instanceof Error ? err.message : 'Token not found or unavailable for verification.');
    } finally { setIsLoading(false); }
  };

  const handleProceed = () => {
    if (!foundToken) return;
    navigate(`/mandi/weighbridge?token=${foundToken.tokenNumber}`);
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-heading font-black text-white">Token Pass Scan & Verification</h1>
        <p className="text-xs text-slate-400">Scan or input farmer QR token pass to verify AgriStack identity and proceed to weighbridge.</p>
      </div>

      <Card title="Token Scanner & Manual Input">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              label="Enter Token Number"
              placeholder="e.g. KN-2026-A027"
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              icon={<QrCode className="w-4 h-4" />}
              required
            />
          </div>
          <div className="flex items-end">
            <Button type="submit" isLoading={isLoading} icon={<Search className="w-4 h-4" />}>
              Verify Token
            </Button>
          </div>
        </form>
      </Card>

      {error && <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>}

      {foundToken && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <QRTokenCard token={foundToken} />
          </div>

          <div className="flex flex-col gap-4">
            <Card title="Verification Action" variant="accent">
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
                  <CheckCircle2 className="w-4 h-4" /> AgriStack Identity Verified
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Tractor <strong>{foundToken.vehicleNo}</strong> matched with registered quota of <strong>{foundToken.quota} Quintals</strong> {foundToken.cropName}.
                </p>

                <Button onClick={handleProceed} size="lg" icon={<ArrowRight className="w-4 h-4" />}>
                  Proceed to Weighbridge Scale
                </Button>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};
