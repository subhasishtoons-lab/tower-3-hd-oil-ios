import React, { useState } from 'react';
import { Receipt, CheckCircle2, Clock, Info, ShieldCheck, ChevronRight } from 'lucide-react';
import { Bill, Resident, PaymentReceipt } from '../types';
import { PaymentModal } from './PaymentModal';
import { PaymentReceiptModal } from './PaymentReceiptModal';

interface BillsScreenProps {
  bills: Bill[];
  currentResident: Resident;
  onPayBill: (billId: number, method: string, amount: number) => PaymentReceipt;
  onPayAll: (flatNumber: string, method: string, amount: number) => PaymentReceipt;
}

export const BillsScreen: React.FC<BillsScreenProps> = ({
  bills,
  currentResident,
  onPayBill,
  onPayAll
}) => {
  const [filter, setFilter] = useState<'ALL' | 'DUE' | 'PAID'>('ALL');
  const [activeModalBill, setActiveModalBill] = useState<Bill | null>(null);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [receiptToShow, setReceiptToShow] = useState<PaymentReceipt | null>(null);

  // Filter bills for current unit
  const unitBills = bills.filter((b) => b.flatNumber === currentResident.flatNumber);
  const dueBills = unitBills.filter((b) => !b.isPaid);
  const paidBills = unitBills.filter((b) => b.isPaid);

  const displayedBills = unitBills.filter((b) => {
    if (filter === 'DUE') return !b.isPaid;
    if (filter === 'PAID') return b.isPaid;
    return true;
  });

  const handleOpenPaySingle = (bill: Bill) => {
    setActiveModalBill(bill);
    setIsBulkModalOpen(false);
  };

  const handleOpenPayBulk = () => {
    setActiveModalBill(null);
    setIsBulkModalOpen(true);
  };

  const handleConfirmPayment = (method: string, amount: number) => {
    if (isBulkModalOpen) {
      const receipt = onPayAll(currentResident.flatNumber, method, amount);
      setIsBulkModalOpen(false);
      setReceiptToShow(receipt);
    } else if (activeModalBill) {
      const receipt = onPayBill(activeModalBill.id, method, amount);
      setActiveModalBill(null);
      setReceiptToShow(receipt);
    }
  };

  const handleViewExistingReceipt = (bill: Bill) => {
    setReceiptToShow({
      billId: bill.id,
      isBulk: false,
      flatNumber: bill.flatNumber,
      residentName: currentResident.name || `Unit ${bill.flatNumber}`,
      amount: bill.totalAmount,
      billingMonth: bill.month,
      transactionRef: bill.paymentRef || `OIL-T3-${bill.flatNumber}-REF`,
      paymentMethod: bill.paymentMethod || 'Settled via Society Office',
      date: bill.paidDate || '15 Sep 2026'
    });
  };

  return (
    <div className="pb-24 px-4 pt-3 space-y-4">
      {/* Society Maintenance Dues & Payment Banner */}
      <div className="bg-white rounded-3xl p-4.5 border border-neutral-200/90 shadow-ios">
        <div className="flex items-start justify-between">
          <div className="pr-2">
            <h2 className="text-base font-extrabold text-neutral-900 tracking-tight">
              Tower 3 Society Maintenance
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Monthly dues may change every month as decided by the society.
            </p>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-oil-green flex items-center justify-center shrink-0 border border-emerald-200/50">
            <Receipt className="w-5 h-5" />
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-neutral-500 font-medium">Pending Cycles</span>
            <p className="text-sm font-bold text-oil-dark mt-0.5">
              {dueBills.length} Billing Month{dueBills.length !== 1 ? 's' : ''}
            </p>
          </div>

          <button
            onClick={handleOpenPayBulk}
            className="px-4 py-2.5 rounded-2xl bg-oil-green hover:bg-oil-forest active:scale-95 text-white font-bold text-xs shadow-md transition-all flex items-center space-x-1.5"
          >
            <span>Pay Society Dues</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Segmented Filter Control (iOS Style) */}
      <div className="bg-neutral-200/80 p-1 rounded-2xl flex text-xs font-semibold">
        <button
          onClick={() => setFilter('ALL')}
          className={`flex-1 py-1.5 rounded-xl transition-all ${
            filter === 'ALL'
              ? 'bg-white text-neutral-900 shadow-xs'
              : 'text-neutral-600 hover:text-neutral-900'
          }`}
        >
          All ({unitBills.length})
        </button>
        <button
          onClick={() => setFilter('DUE')}
          className={`flex-1 py-1.5 rounded-xl transition-all ${
            filter === 'DUE'
              ? 'bg-white text-dueRed shadow-xs font-bold'
              : 'text-neutral-600 hover:text-neutral-900'
          }`}
        >
          Due ({dueBills.length})
        </button>
        <button
          onClick={() => setFilter('PAID')}
          className={`flex-1 py-1.5 rounded-xl transition-all ${
            filter === 'PAID'
              ? 'bg-white text-paidGreen shadow-xs font-bold'
              : 'text-neutral-600 hover:text-neutral-900'
          }`}
        >
          Paid ({paidBills.length})
        </button>
      </div>

      {/* Billing Schedule List */}
      <div className="space-y-3">
        {displayedBills.map((bill) => {
          return (
            <div
              key={bill.id}
              className="bg-white rounded-2xl p-4 border border-neutral-200/80 shadow-xs space-y-3"
            >
              {/* Card Header: Month and Status Badge */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-neutral-900">{bill.month}</h3>
                  <span className="text-[11px] text-neutral-500">
                    Due: {bill.dueDate}
                  </span>
                </div>

                {bill.isPaid ? (
                  <span className="flex items-center space-x-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>PAID</span>
                  </span>
                ) : (
                  <span className="flex items-center space-x-1 text-[11px] font-bold text-rose-800 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
                    <Clock className="w-3.5 h-3.5 text-rose-600" />
                    <span>DUE</span>
                  </span>
                )}
              </div>

              {/* Dynamic or Settled Amount Row */}
              {bill.isPaid ? (
                <div className="bg-neutral-50 rounded-xl p-3 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-neutral-500 text-[11px]">Paid Amount</span>
                    <p className="text-sm font-bold text-paidGreen">₹{bill.totalAmount.toFixed(2)}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-neutral-500 text-[11px]">Settled On</span>
                    <p className="font-semibold text-neutral-700 text-[11px]">{bill.paidDate}</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-start space-x-2 text-[11px] text-neutral-600 bg-neutral-50 p-2.5 rounded-xl border border-neutral-100">
                  <Info className="w-3.5 h-3.5 text-neutral-400 shrink-0 mt-0.5" />
                  <span>Monthly dues may change every month as decided by the society.</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-1 flex items-center justify-end space-x-2">
                {bill.isPaid ? (
                  <button
                    onClick={() => handleViewExistingReceipt(bill)}
                    className="w-full py-2.5 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700 text-xs font-bold transition-colors flex items-center justify-center space-x-1.5 shadow-2xs"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-oil-green" />
                    <span>View Official Receipt</span>
                  </button>
                ) : (
                  <button
                    onClick={() => handleOpenPaySingle(bill)}
                    className="w-full py-2.5 rounded-xl bg-oil-green hover:bg-oil-forest active:scale-98 text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center space-x-1.5"
                  >
                    <Receipt className="w-3.5 h-3.5 text-oil-gold" />
                    <span>Pay Bill</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {displayedBills.length === 0 && (
          <div className="text-center py-12 text-neutral-400 text-xs">
            No bills in this category.
          </div>
        )}
      </div>

      {/* Payment Gateway Modal */}
      {(activeModalBill || isBulkModalOpen) && (
        <PaymentModal
          bill={activeModalBill}
          isBulk={isBulkModalOpen}
          totalDueAmount={dueBills.length * 568.0}
          flatNumber={currentResident.flatNumber}
          residentName={currentResident.name}
          onDismiss={() => {
            setActiveModalBill(null);
            setIsBulkModalOpen(false);
          }}
          onConfirmPayment={handleConfirmPayment}
        />
      )}

      {/* Receipt Modal */}
      {receiptToShow && (
        <PaymentReceiptModal
          receipt={receiptToShow}
          onDismiss={() => setReceiptToShow(null)}
        />
      )}
    </div>
  );
};
