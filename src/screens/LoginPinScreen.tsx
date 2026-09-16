import React, { useState } from 'react';
import { Shield, KeyRound, Building2, ChevronDown, Check, AlertCircle } from 'lucide-react';
import { Resident } from '../types';

interface LoginPinScreenProps {
  residents: Resident[];
  onLoginSuccess: (unit: string) => void;
}

export const LoginPinScreen: React.FC<LoginPinScreenProps> = ({ residents, onLoginSuccess }) => {
  const [selectedFlat, setSelectedFlat] = useState('049');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [showUnitPicker, setShowUnitPicker] = useState(false);

  const currentResident = residents.find((r) => r.flatNumber === selectedFlat);

  const handleKeyPress = (digit: string) => {
    if (pin.length < 4) {
      const nextPin = pin + digit;
      setPin(nextPin);
      setError('');
      if (nextPin.length === 4) {
        verifyPin(nextPin);
      }
    }
  };

  const handleDelete = () => {
    setPin((prev) => prev.slice(0, -1));
    setError('');
  };

  const verifyPin = (enteredPin: string) => {
    if (!currentResident) return;
    if (enteredPin === currentResident.pin || enteredPin === '1234') {
      onLoginSuccess(selectedFlat);
    } else {
      setError('Incorrect Security PIN. Default PIN is 1234.');
      setPin('');
    }
  };

  const handleQuickDemo = (flat: string) => {
    setSelectedFlat(flat);
    onLoginSuccess(flat);
  };

  return (
    <div className="min-h-full flex flex-col justify-between bg-gradient-to-b from-oil-dark via-oil-forest to-oil-green text-white px-6 pt-8 pb-10">
      {/* Top Brand */}
      <div className="flex flex-col items-center text-center mt-2">
        <div className="w-16 h-16 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-lg mb-3">
          <Building2 className="w-8 h-8 text-oil-gold" />
        </div>
        <h1 className="text-xl font-bold tracking-tight text-white">Tower 3 HD Oil Housing</h1>
        <p className="text-xs text-emerald-200/80 mt-1">Oil India Limited • Duliajan, Assam 786602</p>
        <span className="mt-2 text-[11px] font-semibold text-oil-gold bg-oil-gold/15 px-3 py-0.5 rounded-full border border-oil-gold/30">
          iPhone Resident Portal
        </span>
      </div>

      {/* Unit Selector Card */}
      <div className="my-6">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-200">Selected Unit</span>
            <button
              onClick={() => setShowUnitPicker(!showUnitPicker)}
              className="flex items-center space-x-1.5 bg-white/20 hover:bg-white/30 text-white text-xs font-bold px-3 py-1.5 rounded-xl border border-white/25 transition-colors"
            >
              <span>Unit {selectedFlat}</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>

          {currentResident && (
            <div className="mt-2.5 pt-2.5 border-t border-white/15 flex items-center justify-between text-xs">
              <div>
                <p className="font-semibold text-white">{currentResident.name}</p>
                <p className="text-[11px] text-emerald-200/70">{currentResident.designation}</p>
              </div>
              <span className="text-[10px] bg-emerald-900/60 text-emerald-200 px-2 py-0.5 rounded-md border border-emerald-500/30">
                Floor {currentResident.floor}
              </span>
            </div>
          )}

          {/* Unit selection popover */}
          {showUnitPicker && (
            <div className="mt-3 pt-3 border-t border-white/20 max-h-44 overflow-y-auto pr-1">
              <p className="text-[11px] text-emerald-200/80 mb-2 font-medium">Select your unit (049 to 072):</p>
              <div className="grid grid-cols-4 gap-1.5">
                {residents.map((r) => (
                  <button
                    key={r.flatNumber}
                    onClick={() => {
                      setSelectedFlat(r.flatNumber);
                      setShowUnitPicker(false);
                      setPin('');
                      setError('');
                    }}
                    className={`py-1.5 rounded-lg text-xs font-bold transition-all ${
                      r.flatNumber === selectedFlat
                        ? 'bg-oil-gold text-neutral-900 shadow-sm'
                        : 'bg-white/10 hover:bg-white/20 text-white border border-white/10'
                    }`}
                  >
                    {r.flatNumber}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* PIN Input Indicator */}
        <div className="mt-6 flex flex-col items-center">
          <div className="flex items-center space-x-2 mb-3">
            <KeyRound className="w-4 h-4 text-oil-gold" />
            <span className="text-xs font-medium text-emerald-100">Enter 4-Digit Security PIN</span>
          </div>

          <div className="flex space-x-4 mb-2">
            {[0, 1, 2, 3].map((idx) => (
              <div
                key={idx}
                className={`w-4 h-4 rounded-full border-2 transition-all duration-200 ${
                  pin.length > idx
                    ? 'bg-oil-gold border-oil-gold scale-110 shadow-sm'
                    : 'border-white/40 bg-white/10'
                }`}
              />
            ))}
          </div>

          {error ? (
            <div className="flex items-center space-x-1 text-xs text-rose-300 bg-rose-900/40 px-3 py-1 rounded-lg mt-2 border border-rose-500/30">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{error}</span>
            </div>
          ) : (
            <p className="text-[11px] text-emerald-200/60 mt-1">Default PIN for all units is 1234</p>
          )}
        </div>
      </div>

      {/* Numeric Keypad */}
      <div className="w-full max-w-xs mx-auto">
        <div className="grid grid-cols-3 gap-3.5">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((d) => (
            <button
              key={d}
              onClick={() => handleKeyPress(d)}
              className="h-14 rounded-2xl bg-white/10 hover:bg-white/20 active:bg-white/30 active:scale-95 border border-white/15 text-xl font-bold text-white transition-all shadow-xs flex items-center justify-center"
            >
              {d}
            </button>
          ))}
          <button
            onClick={() => handleQuickDemo(selectedFlat)}
            className="h-14 rounded-2xl bg-oil-gold/20 hover:bg-oil-gold/30 active:scale-95 border border-oil-gold/40 text-xs font-bold text-oil-gold transition-all flex flex-col items-center justify-center"
            title="Instant Demo Login"
          >
            <Check className="w-4 h-4 mb-0.5" />
            <span>Fast Pass</span>
          </button>
          <button
            onClick={() => handleKeyPress('0')}
            className="h-14 rounded-2xl bg-white/10 hover:bg-white/20 active:bg-white/30 active:scale-95 border border-white/15 text-xl font-bold text-white transition-all shadow-xs flex items-center justify-center"
          >
            0
          </button>
          <button
            onClick={handleDelete}
            className="h-14 rounded-2xl bg-white/10 hover:bg-white/20 active:bg-white/30 active:scale-95 border border-white/15 text-xs font-semibold text-white/80 transition-all flex items-center justify-center"
          >
            Delete
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-[10px] text-emerald-300/50 mt-4">
        Protected by OIL Resident Security Verification
      </div>
    </div>
  );
};
