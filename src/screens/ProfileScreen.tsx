import React, { useState } from 'react';
import { User, Phone, Mail, Car, Shield, KeyRound, Building2, LogOut, Check, AlertCircle, PhoneCall, ChevronRight, X } from 'lucide-react';
import { Resident } from '../types';

interface ProfileScreenProps {
  currentResident: Resident;
  onUpdatePin: (newPin: string) => boolean;
  onSignOut: () => void;
  onSwitchUnit: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  currentResident,
  onUpdatePin,
  onSignOut,
  onSwitchUnit
}) => {
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [pinSuccess, setPinSuccess] = useState(false);
  const [pinError, setPinError] = useState('');

  const handleSavePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPin.length !== 4) {
      setPinError('PIN must be exactly 4 digits');
      return;
    }
    if (newPin !== confirmPin) {
      setPinError('PINs do not match');
      return;
    }

    const success = onUpdatePin(newPin);
    if (success) {
      setPinSuccess(true);
      setTimeout(() => {
        setIsPinModalOpen(false);
        setPinSuccess(false);
        setNewPin('');
        setConfirmPin('');
        setPinError('');
      }, 1200);
    } else {
      setPinError('Failed to update PIN');
    }
  };

  const emergencyContacts = [
    { title: 'General Secretary (Flat 057)', phone: '+91 94350 12057', role: 'Society Management' },
    { title: 'Society Caretaker', phone: '+91 94350 12001', role: 'Maintenance & Repairs' },
    { title: 'Electrical Section (OIL)', phone: '+91 94350 11999', role: 'DG & Power Supply' },
    { title: 'Security Gate (Tower 3)', phone: 'Intercom 3000', role: '24/7 Gate & Visitors' }
  ];

  return (
    <div className="pb-24 px-4 pt-3 space-y-4">
      {/* Resident Identity Card */}
      <div className="bg-white rounded-3xl p-5 border border-neutral-200/90 shadow-ios text-center relative overflow-hidden">
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-oil-dark to-oil-green text-oil-gold text-2xl font-black flex items-center justify-center mx-auto shadow-md border-2 border-white">
          {currentResident.name.charAt(0)}
        </div>

        <h2 className="text-base font-extrabold text-neutral-900 mt-2.5">
          {currentResident.name}
        </h2>
        <p className="text-xs text-neutral-500 font-medium">
          {currentResident.designation}
        </p>

        <div className="mt-3 flex items-center justify-center space-x-2">
          <span className="text-[11px] font-bold bg-emerald-50 text-oil-green px-3 py-1 rounded-full border border-emerald-200">
            Unit {currentResident.flatNumber} • Floor {currentResident.floor}
          </span>
          {currentResident.isCommitteeMember && (
            <span className="text-[11px] font-bold bg-amber-50 text-amber-800 px-2.5 py-1 rounded-full border border-amber-200">
              {currentResident.committeeRole || 'Committee'}
            </span>
          )}
        </div>

        {/* Profile metadata list */}
        <div className="mt-4 pt-4 border-t border-neutral-100 text-left space-y-2.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-neutral-500 flex items-center space-x-1.5">
              <Shield className="w-3.5 h-3.5 text-neutral-400" />
              <span>OIL Employee ID</span>
            </span>
            <span className="font-bold text-neutral-800">{currentResident.oilEmpId}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-neutral-500 flex items-center space-x-1.5">
              <Phone className="w-3.5 h-3.5 text-neutral-400" />
              <span>Mobile Phone</span>
            </span>
            <span className="font-semibold text-neutral-800">{currentResident.phone}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-neutral-500 flex items-center space-x-1.5">
              <Mail className="w-3.5 h-3.5 text-neutral-400" />
              <span>Official Email</span>
            </span>
            <span className="font-semibold text-neutral-800 truncate max-w-[180px]">{currentResident.email}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-neutral-500 flex items-center space-x-1.5">
              <Car className="w-3.5 h-3.5 text-neutral-400" />
              <span>Parking Allotment</span>
            </span>
            <span className="font-bold text-oil-green">{currentResident.parkingSlot}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-neutral-500 flex items-center space-x-1.5">
              <Building2 className="w-3.5 h-3.5 text-neutral-400" />
              <span>Intercom Extension</span>
            </span>
            <span className="font-semibold text-neutral-800">{currentResident.intercom}</span>
          </div>
        </div>
      </div>

      {/* Security Section (PIN Management) */}
      <div className="bg-white rounded-3xl p-4 border border-neutral-200/80 shadow-xs">
        <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
          Security & Access
        </h3>

        <div className="space-y-1">
          <button
            onClick={() => setIsPinModalOpen(true)}
            className="w-full flex items-center justify-between p-2.5 rounded-2xl hover:bg-neutral-50 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-oil-green flex items-center justify-center">
                <KeyRound className="w-4 h-4" />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-neutral-900">Change 4-Digit Security PIN</p>
                <p className="text-[11px] text-neutral-500">Currently: ••••</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-neutral-400" />
          </button>

          <button
            onClick={onSwitchUnit}
            className="w-full flex items-center justify-between p-2.5 rounded-2xl hover:bg-neutral-50 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                <Building2 className="w-4 h-4" />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-neutral-900">Switch Resident / Unit</p>
                <p className="text-[11px] text-neutral-500">Choose from Units 049 - 072</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-neutral-400" />
          </button>
        </div>
      </div>

      {/* Society Emergency & Maintenance Contacts */}
      <div className="bg-white rounded-3xl p-4 border border-neutral-200/80 shadow-xs">
        <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
          Tower 3 Help & Services
        </h3>

        <div className="space-y-2">
          {emergencyContacts.map((contact, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-2.5 rounded-2xl bg-neutral-50 border border-neutral-100"
            >
              <div>
                <p className="text-xs font-bold text-neutral-900">{contact.title}</p>
                <p className="text-[10px] text-neutral-500">{contact.role}</p>
              </div>
              <a
                href={`tel:${contact.phone}`}
                className="flex items-center space-x-1 text-xs font-bold text-oil-green bg-emerald-100/70 hover:bg-emerald-200 px-3 py-1.5 rounded-xl transition-colors"
              >
                <PhoneCall className="w-3 h-3" />
                <span className="text-[11px]">{contact.phone}</span>
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Sign Out Button */}
      <button
        onClick={onSignOut}
        className="w-full py-3 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs flex items-center justify-center space-x-2 border border-rose-200 transition-colors active:scale-98"
      >
        <LogOut className="w-4 h-4" />
        <span>Log Out of Unit {currentResident.flatNumber}</span>
      </button>

      {/* Change PIN Modal */}
      {isPinModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4">
          <div className="w-full max-w-[390px] bg-white rounded-t-3xl sm:rounded-3xl p-5 shadow-ios-sheet animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <h3 className="text-sm font-bold text-neutral-900">Change Security PIN</h3>
              <button
                onClick={() => setIsPinModalOpen(false)}
                className="p-1 rounded-full text-neutral-400 hover:bg-neutral-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSavePin} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-neutral-700 mb-1">New 4-Digit PIN</label>
                <input
                  type="password"
                  maxLength={4}
                  required
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ''))}
                  placeholder="••••"
                  className="w-full bg-neutral-50 px-3 py-2 text-center text-lg font-bold rounded-xl border border-neutral-200 focus:ring-1 focus:ring-oil-green"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Confirm New PIN</label>
                <input
                  type="password"
                  maxLength={4}
                  required
                  value={confirmPin}
                  onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ''))}
                  placeholder="••••"
                  className="w-full bg-neutral-50 px-3 py-2 text-center text-lg font-bold rounded-xl border border-neutral-200 focus:ring-1 focus:ring-oil-green"
                />
              </div>

              {pinError && (
                <div className="flex items-center space-x-1.5 text-rose-600 bg-rose-50 p-2 rounded-xl text-[11px]">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{pinError}</span>
                </div>
              )}

              {pinSuccess && (
                <div className="flex items-center space-x-1.5 text-emerald-700 bg-emerald-50 p-2 rounded-xl text-[11px]">
                  <Check className="w-3.5 h-3.5" />
                  <span>PIN updated successfully!</span>
                </div>
              )}

              <div className="pt-2 flex space-x-2">
                <button
                  type="button"
                  onClick={() => setIsPinModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-neutral-200 text-neutral-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-oil-green text-white font-bold hover:bg-oil-forest shadow-xs"
                >
                  Save PIN
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
