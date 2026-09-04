import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { Card } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { Button } from '../../components/common/Button';
import { Lock, Mail, UserCheck } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('farmer@krishnex.app');
  const [password, setPassword] = useState('KrishNex2026!');
  const [role, setRole] = useState<UserRole>('FARMER');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await login(email, password);
      const routeMap: Record<UserRole, string> = { FARMER: '/farmer', MANDI_OPERATOR: '/mandi', GOVERNMENT_ADMIN: '/government', SUPER_ADMIN: '/admin' };
      navigate(routeMap[user?.role || role]);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to sign in. Check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <Card title="Sign in to KrishNex" subtitle="Select your role and enter credentials to access your portal">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {error && <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>}
          <Select
            label="Portal Access Role"
            value={role}
            onChange={(e) => setRole(e.target.value as UserRole)}
            options={[
              { value: 'FARMER', label: 'Farmer Experience Portal' },
              { value: 'MANDI_OPERATOR', label: 'Mandi Yard Operations Desk' },
              { value: 'GOVERNMENT_ADMIN', label: 'Government Central Command' },
              { value: 'SUPER_ADMIN', label: 'Platform Super Administrator' },
            ]}
          />

          <Input
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={<Mail className="w-4 h-4" />}
            required
          />

          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={<Lock className="w-4 h-4" />}
            required
          />

          <Button type="submit" isLoading={isLoading} icon={<UserCheck className="w-4 h-4" />} className="w-full mt-2">
            Sign In & Access Dashboard
          </Button>

          <div className="pt-4 border-t border-slate-800 text-center text-xs text-slate-400 flex flex-col gap-2">
            <Link to="/demo-accounts" className="text-emerald-400 font-bold hover:underline">
              ⚡ Click here for 1-Click Demo Accounts
            </Link>
            <div>
              Don't have an account?{' '}
              <Link to="/register" className="text-white hover:underline font-bold">
                Register as Farmer
              </Link>
            </div>
          </div>
        </form>
      </Card>
    </div>
  );
};
