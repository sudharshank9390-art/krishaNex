import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { User, ShieldCheck, MapPin, Building, CreditCard, Save } from 'lucide-react';
import { farmerApi } from '../../services/farmerApi';

export const FarmerProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const districtState = String(form.get('districtState') || '').split(',').map((value) => value.trim());
    try {
      await farmerApi.updateProfile({
        village: String(form.get('village') || ''), district: districtState[0] || '', state: districtState[1] || '',
        landSizeAcres: Number.parseFloat(String(form.get('landSizeAcres') || '0')), bankName: String(form.get('bankName') || ''),
        accountLast4: String(form.get('accountLast4') || '').slice(-4), ifsc: String(form.get('ifsc') || ''),
      });
      setError('');
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setError('Unable to save profile. Please confirm the backend is running and try again.');
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-heading font-black text-white">Farmer Profile & AgriStack Credentials</h1>
        <p className="text-xs text-slate-400">Manage land record validation, Aadhaar KYC, and direct PFMS bank details.</p>
      </div>

      {saved && (
        <div className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 px-4 py-3 rounded-xl text-xs font-semibold flex items-center gap-2">
          <ShieldCheck className="w-4 h-4" /> Profile details saved and re-certified with AgriStack Revenue Database.
        </div>
      )}
      {error && <div className="rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>}

      <form onSubmit={handleSave} className="flex flex-col gap-6">
        <Card title="Personal & Land Ownership Details">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Full Name" defaultValue={user?.name || "Ramesh Kumar"} icon={<User className="w-4 h-4" />} />
            <Input label="Mobile Number" defaultValue="+91 98765 43210" />
            <Input label="AgriStack ID" defaultValue="PB-2026-8819" icon={<ShieldCheck className="w-4 h-4" />} disabled helperText="Verified with Revenue Portal" />
            <Input label="Land Size (Acres)" name="landSizeAcres" defaultValue="12.5" />
            <Input label="Village" name="village" defaultValue="Barnala Kalan" icon={<MapPin className="w-4 h-4" />} />
            <Input label="District & State" name="districtState" defaultValue="Barnala, Punjab" />
          </div>
        </Card>

        <Card title="Direct Benefit Transfer (DBT) Bank Account">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Bank Name" name="bankName" defaultValue="State Bank of India (Moga Main Branch)" icon={<Building className="w-4 h-4" />} />
            <Input label="Account Number (Last 4 Digits)" name="accountLast4" defaultValue="8819" icon={<CreditCard className="w-4 h-4" />} />
            <Input label="IFSC Code" name="ifsc" defaultValue="SBIN0001429" />
            <Input label="PFMS Beneficiary Status" defaultValue="ACTIVE & VERIFIED" disabled className="text-emerald-400 font-bold" />
          </div>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" icon={<Save className="w-4 h-4" />}>
            Save Profile Credentials
          </Button>
        </div>
      </form>
    </div>
  );
};
