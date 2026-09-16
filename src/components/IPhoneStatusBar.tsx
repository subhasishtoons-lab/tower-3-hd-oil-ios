import React, { useState, useEffect } from 'react';
import { Wifi } from 'lucide-react';

interface IPhoneStatusBarProps {
  darkText?: boolean;
}

export const IPhoneStatusBar: React.FC<IPhoneStatusBarProps> = ({ darkText = false }) => {
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }).replace(/\s?[AP]M/i, ''));
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  const textColor = darkText ? 'text-neutral-800' : 'text-white';

  return (
    <div className={`w-full flex items-center justify-between px-6 pt-3 pb-1 select-none text-xs font-semibold tracking-tight ${textColor} z-50`}>
      {/* Time */}
      <div className="w-16 text-center font-semibold text-sm">
        {time || '9:41'}
      </div>

      {/* Dynamic Island placeholder area spacer */}
      <div className="flex-1 flex justify-center items-center">
        <div className="w-28 h-6 bg-black rounded-full flex items-center justify-between px-2.5 shadow-inner">
          <div className="w-2.5 h-2.5 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center">
            <div className="w-1 h-1 rounded-full bg-neutral-700"></div>
          </div>
          <div className="w-2 h-2 rounded-full bg-neutral-900 border border-neutral-800"></div>
        </div>
      </div>

      {/* System Icons (Cellular, Wifi, Battery) */}
      <div className="w-16 flex items-center justify-end space-x-1.5">
        {/* Cellular bars */}
        <div className="flex items-end space-x-[1.5px] h-3">
          <span className="w-[3px] h-[3px] rounded-xs bg-current"></span>
          <span className="w-[3px] h-[5px] rounded-xs bg-current"></span>
          <span className="w-[3px] h-[8px] rounded-xs bg-current"></span>
          <span className="w-[3px] h-[10px] rounded-xs bg-current"></span>
        </div>

        {/* Wifi */}
        <Wifi className="w-3.5 h-3.5 stroke-[2.5]" />

        {/* Battery */}
        <div className="flex items-center">
          <div className="w-5 h-2.5 rounded-[4px] border border-current p-[1px] flex items-center">
            <div className="h-full w-4/5 rounded-[2px] bg-current"></div>
          </div>
          <div className="w-[1.5px] h-1 bg-current rounded-r-xs ml-[0.5px]"></div>
        </div>
      </div>
    </div>
  );
};
