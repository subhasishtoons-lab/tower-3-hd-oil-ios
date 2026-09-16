import React from 'react';
import { ShieldCheck, LogOut, ChevronRight } from 'lucide-react';
import { Resident } from '../types';

interface IPhoneHeaderProps {
  currentResident?: Resident;
  onOpenUnitSwitch: () => void;
  onSignOut: () => void;
}

export const IPhoneHeader: React.FC<IPhoneHeaderProps> = ({
  currentResident,
  onOpenUnitSwitch,
  onSignOut
}) => {
  return (
    <header className="bg-gradient-to-b from-oil-dark via-oil-forest to-oil-green text-white px-4 pt-2 pb-4 shadow-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-inner">
            <span className="font-extrabold text-sm tracking-tighter text-oil-gold">T-3</span>
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <h1 className="text-base font-bold tracking-tight text-white">Tower 3 HD Oil</h1>
              <span className="bg-oil-gold/20 text-oil-gold text-[10px] font-semibold px-1.5 py-0.5 rounded-full border border-oil-gold/30">
                OIL Duliajan
              </span>
            </div>
            <p className="text-[11px] text-emerald-200/80 font-medium">
              Units 049 - 072 • Assam 786602
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Active Unit Selector Pill */}
          <button
            onClick={onOpenUnitSwitch}
            className="flex items-center space-x-1.5 bg-white/15 hover:bg-white/25 active:scale-95 transition-all text-white text-xs font-semibold px-2.5 py-1.5 rounded-xl border border-white/20 shadow-xs"
            title="Switch Unit / Resident"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-oil-gold" />
            <span>Unit {currentResident?.flatNumber || '049'}</span>
            <ChevronRight className="w-3 h-3 text-white/70" />
          </button>

          {/* Quick Lock / Sign Out */}
          <button
            onClick={onSignOut}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-white/80 transition-colors"
            title="Switch User / Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {currentResident && (
        <div className="mt-3 bg-white/10 backdrop-blur-sm rounded-xl px-3 py-2 border border-white/15 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2 truncate">
            <div className="w-6 h-6 rounded-full bg-oil-gold/20 text-oil-gold font-bold flex items-center justify-center text-[11px] shrink-0 border border-oil-gold/30">
              {currentResident.name.charAt(0)}
            </div>
            <div className="truncate">
              <span className="font-semibold text-white truncate block">{currentResident.name}</span>
              <span className="text-[10px] text-emerald-200/70 truncate block">{currentResident.designation}</span>
            </div>
          </div>
          <div className="text-right shrink-0 pl-2">
            <span className="text-[10px] bg-emerald-900/60 text-emerald-300 font-medium px-2 py-0.5 rounded-md border border-emerald-500/30">
              Floor {currentResident.floor} • {currentResident.parkingSlot}
            </span>
          </div>
        </div>
      )}
    </header>
  );
};
