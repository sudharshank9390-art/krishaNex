import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout, Scale, Shield, Smartphone, ArrowRight, CheckCircle2, Zap, BarChart2, ShieldAlert } from 'lucide-react';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';

export const LandingPage: React.FC = () => {
  return (
    <div className="flex flex-col gap-16 py-8">
      {/* Hero Section */}
      <div className="flex flex-col items-center text-center gap-6 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-700/50 text-emerald-400 text-xs font-mono font-bold uppercase tracking-wider shadow-lg">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          KrishNex Engine • Real-Time Mandi Queue Balancing
        </div>

        <h1 className="text-4xl sm:text-6xl font-black font-heading tracking-tight text-white leading-tight">
          Smart Agriculture. <br />
          <span className="text-emerald-700">
            Seamless Procurement.
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-400 max-w-2xl font-normal leading-relaxed">
          Eliminating mandi tractor bottlenecks, moisture dockage disputes, and middleman leakage with AI predictive load balancing, optical gate clearance, and instant PFMS bank settlements.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Link to="/farmer">
            <Button size="lg" icon={<ArrowRight className="w-5 h-5" />}>
              Launch Farmer Experience
            </Button>
          </Link>
          <Link to="/demo-accounts">
            <Button variant="outline" size="lg">
              View All 4 Demo Portals
            </Button>
          </Link>
        </div>
      </div>

      {/* 4 Interactive Portal Gateway Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Portal 1: Farmer Portal */}
        <Link to="/farmer" className="group">
          <Card variant="accent" className="h-full flex flex-col justify-between relative">
            <div className="flex flex-col gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Sprout className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-heading font-black text-xl text-white group-hover:text-emerald-400 transition-colors">
                  Farmer Experience Engine
                </h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Interactive harvest quota calculator, AI slot recommendation, digital QR pass (`KN-2026-A027`), live weighbridge tracking, and instant DBT J-Form receipt.
                </p>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs font-bold text-emerald-400">
              <span>Launch Farmer Portal</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Card>
        </Link>

        {/* Portal 2: Mandi Yard Operations */}
        <Link to="/mandi" className="group">
          <Card variant="cyan" className="h-full flex flex-col justify-between">
            <div className="flex flex-col gap-4">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Scale className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-heading font-black text-xl text-white group-hover:text-cyan-400 transition-colors">
                  Mandi Operations Desk
                </h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Weighbridge operator terminal: optical ANPR gate scanner, gross/tare electronic scale calibration, spectrometry moisture assay, and direct payment clearance.
                </p>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs font-bold text-cyan-400">
              <span>Open Operations Desk</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Card>
        </Link>

        {/* Portal 3: State Central Command */}
        <Link to="/government" className="group">
          <Card variant="bordered" className="h-full flex flex-col justify-between hover:border-purple-500/50">
            <div className="flex flex-col gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-heading font-black text-xl text-white group-hover:text-purple-400 transition-colors">
                  Government Command
                </h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Statewide analytics command: 42/42 connected grain silos, 384 tractors in transit, dynamic load balancing heatmaps, and gazette exports.
                </p>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs font-bold text-purple-400">
              <span>Open State Command</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Card>
        </Link>

        {/* Portal 4: Mobile & USSD Suite */}
        <Link to="/mobile" className="group">
          <Card variant="bordered" className="h-full flex flex-col justify-between hover:border-amber-500/50">
            <div className="flex flex-col gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Smartphone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-heading font-black text-xl text-white group-hover:text-amber-400 transition-colors">
                  Mobile & USSD Suite
                </h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Responsive smartphone device view: biometric KYC login, simplified 1-tap booking, live GPS route preview, digital pass storage, and USSD fallback.
                </p>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs font-bold text-amber-400">
              <span>Launch Mobile Suite</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Card>
        </Link>
      </div>

      {/* Highlights Ribbon */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        <div>
          <span className="font-mono font-bold text-3xl text-emerald-400">-82%</span>
          <span className="block text-xs text-slate-400 uppercase tracking-wider mt-1">Dwell Time Saved</span>
        </div>
        <div>
          <span className="font-mono font-bold text-3xl text-white">100%</span>
          <span className="block text-xs text-slate-400 uppercase tracking-wider mt-1">Direct DBT Realization</span>
        </div>
        <div>
          <span className="font-mono font-bold text-3xl text-emerald-400">12,400 hrs</span>
          <span className="block text-xs text-slate-400 uppercase tracking-wider mt-1">Diesel Idling Prevented</span>
        </div>
        <div>
          <span className="font-mono font-bold text-3xl text-white">42 / 42</span>
          <span className="block text-xs text-slate-400 uppercase tracking-wider mt-1">Active Mandi Nodes</span>
        </div>
      </div>
    </div>
  );
};
