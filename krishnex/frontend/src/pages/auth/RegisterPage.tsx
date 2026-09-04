import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { User, Mail, Phone, Lock, FileCheck } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [agriStackId, setAgriStackId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await register(fullName, email, password, phone);
      navigate('/farmer');
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to register. Please check your details.');
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <Card title="Farmer Registration • KrishNex" subtitle="Connect your AgriStack ID & Bank details for instant direct benefit transfer">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {error && <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>}
          <Input
            label="Full Name"
            placeholder="e.g. Ramesh Kumar"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            icon={<User className="w-4 h-4" />}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="farmer@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail className="w-4 h-4" />}
              required
            />
            <Input
              label="Mobile Number"
              placeholder="+91 98765 43210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              icon={<Phone className="w-4 h-4" />}
              required
            />
          </div>

          <Input
            label="AgriStack State Farmer ID"
            placeholder="e.g. PB-2026-8819"
            value={agriStackId}
            onChange={(e) => setAgriStackId(e.target.value)}
            icon={<FileCheck className="w-4 h-4" />}
            helperText="Integrated with State Land Revenue Registry"
            required
          />

          <Input
            label="Create Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={<Lock className="w-4 h-4" />}
            required
          />

          <Button type="submit" className="w-full mt-2">
            Complete Registration & Book Slot
          </Button>

          <div className="pt-4 border-t border-slate-800 text-center text-xs text-slate-400">
            Already registered?{' '}
            <Link to="/login" className="text-emerald-400 font-bold hover:underline">
              Sign In Here
            </Link>
          </div>
        </form>
      </Card>
    </div>
  );
};
