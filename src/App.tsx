import React, { useState, useEffect } from 'react';
import { StorageService } from './services/storage';
import { Resident, Bill, Notice, DiscussionTopic, DiscussionComment, AppTab, PaymentReceipt } from './types';
import { IPhoneFrame } from './components/IPhoneFrame';
import { IPhoneStatusBar } from './components/IPhoneStatusBar';
import { IPhoneHeader } from './components/IPhoneHeader';
import { IPhoneTabBar } from './components/IPhoneTabBar';
import { LoginPinScreen } from './screens/LoginPinScreen';
import { TowerUnitsScreen } from './screens/TowerUnitsScreen';
import { BillsScreen } from './screens/BillsScreen';
import { NoticeBoardScreen } from './screens/NoticeBoardScreen';
import { DiscussionScreen } from './screens/DiscussionScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { X, Shield } from 'lucide-react';

export const App: React.FC = () => {
  const [currentUnit, setCurrentUnit] = useState<string>(() => StorageService.getCurrentUnit());
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const [currentTab, setCurrentTab] = useState<AppTab>('bills');
  const [showUnitSwitcherModal, setShowUnitSwitcherModal] = useState<boolean>(false);

  // Core app data state
  const [residents, setResidents] = useState<Resident[]>(() => StorageService.getResidents());
  const [bills, setBills] = useState<Bill[]>(() => StorageService.getBills());
  const [notices, setNotices] = useState<Notice[]>(() => StorageService.getNotices());
  const [topics, setTopics] = useState<DiscussionTopic[]>(() => StorageService.getTopics());
  const [comments, setComments] = useState<DiscussionComment[]>(() => StorageService.getComments());

  const currentResident = residents.find((r) => r.flatNumber === currentUnit) || residents[0];

  const unpaidBillsCount = bills.filter((b) => b.flatNumber === currentUnit && !b.isPaid).length;

  const handleLoginSuccess = (unit: string) => {
    setCurrentUnit(unit);
    StorageService.setCurrentUnit(unit);
    setIsLoggedIn(true);
  };

  const handleSignOut = () => {
    setIsLoggedIn(false);
  };

  const handleSelectUnit = (unit: string) => {
    setCurrentUnit(unit);
    StorageService.setCurrentUnit(unit);
    setShowUnitSwitcherModal(false);
  };

  const handlePayBill = (billId: number, method: string, amount: number): PaymentReceipt => {
    const receipt = StorageService.payBill(billId, method, amount);
    setBills(StorageService.getBills());
    return receipt;
  };

  const handlePayAll = (flat: string, method: string, amount: number): PaymentReceipt => {
    const receipt = StorageService.payAllBills(flat, method, amount);
    setBills(StorageService.getBills());
    return receipt;
  };

  const handleAddNotice = (notice: Omit<Notice, 'id' | 'date'>) => {
    StorageService.addNotice(notice);
    setNotices(StorageService.getNotices());
  };

  const handleAddTopic = (topic: { title: string; category: DiscussionTopic['category']; description: string; authorFlat: string; authorName: string; authorFloor: number }) => {
    StorageService.addTopic(topic);
    setTopics(StorageService.getTopics());
  };

  const handleToggleUpvote = (topicId: number) => {
    const updated = StorageService.toggleUpvote(topicId);
    setTopics([...updated]);
  };

  const handleAddComment = (topicId: number, text: string) => {
    StorageService.addComment(
      topicId,
      text,
      currentResident.flatNumber,
      currentResident.name || `Unit ${currentResident.flatNumber}`,
      currentResident.floor
    );
    setComments(StorageService.getComments());
    setTopics(StorageService.getTopics());
  };

  const handleUpdatePin = (newPin: string): boolean => {
    const success = StorageService.updateResidentPin(currentResident.flatNumber, newPin);
    if (success) {
      setResidents(StorageService.getResidents());
    }
    return success;
  };

  return (
    <IPhoneFrame>
      {/* Top Safe Area & Status Bar */}
      <div className="bg-oil-dark shrink-0 pt-safe">
        <IPhoneStatusBar darkText={false} />
      </div>

      {!isLoggedIn ? (
        <LoginPinScreen residents={residents} onLoginSuccess={handleLoginSuccess} />
      ) : (
        <div className="flex-1 flex flex-col overflow-hidden relative bg-oil-surface">
          {/* Cupertino Navigation Header */}
          <IPhoneHeader
            currentResident={currentResident}
            onOpenUnitSwitch={() => setShowUnitSwitcherModal(true)}
            onSignOut={handleSignOut}
          />

          {/* Main Tab Viewport (Scrollable with iOS momentum) */}
          <main className="flex-1 overflow-y-auto overscroll-contain">
            {currentTab === 'units' && (
              <TowerUnitsScreen
                residents={residents}
                currentUnit={currentUnit}
                onSelectUnit={handleSelectUnit}
              />
            )}

            {currentTab === 'bills' && (
              <BillsScreen
                bills={bills}
                currentResident={currentResident}
                onPayBill={handlePayBill}
                onPayAll={handlePayAll}
              />
            )}

            {currentTab === 'notices' && (
              <NoticeBoardScreen
                notices={notices}
                onAddNotice={handleAddNotice}
              />
            )}

            {currentTab === 'discussions' && (
              <DiscussionScreen
                topics={topics}
                comments={comments}
                currentResident={currentResident}
                onAddTopic={handleAddTopic}
                onToggleUpvote={handleToggleUpvote}
                onAddComment={handleAddComment}
              />
            )}

            {currentTab === 'profile' && (
              <ProfileScreen
                currentResident={currentResident}
                onUpdatePin={handleUpdatePin}
                onSignOut={handleSignOut}
                onSwitchUnit={() => setShowUnitSwitcherModal(true)}
              />
            )}
          </main>

          {/* iOS Bottom Tab Bar */}
          <IPhoneTabBar
            currentTab={currentTab}
            onSelectTab={setCurrentTab}
            unpaidCount={unpaidBillsCount}
          />

          {/* Unit Switcher Bottom Sheet */}
          {showUnitSwitcherModal && (
            <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4">
              <div className="w-full max-w-[430px] bg-white rounded-t-3xl sm:rounded-3xl max-h-[80vh] flex flex-col shadow-ios-sheet overflow-hidden animate-in slide-in-from-bottom duration-200">
                <div className="w-full flex justify-center pt-3 pb-1">
                  <div className="w-10 h-1.5 bg-neutral-300 rounded-full"></div>
                </div>

                <div className="px-5 pt-2 pb-3 border-b border-neutral-100 flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-neutral-900">Switch Active Unit</h3>
                    <p className="text-[11px] text-neutral-500">Tower 3 HD Oil Housing (049 to 072)</p>
                  </div>
                  <button
                    onClick={() => setShowUnitSwitcherModal(false)}
                    className="p-1 rounded-full hover:bg-neutral-100 text-neutral-400"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-4 overflow-y-auto grid grid-cols-3 gap-2">
                  {residents.map((r) => {
                    const isSelected = r.flatNumber === currentUnit;
                    return (
                      <button
                        key={r.flatNumber}
                        onClick={() => handleSelectUnit(r.flatNumber)}
                        className={`p-3 rounded-2xl text-left border transition-all active:scale-95 ${
                          isSelected
                            ? 'border-oil-green bg-emerald-50 ring-2 ring-oil-green/20'
                            : 'border-neutral-200 bg-neutral-50 hover:bg-neutral-100'
                        }`}
                      >
                        <span className={`text-sm font-black block ${isSelected ? 'text-oil-green' : 'text-neutral-900'}`}>
                          Unit {r.flatNumber}
                        </span>
                        <span className="text-[10px] text-neutral-500 truncate block mt-0.5">
                          {r.name}
                        </span>
                        <span className="text-[9px] text-neutral-400 block">
                          Floor {r.floor}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </IPhoneFrame>
  );
};

export default App;
