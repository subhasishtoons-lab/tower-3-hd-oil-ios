import React, { useState } from 'react';
import { X, QrCode, CreditCard, Landmark, Building, CheckCircle2, ShieldCheck, Info } from 'lucide-react';
import { Bill } from '../types';

interface PaymentModalProps {
  bill: Bill | null;
  isBulk: boolean;
  totalDueAmount: number;
  flatNumber: string;
  residentName: string;
  onDismiss: () => void;
  onConfirmPayment: (paymentMethod: string, amount: number) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  bill,
  isBulk,
  totalDueAmount,
  flatNumber,
  residentName,
  onDismiss,
  onConfirmPayment
}) => {
  type MethodType = 'UPI' | 'CARD' | 'NET_BANKING' | 'SALARY';
  const [selectedMethodType, setSelectedMethodType] = useState<MethodType>('UPI');

  const defaultAmount = bill?.totalAmount || (totalDueAmount > 0 ? totalDueAmount : 568.0);
  const [amountText, setAmountText] = useState(defaultAmount.toFixed(2));

  // UPI State
  const [selectedUpiApp, setSelectedUpiApp] = useState('Google Pay');
  const [upiId, setUpiId] = useState('');

  // Card State
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardHolder, setCardHolder] = useState(residentName || 'Resident');

  // Net Banking State
  const [selectedBank, setSelectedBank] = useState('State Bank of India');

  const [isSubmitting, setIsSubmitting] = useState(false);

  const enteredAmount = parseFloat(amountText) || 0;

  const handlePay = () => {
    if (enteredAmount <= 0) return;
    setIsSubmitting(true);

    let finalMethod = 'UPI';
    if (selectedMethodType === 'UPI') {
      finalMethod = `UPI (${selectedUpiApp}${upiId ? ` - ${upiId}` : ''})`;
    } else if (selectedMethodType === 'CARD') {
      const last4 = cardNumber.slice(-4) || '8821';
      finalMethod = `Debit/Credit Card (•••• ${last4})`;
    } else if (selectedMethodType === 'NET_BANKING') {
      finalMethod = `Net Banking (${selectedBank})`;
    } else if (selectedMethodType === 'SALARY') {
      finalMethod = 'OIL Salary Deduction (Payroll)';
    }

    setTimeout(() => {
      setIsSubmitting(false);
      onConfirmPayment(finalMethod, enteredAmount);
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4">
      {/* iOS Bottom Sheet style container */}
      <div className="w-full max-w-[430px] bg-white rounded-t-3xl sm:rounded-3xl max-h-[90vh] flex flex-col shadow-ios-sheet overflow-hidden animate-in slide-in-from-bottom duration-200">
        {/* Grab Handle */}
        <div className="w-full flex justify-center pt-3 pb-1">
          <div className="w-10 h-1.5 bg-neutral-300 rounded-full"></div>
        </div>

        {/* Modal Header */}
        <div className="px-5 pt-2 pb-3 border-b border-neutral-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-neutral-900">
              {bill ? `Pay Maintenance • ${bill.month}` : 'Pay Society Maintenance'}
            </h2>
            <p className="text-[11px] text-neutral-500">Tower 3 • Unit {flatNumber} ({residentName})</p>
          </div>
          <button
            onClick={onDismiss}
            disabled={isSubmitting}
            className="p-1.5 rounded-full hover:bg-neutral-100 text-neutral-400 hover:text-neutral-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 overflow-y-auto space-y-4">
          {/* Amount Field (Editable for varying dues) */}
          <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-3.5">
            <label className="block text-[11px] font-semibold text-emerald-900 mb-1">
              Payment Amount (₹)
            </label>
            <div className="relative flex items-center">
              <span className="text-xl font-bold text-oil-green mr-1.5">₹</span>
              <input
                type="number"
                step="0.01"
                value={amountText}
                onChange={(e) => setAmountText(e.target.value)}
                placeholder="568.00"
                className="w-full bg-white px-3 py-2 text-lg font-bold text-neutral-900 rounded-xl border border-emerald-300 focus:outline-none focus:ring-2 focus:ring-oil-green"
              />
            </div>
            <div className="flex items-center space-x-1.5 mt-2 text-[11px] text-emerald-800">
              <Info className="w-3.5 h-3.5 shrink-0" />
              <span>Monthly dues may change every month as decided by the society.</span>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div>
            <label className="block text-xs font-bold text-neutral-800 mb-2">
              Select Payment Method
            </label>

            <div className="space-y-2">
              {/* UPI */}
              <div
                onClick={() => setSelectedMethodType('UPI')}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                  selectedMethodType === 'UPI'
                    ? 'border-oil-green bg-emerald-50/30 ring-1 ring-oil-green/30'
                    : 'border-neutral-200 bg-white hover:border-neutral-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-100 text-oil-green flex items-center justify-center">
                      <QrCode className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-neutral-900">UPI Instant Pay</p>
                      <p className="text-[11px] text-neutral-500">Google Pay, PhonePe, Paytm, BHIM</p>
                    </div>
                  </div>
                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      selectedMethodType === 'UPI'
                        ? 'border-oil-green bg-oil-green'
                        : 'border-neutral-300'
                    }`}
                  >
                    {selectedMethodType === 'UPI' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                </div>

                {selectedMethodType === 'UPI' && (
                  <div className="mt-3 pt-3 border-t border-neutral-100 space-y-2">
                    <div className="flex space-x-1.5">
                      {['Google Pay', 'PhonePe', 'Paytm', 'BHIM'].map((app) => (
                        <button
                          key={app}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedUpiApp(app);
                          }}
                          className={`flex-1 py-1 rounded-lg text-[10px] font-bold transition-colors ${
                            selectedUpiApp === app
                              ? 'bg-oil-green text-white shadow-xs'
                              : 'bg-neutral-100 text-neutral-600'
                          }`}
                        >
                          {app}
                        </button>
                      ))}
                    </div>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="Enter UPI ID (e.g. name@okhdfcbank, optional)"
                      className="w-full bg-white px-3 py-1.5 text-xs rounded-xl border border-neutral-200 focus:outline-none focus:ring-1 focus:ring-oil-green"
                    />
                  </div>
                )}
              </div>

              {/* Debit / Credit Card */}
              <div
                onClick={() => setSelectedMethodType('CARD')}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                  selectedMethodType === 'CARD'
                    ? 'border-oil-green bg-emerald-50/30 ring-1 ring-oil-green/30'
                    : 'border-neutral-200 bg-white hover:border-neutral-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-100 text-oil-green flex items-center justify-center">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-neutral-900">Debit / Credit Card</p>
                      <p className="text-[11px] text-neutral-500">Visa, Mastercard, RuPay & Corporate</p>
                    </div>
                  </div>
                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      selectedMethodType === 'CARD'
                        ? 'border-oil-green bg-oil-green'
                        : 'border-neutral-300'
                    }`}
                  >
                    {selectedMethodType === 'CARD' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                </div>

                {selectedMethodType === 'CARD' && (
                  <div className="mt-3 pt-3 border-t border-neutral-100 space-y-2">
                    <input
                      type="text"
                      maxLength={19}
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="Card Number (4532 •••• •••• 8821)"
                      className="w-full bg-white px-3 py-1.5 text-xs rounded-xl border border-neutral-200 focus:outline-none focus:ring-1 focus:ring-oil-green"
                    />
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        maxLength={5}
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="MM/YY"
                        className="w-1/2 bg-white px-3 py-1.5 text-xs rounded-xl border border-neutral-200 focus:outline-none focus:ring-1 focus:ring-oil-green"
                      />
                      <input
                        type="password"
                        maxLength={4}
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        placeholder="CVV"
                        className="w-1/2 bg-white px-3 py-1.5 text-xs rounded-xl border border-neutral-200 focus:outline-none focus:ring-1 focus:ring-oil-green"
                      />
                    </div>
                    <input
                      type="text"
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      placeholder="Cardholder Name"
                      className="w-full bg-white px-3 py-1.5 text-xs rounded-xl border border-neutral-200 focus:outline-none focus:ring-1 focus:ring-oil-green"
                    />
                  </div>
                )}
              </div>

              {/* Net Banking */}
              <div
                onClick={() => setSelectedMethodType('NET_BANKING')}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                  selectedMethodType === 'NET_BANKING'
                    ? 'border-oil-green bg-emerald-50/30 ring-1 ring-oil-green/30'
                    : 'border-neutral-200 bg-white hover:border-neutral-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-100 text-oil-green flex items-center justify-center">
                      <Landmark className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-neutral-900">Net Banking</p>
                      <p className="text-[11px] text-neutral-500">SBI, HDFC, ICICI, OIL Co-op Bank</p>
                    </div>
                  </div>
                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      selectedMethodType === 'NET_BANKING'
                        ? 'border-oil-green bg-oil-green'
                        : 'border-neutral-300'
                    }`}
                  >
                    {selectedMethodType === 'NET_BANKING' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                </div>

                {selectedMethodType === 'NET_BANKING' && (
                  <div className="mt-3 pt-3 border-t border-neutral-100">
                    <div className="grid grid-cols-2 gap-1.5">
                      {['State Bank of India', 'HDFC Bank', 'ICICI Bank', 'OIL Staff Co-op Bank'].map((b) => (
                        <button
                          key={b}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedBank(b);
                          }}
                          className={`py-1.5 px-2 rounded-lg text-[10px] font-semibold text-left transition-colors truncate ${
                            selectedBank === b
                              ? 'bg-oil-green text-white'
                              : 'bg-neutral-100 text-neutral-700'
                          }`}
                        >
                          {b}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* OIL Salary Deduction */}
              <div
                onClick={() => setSelectedMethodType('SALARY')}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                  selectedMethodType === 'SALARY'
                    ? 'border-oil-green bg-emerald-50/30 ring-1 ring-oil-green/30'
                    : 'border-neutral-200 bg-white hover:border-neutral-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-100 text-oil-green flex items-center justify-center">
                      <Building className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-neutral-900">OIL Salary Deduction</p>
                      <p className="text-[11px] text-neutral-500">Monthly payroll adjustment for company quarter</p>
                    </div>
                  </div>
                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      selectedMethodType === 'SALARY'
                        ? 'border-oil-green bg-oil-green'
                        : 'border-neutral-300'
                    }`}
                  >
                    {selectedMethodType === 'SALARY' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                </div>

                {selectedMethodType === 'SALARY' && (
                  <div className="mt-3 pt-3 border-t border-neutral-100 text-[11px] text-neutral-600">
                    Maintenance charges will be automatically billed to OIL Finance & Accounts (Payroll section) for Unit {flatNumber}.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Action Footer */}
        <div className="p-4 border-t border-neutral-100 bg-neutral-50 flex items-center space-x-3">
          <button
            onClick={onDismiss}
            disabled={isSubmitting}
            className="w-1/3 py-3 rounded-2xl border border-neutral-200 text-xs font-bold text-neutral-700 hover:bg-neutral-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handlePay}
            disabled={isSubmitting || enteredAmount <= 0}
            className="w-2/3 py-3 rounded-2xl bg-oil-green hover:bg-oil-forest active:scale-98 text-xs font-bold text-white shadow-md transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Securing Transaction...</span>
              </div>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4 text-oil-gold" />
                <span>Proceed to Pay ₹{enteredAmount.toFixed(2)}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
