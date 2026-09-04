import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { GovernmentBanner } from '../components/layout/GovernmentBanner';
import { Footer } from '../components/layout/Footer';
import { Sprout } from 'lucide-react';

export const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-50 text-slate-900">
      <GovernmentBanner />
      <header className="py-6 px-4 flex justify-center">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-700 p-0.5 shadow-lg shadow-emerald-900/15">
            <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center text-emerald-700">
              <Sprout className="w-6 h-6" />
            </div>
          </div>
          <span className="font-heading font-black text-2xl text-slate-900">KrishNex</span>
        </Link>
      </header>
      <main className="flex-1 flex items-center justify-center p-4">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
