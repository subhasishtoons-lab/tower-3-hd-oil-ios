import React, { useState } from 'react';
import { Bell, Pin, Plus, Droplets, Zap, Wrench, Users, Sparkles, AlertCircle, X, Check } from 'lucide-react';
import { Notice } from '../types';

interface NoticeBoardScreenProps {
  notices: Notice[];
  onAddNotice: (notice: Omit<Notice, 'id' | 'date'>) => void;
}

export const NoticeBoardScreen: React.FC<NoticeBoardScreenProps> = ({ notices, onAddNotice }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form state
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<Notice['category']>('MAINTENANCE');
  const [newContent, setNewContent] = useState('');
  const [newPriority, setNewPriority] = useState<Notice['priority']>('NORMAL');
  const [isPinned, setIsPinned] = useState(false);

  const categories = [
    { id: 'ALL', label: 'All Notices', icon: Bell },
    { id: 'URGENT', label: 'Urgent', icon: AlertCircle },
    { id: 'MAINTENANCE', label: 'Maintenance', icon: Wrench },
    { id: 'WATER', label: 'Water', icon: Droplets },
    { id: 'POWER', label: 'Power', icon: Zap },
    { id: 'MEETING', label: 'Meetings', icon: Users },
    { id: 'FESTIVAL', label: 'Festivals', icon: Sparkles }
  ];

  const filteredNotices = notices.filter((n) => {
    if (selectedCategory === 'ALL') return true;
    return n.category === selectedCategory;
  });

  const handleCreateNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    onAddNotice({
      title: newTitle.trim(),
      category: newCategory,
      content: newContent.trim(),
      postedBy: 'Tower 3 Management Committee',
      isPinned,
      priority: newPriority
    });

    setNewTitle('');
    setNewContent('');
    setIsAddModalOpen(false);
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'WATER':
        return <Droplets className="w-4 h-4 text-blue-500" />;
      case 'POWER':
        return <Zap className="w-4 h-4 text-amber-500" />;
      case 'MAINTENANCE':
        return <Wrench className="w-4 h-4 text-emerald-600" />;
      case 'MEETING':
        return <Users className="w-4 h-4 text-purple-500" />;
      case 'FESTIVAL':
        return <Sparkles className="w-4 h-4 text-rose-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-orange-500" />;
    }
  };

  return (
    <div className="pb-24 px-4 pt-3 space-y-4">
      {/* Action Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-neutral-900">Digital Notice Board</h2>
          <p className="text-xs text-neutral-500">Official updates & maintenance circulars</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-oil-green hover:bg-oil-forest text-white text-xs font-semibold shadow-xs active:scale-95 transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Post Circular</span>
        </button>
      </div>

      {/* Category Pills */}
      <div className="flex space-x-1.5 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isSelected = selectedCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                isSelected
                  ? 'bg-oil-green text-white shadow-xs'
                  : 'bg-white text-neutral-600 border border-neutral-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Notices List */}
      <div className="space-y-3">
        {filteredNotices.map((notice) => (
          <div
            key={notice.id}
            className={`bg-white rounded-2xl p-4 border transition-all shadow-xs ${
              notice.isPinned
                ? 'border-emerald-300 ring-1 ring-emerald-400/20 bg-emerald-50/10'
                : 'border-neutral-200/80'
            }`}
          >
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 rounded-lg bg-neutral-100">
                  {getCategoryIcon(notice.category)}
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                  {notice.category}
                </span>
                {notice.priority === 'HIGH' && (
                  <span className="text-[9px] font-bold bg-rose-100 text-rose-700 px-1.5 py-0.5 rounded-md border border-rose-200">
                    URGENT
                  </span>
                )}
              </div>

              {notice.isPinned && (
                <div className="flex items-center space-x-1 text-oil-green text-[10px] font-bold bg-emerald-100/60 px-2 py-0.5 rounded-full">
                  <Pin className="w-3 h-3 fill-oil-green" />
                  <span>PINNED</span>
                </div>
              )}
            </div>

            {/* Title */}
            <h3 className="text-sm font-bold text-neutral-900 mt-2.5 leading-snug">
              {notice.title}
            </h3>

            {/* Body */}
            <p className="text-xs text-neutral-600 mt-1.5 leading-relaxed">
              {notice.content}
            </p>

            {/* Footer */}
            <div className="mt-3 pt-2.5 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-400">
              <span>{notice.postedBy}</span>
              <span className="font-medium text-neutral-500">{notice.date}</span>
            </div>
          </div>
        ))}

        {filteredNotices.length === 0 && (
          <div className="text-center py-12 text-neutral-400 text-xs">
            No circulars in this category.
          </div>
        )}
      </div>

      {/* Add Notice Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4">
          <div className="w-full max-w-[430px] bg-white rounded-t-3xl sm:rounded-3xl max-h-[90vh] flex flex-col shadow-ios-sheet overflow-hidden animate-in slide-in-from-bottom duration-200">
            <div className="w-full flex justify-center pt-3 pb-1">
              <div className="w-10 h-1.5 bg-neutral-300 rounded-full"></div>
            </div>

            <div className="px-5 pt-2 pb-3 border-b border-neutral-100 flex items-center justify-between">
              <h2 className="text-base font-bold text-neutral-900">Post Official Notice</h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-full hover:bg-neutral-100 text-neutral-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNotice} className="p-5 overflow-y-auto space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-neutral-800 mb-1">Notice Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Lift Servicing Schedule"
                  className="w-full bg-white p-2.5 rounded-xl border border-neutral-200 focus:ring-1 focus:ring-oil-green"
                />
              </div>

              <div>
                <label className="block font-bold text-neutral-800 mb-1">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as Notice['category'])}
                  className="w-full bg-white p-2.5 rounded-xl border border-neutral-200 focus:ring-1 focus:ring-oil-green text-xs"
                >
                  <option value="MAINTENANCE">Maintenance</option>
                  <option value="WATER">Water Supply</option>
                  <option value="POWER">Power & DG</option>
                  <option value="MEETING">Meeting</option>
                  <option value="FESTIVAL">Festival & Welfare</option>
                  <option value="URGENT">Urgent Alert</option>
                  <option value="GENERAL">General</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-neutral-800 mb-1">Notice Content</label>
                <textarea
                  rows={4}
                  required
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Enter details of the circular for Tower 3 residents..."
                  className="w-full bg-white p-2.5 rounded-xl border border-neutral-200 focus:ring-1 focus:ring-oil-green"
                />
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="pinCheck"
                  checked={isPinned}
                  onChange={(e) => setIsPinned(e.target.checked)}
                  className="w-4 h-4 rounded text-oil-green focus:ring-oil-green"
                />
                <label htmlFor="pinCheck" className="text-neutral-700 font-medium">
                  Pin to top of Notice Board
                </label>
              </div>

              <div className="pt-3 flex space-x-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-neutral-200 text-neutral-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-oil-green text-white font-bold hover:bg-oil-forest shadow-xs"
                >
                  Publish Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
