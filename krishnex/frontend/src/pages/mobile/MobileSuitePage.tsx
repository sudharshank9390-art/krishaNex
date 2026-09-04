import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Smartphone, Radio, Calendar, QrCode, ArrowRight } from 'lucide-react';

export const MobileSuitePage: React.FC = () => {
  return (
    <div className="flex flex-col gap-6 max-w-md mx-auto">
      <div className="text-center flex flex-col gap-1">
        <h1 className="text-2xl font-heading font-black text-white">Mobile & Offline USSD Suite</h1>
        <p className="text-xs text-slate-400">Smartphone web preview and feature-phone USSD simulator for rural connectivity.</p>
      </div>

      <div className="flex flex-col gap-4">
        <Link to="/mobile/ussd">
          <Card variant="accent" className="hover:border-emerald-400 cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-500/20 rounded-xl text-emerald-400"><Radio className="w-6 h-6" /></div>
              <div className="flex flex-col flex-1">
                <span className="font-bold text-white text-base">USSD Feature-Phone (*99#)</span>
                <span className="text-xs text-slate-400">Book slot via SMS / USSD code</span>
              </div>
              <ArrowRight className="w-5 h-5 text-emerald-400" />
            </div>
          </Card>
        </Link>

        <Link to="/mobile/booking">
          <Card variant="bordered" className="hover:border-cyan-400 cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-cyan-500/20 rounded-xl text-cyan-400"><Calendar className="w-6 h-6" /></div>
              <div className="flex flex-col flex-1">
                <span className="font-bold text-white text-base">1-Tap Mobile Slot Booking</span>
                <span className="text-xs text-slate-400">Simplified smartphone booking</span>
              </div>
              <ArrowRight className="w-5 h-5 text-cyan-400" />
            </div>
          </Card>
        </Link>

        <Link to="/mobile/token">
          <Card variant="bordered" className="hover:border-purple-400 cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-500/20 rounded-xl text-purple-400"><QrCode className="w-6 h-6" /></div>
              <div className="flex flex-col flex-1">
                <span className="font-bold text-white text-base">Offline Digital Pass Storage</span>
                <span className="text-xs text-slate-400">View token offline without internet</span>
              </div>
              <ArrowRight className="w-5 h-5 text-purple-400" />
            </div>
          </Card>
        </Link>
      </div>
    </div>
  );
};
