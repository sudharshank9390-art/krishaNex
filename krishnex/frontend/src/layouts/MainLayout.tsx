import React from 'react';
import { Outlet } from 'react-router-dom';
import { GovernmentBanner } from '../components/layout/GovernmentBanner';
import { Navbar } from '../components/layout/Navbar';
import { Sidebar } from '../components/layout/Sidebar';
import { Footer } from '../components/layout/Footer';

export const MainLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-emerald-200 selection:text-emerald-950">
      <GovernmentBanner />
      <Navbar />
      <div className="flex-1 flex w-full max-w-7xl mx-auto">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto bg-[radial-gradient(circle_at_top_right,_rgba(14,165,233,0.08),_transparent_32rem)]">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
};
