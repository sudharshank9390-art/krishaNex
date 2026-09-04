import React from 'react';
import { MOCK_TOKENS } from '../../utils/mockData';
import { QRTokenCard } from '../../components/common/QRTokenCard';

export const MobileTokenPage: React.FC = () => {
  const token = MOCK_TOKENS[0];

  return (
    <div className="flex flex-col gap-6 max-w-sm mx-auto">
      <div className="text-center flex flex-col gap-1">
        <h1 className="text-2xl font-heading font-black text-white">Offline Pass Storage</h1>
        <p className="text-xs text-slate-400">Cached on mobile storage for offline gate clearance.</p>
      </div>

      <QRTokenCard token={token} />
    </div>
  );
};
