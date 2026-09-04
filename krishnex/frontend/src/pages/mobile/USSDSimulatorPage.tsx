import React, { useState } from 'react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Radio, Phone, RefreshCw } from 'lucide-react';

export const USSDSimulatorPage: React.FC = () => {
  const [screen, setScreen] = useState<'MAIN' | 'CROP' | 'SLOT' | 'CONFIRM'>('MAIN');
  const [inputVal, setInputVal] = useState('');
  const [selectedCrop, setSelectedCrop] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (screen === 'MAIN' && inputVal === '1') {
      setScreen('CROP');
      setInputVal('');
    } else if (screen === 'CROP') {
      setSelectedCrop(inputVal === '1' ? 'Wheat' : 'Paddy');
      setScreen('SLOT');
      setInputVal('');
    } else if (screen === 'SLOT') {
      setScreen('CONFIRM');
      setInputVal('');
    }
  };

  const handleReset = () => {
    setScreen('MAIN');
    setInputVal('');
  };

  return (
    <div className="flex flex-col gap-6 max-w-sm mx-auto">
      <div className="text-center flex flex-col gap-1">
        <h1 className="text-2xl font-heading font-black text-white">USSD Mobile Simulator (*99#)</h1>
        <p className="text-xs text-slate-400">Offline feature-phone interactive booking protocol for 2G rural networks.</p>
      </div>

      {/* Retro Phone Frame */}
      <div className="bg-slate-900 border-4 border-slate-700 rounded-3xl p-4 shadow-2xl flex flex-col gap-4">
        {/* USSD Green LCD Display */}
        <div className="bg-emerald-950/90 border-2 border-emerald-500/50 p-4 rounded-xl font-mono text-xs text-emerald-300 min-h-[160px] flex flex-col justify-between">
          <div>
            <div className="flex justify-between text-[10px] text-emerald-500 border-b border-emerald-800 pb-1 mb-2 font-bold">
              <span>KrishNex USSD v2.4</span>
              <span>100% SIGNAL</span>
            </div>

            {screen === 'MAIN' && (
              <div>
                <p className="font-bold text-white mb-2">Welcome to KrishNex Mandi Service:</p>
                <p>1. Book Procurement Slot</p>
                <p>2. Check Token Status</p>
                <p>3. Check MSP Rates</p>
              </div>
            )}

            {screen === 'CROP' && (
              <div>
                <p className="font-bold text-white mb-2">Select Crop Variety:</p>
                <p>1. Wheat (Sharbati Grade-A)</p>
                <p>2. Paddy (Basmati Grade-1)</p>
              </div>
            )}

            {screen === 'SLOT' && (
              <div>
                <p className="font-bold text-white mb-2">Select Barnala Mandi Slot:</p>
                <p>1. Morning 10:30 AM</p>
                <p>2. Afternoon 01:00 PM</p>
              </div>
            )}

            {screen === 'CONFIRM' && (
              <div>
                <p className="font-bold text-emerald-400 mb-1">SUCCESS!</p>
                <p className="text-white">Token: KN-2026-USSD27</p>
                <p>Slot: 10:30 AM (Barnala)</p>
                <p className="text-[10px] text-slate-400 mt-2">SMS confirmation sent to registered mobile.</p>
              </div>
            )}
          </div>

          <div className="text-[10px] text-emerald-500 pt-2 border-t border-emerald-800/80 flex justify-between">
            <span>Cancel (0)</span>
            <span>Send (Enter)</span>
          </div>
        </div>

        {/* Input Form */}
        {screen !== 'CONFIRM' ? (
          <form onSubmit={handleSend} className="flex gap-2">
            <input
              type="text"
              placeholder="Enter option (1-3)"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-white text-center focus:outline-none focus:border-emerald-500"
              required
            />
            <Button type="submit" size="sm">Send</Button>
          </form>
        ) : (
          <Button onClick={handleReset} variant="outline" size="sm" icon={<RefreshCw className="w-4 h-4" />}>
            Reset USSD Session
          </Button>
        )}
      </div>
    </div>
  );
};
