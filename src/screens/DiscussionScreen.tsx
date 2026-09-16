import React, { useState } from 'react';
import { MessageSquare, ThumbsUp, Plus, Send, X, Shield, Sparkles, Car, Trees, Wrench, ShieldAlert } from 'lucide-react';
import { DiscussionTopic, DiscussionComment, Resident } from '../types';

interface DiscussionScreenProps {
  topics: DiscussionTopic[];
  comments: DiscussionComment[];
  currentResident: Resident;
  onAddTopic: (topic: { title: string; category: DiscussionTopic['category']; description: string; authorFlat: string; authorName: string; authorFloor: number }) => void;
  onToggleUpvote: (topicId: number) => void;
  onAddComment: (topicId: number, text: string) => void;
}

export const DiscussionScreen: React.FC<DiscussionScreenProps> = ({
  topics,
  comments,
  currentResident,
  onAddTopic,
  onToggleUpvote,
  onAddComment
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [activeTopicForComments, setActiveTopicForComments] = useState<DiscussionTopic | null>(null);
  const [newCommentText, setNewCommentText] = useState('');
  const [isAddTopicModalOpen, setIsAddTopicModalOpen] = useState(false);

  // New topic form
  const [topicTitle, setTopicTitle] = useState('');
  const [topicCategory, setTopicCategory] = useState<DiscussionTopic['category']>('CLEANING');
  const [topicDescription, setTopicDescription] = useState('');

  const categories = [
    { id: 'ALL', label: 'All Topics' },
    { id: 'CLEANING', label: 'Cleaning & Green' },
    { id: 'PARKING', label: 'Parking & Shed' },
    { id: 'LIFT', label: 'Lifts' },
    { id: 'WATER_SUPPLY', label: 'Water' },
    { id: 'SECURITY', label: 'Security' },
    { id: 'GENERAL', label: 'General' }
  ];

  const filteredTopics = topics.filter((t) => {
    if (selectedCategory === 'ALL') return true;
    return t.category === selectedCategory;
  });

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTopicForComments || !newCommentText.trim()) return;

    onAddComment(activeTopicForComments.id, newCommentText.trim());
    setNewCommentText('');
  };

  const handleCreateTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topicTitle.trim() || !topicDescription.trim()) return;

    onAddTopic({
      title: topicTitle.trim(),
      category: topicCategory,
      description: topicDescription.trim(),
      authorFlat: currentResident.flatNumber,
      authorName: currentResident.name || `Unit ${currentResident.flatNumber}`,
      authorFloor: currentResident.floor
    });

    setTopicTitle('');
    setTopicDescription('');
    setIsAddTopicModalOpen(false);
  };

  const getTopicComments = (topicId: number) => {
    return comments.filter((c) => c.topicId === topicId);
  };

  return (
    <div className="pb-24 px-4 pt-3 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-neutral-900">Resident Discussions</h2>
          <p className="text-xs text-neutral-500">Tower 3 open community forum</p>
        </div>
        <button
          onClick={() => setIsAddTopicModalOpen(true)}
          className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-oil-green hover:bg-oil-forest text-white text-xs font-semibold shadow-xs active:scale-95 transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Topic</span>
        </button>
      </div>

      {/* Categories */}
      <div className="flex space-x-1.5 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedCategory === cat.id
                ? 'bg-oil-green text-white shadow-xs'
                : 'bg-white text-neutral-600 border border-neutral-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Topics List */}
      <div className="space-y-3">
        {filteredTopics.map((topic) => {
          const topicComments = getTopicComments(topic.id);

          return (
            <div
              key={topic.id}
              className="bg-white rounded-2xl p-4 border border-neutral-200/80 shadow-xs space-y-3"
            >
              {/* Top metadata */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded-md">
                    {topic.category}
                  </span>
                  <span className="text-[11px] text-neutral-400">•</span>
                  <span className="text-[11px] font-semibold text-oil-green">
                    {topic.authorName}
                  </span>
                </div>
                <span className="text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">
                  {topic.status}
                </span>
              </div>

              {/* Title & Description */}
              <div>
                <h3 className="text-sm font-bold text-neutral-900 leading-snug">
                  {topic.title}
                </h3>
                <p className="text-xs text-neutral-600 mt-1.5 leading-relaxed">
                  {topic.description}
                </p>
              </div>

              {/* Action row (Upvote & Comments trigger) */}
              <div className="pt-2 border-t border-neutral-100 flex items-center justify-between">
                <button
                  onClick={() => onToggleUpvote(topic.id)}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all active:scale-95 ${
                    topic.userUpvoted
                      ? 'bg-emerald-100 text-oil-green font-bold'
                      : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
                  }`}
                >
                  <ThumbsUp className={`w-3.5 h-3.5 ${topic.userUpvoted ? 'fill-oil-green' : ''}`} />
                  <span>{topic.upvotes} Support</span>
                </button>

                <button
                  onClick={() => setActiveTopicForComments(topic)}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-semibold transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-neutral-500" />
                  <span>{topicComments.length} Responses</span>
                </button>
              </div>
            </div>
          );
        })}

        {filteredTopics.length === 0 && (
          <div className="text-center py-12 text-neutral-400 text-xs">
            No discussion topics in this category.
          </div>
        )}
      </div>

      {/* Topic Comments Sheet Modal */}
      {activeTopicForComments && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4">
          <div className="w-full max-w-[430px] bg-white rounded-t-3xl sm:rounded-3xl max-h-[88vh] flex flex-col shadow-ios-sheet overflow-hidden animate-in slide-in-from-bottom duration-200">
            {/* Grab handle */}
            <div className="w-full flex justify-center pt-3 pb-1">
              <div className="w-10 h-1.5 bg-neutral-300 rounded-full"></div>
            </div>

            {/* Header */}
            <div className="px-5 pt-2 pb-3 border-b border-neutral-100 flex items-center justify-between">
              <div className="pr-3">
                <h3 className="text-sm font-bold text-neutral-900 line-clamp-1">
                  {activeTopicForComments.title}
                </h3>
                <p className="text-[11px] text-neutral-500">
                  Discussion • {getTopicComments(activeTopicForComments.id).length} comments
                </p>
              </div>
              <button
                onClick={() => setActiveTopicForComments(null)}
                className="p-1.5 rounded-full hover:bg-neutral-100 text-neutral-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Comments List */}
            <div className="p-4 overflow-y-auto space-y-3 flex-1">
              {/* Original Topic excerpt */}
              <div className="bg-emerald-50/50 p-3 rounded-2xl border border-emerald-100 text-xs text-neutral-700 mb-2">
                <span className="font-bold text-oil-green block mb-1">
                  {activeTopicForComments.authorName}
                </span>
                {activeTopicForComments.description}
              </div>

              {getTopicComments(activeTopicForComments.id).map((cmt) => (
                <div key={cmt.id} className="bg-neutral-50 p-3 rounded-2xl border border-neutral-200/70 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-neutral-900">
                      {cmt.authorName} (Unit {cmt.authorFlat})
                    </span>
                    <span className="text-[10px] text-neutral-400">
                      {new Date(cmt.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-neutral-700 leading-relaxed">{cmt.comment}</p>
                </div>
              ))}

              {getTopicComments(activeTopicForComments.id).length === 0 && (
                <div className="text-center py-8 text-neutral-400 text-xs">
                  Be the first resident to comment on this issue.
                </div>
              )}
            </div>

            {/* Add Comment Input Bar */}
            <form onSubmit={handlePostComment} className="p-3 border-t border-neutral-100 bg-white flex items-center space-x-2">
              <input
                type="text"
                required
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                placeholder={`Comment as ${currentResident.name || `Unit ${currentResident.flatNumber}`}...`}
                className="flex-1 bg-neutral-100 px-3.5 py-2.5 rounded-xl text-xs text-neutral-900 focus:outline-none focus:ring-1 focus:ring-oil-green placeholder:text-neutral-400"
              />
              <button
                type="submit"
                disabled={!newCommentText.trim()}
                className="p-2.5 rounded-xl bg-oil-green text-white hover:bg-oil-forest active:scale-95 disabled:opacity-40 transition-all shadow-xs"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Add Topic Modal */}
      {isAddTopicModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4">
          <div className="w-full max-w-[430px] bg-white rounded-t-3xl sm:rounded-3xl max-h-[90vh] flex flex-col shadow-ios-sheet overflow-hidden animate-in slide-in-from-bottom duration-200">
            <div className="w-full flex justify-center pt-3 pb-1">
              <div className="w-10 h-1.5 bg-neutral-300 rounded-full"></div>
            </div>

            <div className="px-5 pt-2 pb-3 border-b border-neutral-100 flex items-center justify-between">
              <h2 className="text-base font-bold text-neutral-900">Start Discussion Topic</h2>
              <button
                onClick={() => setIsAddTopicModalOpen(false)}
                className="p-1 rounded-full hover:bg-neutral-100 text-neutral-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTopic} className="p-5 overflow-y-auto space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-neutral-800 mb-1">Topic Title</label>
                <input
                  type="text"
                  required
                  value={topicTitle}
                  onChange={(e) => setTopicTitle(e.target.value)}
                  placeholder="e.g. Corridor lighting upgrade"
                  className="w-full bg-white p-2.5 rounded-xl border border-neutral-200 focus:ring-1 focus:ring-oil-green"
                />
              </div>

              <div>
                <label className="block font-bold text-neutral-800 mb-1">Category</label>
                <select
                  value={topicCategory}
                  onChange={(e) => setTopicCategory(e.target.value as DiscussionTopic['category'])}
                  className="w-full bg-white p-2.5 rounded-xl border border-neutral-200 focus:ring-1 focus:ring-oil-green text-xs"
                >
                  <option value="CLEANING">Cleaning & Sanitation</option>
                  <option value="PARKING">Parking & Car Shed</option>
                  <option value="LIFT">Lifts & Elevators</option>
                  <option value="WATER_SUPPLY">Water Supply</option>
                  <option value="SECURITY">Security & Access</option>
                  <option value="GENERAL">General Society Issue</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-neutral-800 mb-1">Description</label>
                <textarea
                  rows={4}
                  required
                  value={topicDescription}
                  onChange={(e) => setTopicDescription(e.target.value)}
                  placeholder="Describe your issue or suggestion clearly..."
                  className="w-full bg-white p-2.5 rounded-xl border border-neutral-200 focus:ring-1 focus:ring-oil-green"
                />
              </div>

              <div className="pt-3 flex space-x-2">
                <button
                  type="button"
                  onClick={() => setIsAddTopicModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-neutral-200 text-neutral-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-oil-green text-white font-bold hover:bg-oil-forest shadow-xs"
                >
                  Publish Topic
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
