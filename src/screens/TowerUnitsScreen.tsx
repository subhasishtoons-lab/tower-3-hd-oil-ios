import React, { useState } from 'react';
import { Search, Building2, Phone, Mail, Car, Shield, User, ChevronRight } from 'lucide-react';
import { Resident } from '../types';

interface TowerUnitsScreenProps {
  residents: Resident[];
  currentUnit: string;
  onSelectUnit: (flat: string) => void;
}

export const TowerUnitsScreen: React.FC<TowerUnitsScreenProps> = ({
  residents,
  currentUnit,
  onSelectUnit
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFloor, setSelectedFloor] = useState<number | 'ALL'>('ALL');

  const filteredResidents = residents.filter((r) => {
    const matchesSearch =
      r.flatNumber.includes(searchQuery) ||
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.designation.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFloor = selectedFloor === 'ALL' || r.floor === selectedFloor;
    return matchesSearch && matchesFloor;
  });

  return (
    <div className="pb-24 px-4 pt-3">
      {/* Search Input */}
      <div className="relative mb-3">
        <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search flat (049-072), resident name, or role..."
          className="w-full bg-white pl-10 pr-4 py-2.5 rounded-2xl text-xs border border-neutral-200 shadow-xs focus:outline-none focus:ring-2 focus:ring-oil-green/30 text-neutral-800 placeholder:text-neutral-400"
        />
      </div>

      {/* Floor Filter Tabs (Horizontal Scroll) */}
      <div className="flex space-x-1.5 overflow-x-auto pb-2 scrollbar-none mb-3">
        <button
          onClick={() => setSelectedFloor('ALL')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
            selectedFloor === 'ALL'
              ? 'bg-oil-green text-white shadow-xs'
              : 'bg-white text-neutral-600 border border-neutral-200'
          }`}
        >
          All Floors (24)
        </button>
        {[1, 2, 3, 4, 5, 6].map((fl) => (
          <button
            key={fl}
            onClick={() => setSelectedFloor(fl)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedFloor === fl
                ? 'bg-oil-green text-white shadow-xs'
                : 'bg-white text-neutral-600 border border-neutral-200'
            }`}
          >
            Floor {fl} ({residents.filter((r) => r.floor === fl).length})
          </button>
        ))}
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-3 gap-2.5 mb-4">
        <div className="bg-white rounded-2xl p-3 border border-neutral-200 shadow-xs">
          <span className="text-[11px] font-medium text-neutral-500">Total Units</span>
          <p className="text-lg font-bold text-oil-dark mt-0.5">24 Flts</p>
          <span className="text-[10px] text-oil-green font-medium">049 to 072</span>
        </div>
        <div className="bg-white rounded-2xl p-3 border border-neutral-200 shadow-xs">
          <span className="text-[11px] font-medium text-neutral-500">Occupancy</span>
          <p className="text-lg font-bold text-emerald-700 mt-0.5">100%</p>
          <span className="text-[10px] text-neutral-500 font-medium">OIL Officers</span>
        </div>
        <div className="bg-white rounded-2xl p-3 border border-neutral-200 shadow-xs">
          <span className="text-[11px] font-medium text-neutral-500">Your Unit</span>
          <p className="text-lg font-bold text-oil-gold mt-0.5">#{currentUnit}</p>
          <span className="text-[10px] text-neutral-500 font-medium">Active session</span>
        </div>
      </div>

      {/* Units List */}
      <div className="space-y-2.5">
        {filteredResidents.map((resident) => {
          const isCurrent = resident.flatNumber === currentUnit;

          return (
            <div
              key={resident.flatNumber}
              className={`bg-white rounded-2xl p-4 border transition-all shadow-xs ${
                isCurrent
                  ? 'border-oil-green ring-2 ring-oil-green/15 bg-emerald-50/20'
                  : 'border-neutral-200/80 hover:border-neutral-300'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-11 h-11 rounded-2xl flex flex-col items-center justify-center font-bold shadow-xs ${
                      isCurrent
                        ? 'bg-oil-green text-white'
                        : 'bg-neutral-100 text-neutral-800 border border-neutral-200'
                    }`}
                  >
                    <span className="text-xs font-black leading-none">{resident.flatNumber}</span>
                    <span className="text-[9px] font-medium opacity-80 mt-0.5">FL-{resident.floor}</span>
                  </div>

                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-sm font-bold text-neutral-900">{resident.name}</h3>
                      {resident.isCommitteeMember && (
                        <span className="text-[9px] font-bold bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded-md border border-amber-300 flex items-center space-x-1">
                          <Shield className="w-2.5 h-2.5 mr-0.5" />
                          <span>{resident.committeeRole || 'Committee'}</span>
                        </span>
                      )}
                      {isCurrent && (
                        <span className="text-[9px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-md border border-emerald-300">
                          YOU
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-neutral-500 mt-0.5 line-clamp-1">{resident.designation}</p>
                  </div>
                </div>

                <button
                  onClick={() => onSelectUnit(resident.flatNumber)}
                  className={`p-2 rounded-xl text-xs font-semibold flex items-center space-x-1 transition-colors ${
                    isCurrent
                      ? 'bg-oil-green/10 text-oil-green'
                      : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                  }`}
                  title="Switch to this unit"
                >
                  <span className="text-[11px]">{isCurrent ? 'Active' : 'Switch'}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Resident Metadata */}
              <div className="mt-3 pt-3 border-t border-neutral-100 grid grid-cols-3 gap-2 text-[11px] text-neutral-600">
                <div className="flex items-center space-x-1">
                  <Car className="w-3.5 h-3.5 text-neutral-400" />
                  <span>{resident.parkingSlot}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Phone className="w-3.5 h-3.5 text-neutral-400" />
                  <span>IC: {resident.intercom}</span>
                </div>
                <div className="flex items-center space-x-1 justify-end">
                  <User className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Emp: {resident.oilEmpId}</span>
                </div>
              </div>
            </div>
          );
        })}

        {filteredResidents.length === 0 && (
          <div className="text-center py-10 text-neutral-500 text-xs">
            No units found matching &quot;{searchQuery}&quot;
          </div>
        )}
      </div>
    </div>
  );
};
