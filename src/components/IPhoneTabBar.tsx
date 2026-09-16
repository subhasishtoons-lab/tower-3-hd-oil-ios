import React from 'react';
import { Building2, Receipt, Bell, MessageSquare, User } from 'lucide-react';
import { AppTab } from '../types';

interface IPhoneTabBarProps {
  currentTab: AppTab;
  onSelectTab: (tab: AppTab) => void;
  unpaidCount: number;
}

export const IPhoneTabBar: React.FC<IPhoneTabBarProps> = ({ currentTab, onSelectTab, unpaidCount }) => {
  const tabs: { id: AppTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'units', label: 'Units', icon: Building2 },
    { id: 'bills', label: 'Bills & Dues', icon: Receipt },
    { id: 'notices', label: 'Notices', icon: Bell },
    { id: 'discussions', label: 'Discussions', icon: MessageSquare },
    { id: 'profile', label: 'Profile', icon: User }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto bg-white/95 backdrop-blur-lg border-t border-neutral-200/80 z-40 pb-safe">
      <div className="flex items-center justify-around px-2 pt-2 pb-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`flex-1 flex flex-col items-center py-1 relative transition-colors duration-150 active:scale-95 ${
                isActive ? 'text-oil-green font-semibold' : 'text-neutral-400 hover:text-neutral-600'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110 stroke-[2.2]' : 'stroke-[1.8]'}`} />
                {tab.id === 'bills' && unpaidCount > 0 && (
                  <span className="absolute -top-1 -right-2 bg-dueRed text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full min-w-[16px] text-center border-2 border-white shadow-xs">
                    {unpaidCount}
                  </span>
                )}
              </div>
              <span className={`text-[10px] mt-1 tracking-tight ${isActive ? 'text-oil-green font-semibold' : 'text-neutral-500'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* iOS Home Indicator Bar */}
      <div className="w-full flex justify-center pb-2 pt-1">
        <div className="w-36 h-1 bg-neutral-300 rounded-full"></div>
      </div>
    </div>
  );
};
