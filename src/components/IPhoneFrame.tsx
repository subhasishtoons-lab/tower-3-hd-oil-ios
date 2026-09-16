import React, { useState, useEffect } from 'react';
import { Smartphone, Monitor } from 'lucide-react';
import { Capacitor } from '@capacitor/core';

interface IPhoneFrameProps {
  children: React.ReactNode;
}

export const IPhoneFrame: React.FC<IPhoneFrameProps> = ({ children }) => {
  const isNative = Capacitor.isNativePlatform();
  const [frameEnabled, setFrameEnabled] = useState(!isNative);

  // If running inside native iOS shell, fill the full viewport naturally
  if (isNative) {
    return (
      <div className="w-full h-full min-h-screen bg-oil-surface flex flex-col overflow-hidden relative select-none">
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-900 flex flex-col items-center justify-center p-0 sm:py-6 sm:px-4 select-none">
      {/* Device Mode Toggle bar (visible on desktop browser) */}
      <div className="hidden sm:flex items-center justify-between w-full max-w-[430px] mb-3 px-2 text-white text-xs">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="font-semibold text-neutral-300">iPhone 16 Pro Viewport (430 × 932)</span>
        </div>
        <button
          onClick={() => setFrameEnabled(!frameEnabled)}
          className="flex items-center space-x-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 px-2.5 py-1 rounded-lg border border-neutral-700 transition-colors"
        >
          {frameEnabled ? <Monitor className="w-3.5 h-3.5" /> : <Smartphone className="w-3.5 h-3.5" />}
          <span>{frameEnabled ? 'Frameless' : 'Show Bezel'}</span>
        </button>
      </div>

      {/* iPhone Device Enclosure */}
      <div
        className={`w-full max-w-[430px] bg-oil-surface h-[100dvh] sm:h-[880px] flex flex-col overflow-hidden relative transition-all duration-300 ${
          frameEnabled
            ? 'sm:rounded-[52px] sm:border-[10px] sm:border-neutral-800 sm:shadow-[0_25px_70px_rgba(0,0,0,0.8),0_0_0_2px_rgba(255,255,255,0.1)]'
            : 'sm:rounded-3xl sm:shadow-2xl'
        }`}
      >
        {children}
      </div>
    </div>
  );
};

