import React from 'react';
import { PageView } from '../types';

export const OfflinePage: React.FC<{ onNavigate: (page: PageView) => void }> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-[#090d18] text-[#e8e6e0] flex items-center justify-center text-center p-8 relative overflow-hidden">
      <div
        className="unisell-ring w-[300px] h-[300px]"
        style={{ animationDuration: '20s' }}
      />
      <div
        className="unisell-ring w-[500px] h-[500px]"
        style={{ animationDuration: '35s', animationDirection: 'reverse' }}
      />
      <div className="max-w-[480px] relative z-10">
        <div className="font-serif-display text-xl font-bold text-[#c9a84c] tracking-[0.1em] mb-8">
          UNISELL
        </div>
        <div className="text-6xl mb-6">📡</div>
        <h1 className="font-serif-display text-4xl font-bold text-[#c9a84c] mb-2">
          You&apos;re Offline
        </h1>
        <p className="text-base text-[#7a7d8a] mb-8 leading-relaxed">
          No internet connection detected.
          <br />
          Check your connection and try again.
        </p>
        <button
          type="button"
          onClick={() => onNavigate('dashboard')}
          className="bg-[#c9a84c] hover:bg-[#e8c97a] text-[#090d18] border-none rounded-lg px-8 py-3.5 text-sm font-bold cursor-pointer transition-all hover:-translate-y-0.5"
        >
          Try Again →
        </button>
        <div className="mt-8 space-y-2 text-left">
          <div className="flex items-center gap-3 bg-[#c9a84c]/12 border border-[#c9a84c]/25 rounded-lg px-4 py-2.5 text-xs text-[#7a7d8a]">
            <span>📶</span> Check your WiFi or mobile data
          </div>
          <div className="flex items-center gap-3 bg-[#c9a84c]/12 border border-[#c9a84c]/25 rounded-lg px-4 py-2.5 text-xs text-[#7a7d8a]">
            <span>🔄</span> Some pages are available offline
          </div>
          <div className="flex items-center gap-3 bg-[#c9a84c]/12 border border-[#c9a84c]/25 rounded-lg px-4 py-2.5 text-xs text-[#7a7d8a]">
            <span>💾</span> Your data is saved and will sync when reconnected
          </div>
        </div>
      </div>
    </div>
  );
};
