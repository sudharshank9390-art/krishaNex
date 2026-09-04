import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Sprout, Scale, Shield, Settings, ArrowRight } from 'lucide-react';

export const DemoAccountsPage: React.FC = () => {
  const { switchRole } = useAuth();
  const navigate = useNavigate();

  const accounts: {
    role: UserRole;
    name: string;
    email: string;
    title: string;
    desc: string;
    route: string;
    icon: React.ReactNode;
    color: 'emerald' | 'cyan' | 'purple' | 'amber';
  }[] = [
    {
      role: 'FARMER',
      name: 'Ramesh Kumar',
      email: 'farmer@krishnex.app',
      title: 'Farmer Experience Engine',
      desc: 'Interactive quota calculator, slot booking, QR token pass (KN-2026-A027), weighbridge tracking, and instant DBT receipt.',
      route: '/farmer',
      icon: <Sprout className="w-6 h-6 text-emerald-400" />,
      color: 'emerald'
    },
    {
      role: 'MANDI_OPERATOR',
      name: 'Rajesh Verma',
      email: 'mandi@krishnex.app',
      title: 'Mandi Operations Desk',
      desc: 'Weighbridge operator terminal: optical ANPR gate verification, gross/tare electronic scale calibration, and spectrometry assay.',
      route: '/mandi',
      icon: <Scale className="w-6 h-6 text-cyan-400" />,
      color: 'cyan'
    },
    {
      role: 'GOVERNMENT_ADMIN',
      name: 'Suresh Sharma, IAS',
      email: 'gov@krishnex.app',
      title: 'Government Central Command',
      desc: 'Statewide analytics & procurement command: 42 connected silos, 384 tractors in transit, and dynamic load balancing.',
      route: '/government',
      icon: <Shield className="w-6 h-6 text-purple-400" />,
      color: 'purple'
    },
    {
      role: 'SUPER_ADMIN',
      name: 'System Administrator',
      email: 'admin@krishnex.app',
      title: 'Super Administrator',
      desc: 'User management, mandi configuration, crop catalog MSP settings, system audit trails, and platform telemetry.',
      route: '/admin',
      icon: <Settings className="w-6 h-6 text-amber-400" />,
      color: 'amber'
    }
  ];

  const handleLaunch = (role: UserRole, route: string) => {
    switchRole(role);
    navigate(route);
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-6 py-4">
      <div className="text-center flex flex-col gap-2">
        <h2 className="text-3xl font-heading font-black text-white">KrishNex • 1-Click Demo Accounts</h2>
        <p className="text-sm text-slate-400">Select any role below to launch and evaluate the full-stack portal immediately.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {accounts.map((acc) => (
          <Card key={acc.role} variant="bordered" className="flex flex-col justify-between hover:border-emerald-500/40">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-xl bg-slate-800 border border-slate-700">
                  {acc.icon}
                </div>
                <span className="font-mono text-xs font-bold text-slate-400 bg-slate-800 px-2.5 py-1 rounded-md">
                  {acc.role}
                </span>
              </div>
              <h3 className="font-heading font-bold text-xl text-white">{acc.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{acc.desc}</p>
              
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs font-mono flex flex-col gap-1 text-slate-300">
                <div><span className="text-slate-500">Account:</span> {acc.name}</div>
                <div><span className="text-slate-500">Email:</span> {acc.email}</div>
                <div><span className="text-slate-500">Password:</span> <code className="text-emerald-400 font-bold">KrishNex2026!</code></div>
              </div>
            </div>

            <Button
              onClick={() => handleLaunch(acc.role, acc.route)}
              className="mt-6 w-full"
              icon={<ArrowRight className="w-4 h-4" />}
            >
              Launch {acc.title}
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
};
