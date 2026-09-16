import { Resident, Bill, Notice, DiscussionTopic, DiscussionComment, PaymentReceipt } from '../types';
import { INITIAL_RESIDENTS, INITIAL_BILLS, INITIAL_NOTICES, INITIAL_TOPICS, INITIAL_COMMENTS } from '../data/seedData';

const KEYS = {
  CURRENT_UNIT: 't3_iphone_current_unit',
  RESIDENTS: 't3_iphone_residents',
  BILLS: 't3_iphone_bills',
  NOTICES: 't3_iphone_notices',
  TOPICS: 't3_iphone_topics',
  COMMENTS: 't3_iphone_comments',
  RECEIPTS: 't3_iphone_receipts'
};

export const StorageService = {
  getCurrentUnit(): string {
    return localStorage.getItem(KEYS.CURRENT_UNIT) || '049';
  },

  setCurrentUnit(flat: string): void {
    localStorage.setItem(KEYS.CURRENT_UNIT, flat);
  },

  clearCurrentUnit(): void {
    localStorage.removeItem(KEYS.CURRENT_UNIT);
  },

  getResidents(): Resident[] {
    const raw = localStorage.getItem(KEYS.RESIDENTS);
    if (!raw) {
      localStorage.setItem(KEYS.RESIDENTS, JSON.stringify(INITIAL_RESIDENTS));
      return INITIAL_RESIDENTS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_RESIDENTS;
    }
  },

  updateResident(updated: Resident): void {
    const residents = this.getResidents().map((r) => (r.flatNumber === updated.flatNumber ? updated : r));
    localStorage.setItem(KEYS.RESIDENTS, JSON.stringify(residents));
  },

  updateResidentPin(flatNumber: string, newPin: string): boolean {
    const residents = this.getResidents();
    const index = residents.findIndex((r) => r.flatNumber === flatNumber);
    if (index !== -1) {
      residents[index].pin = newPin;
      localStorage.setItem(KEYS.RESIDENTS, JSON.stringify(residents));
      return true;
    }
    return false;
  },

  getBills(): Bill[] {
    const raw = localStorage.getItem(KEYS.BILLS);
    if (!raw) {
      localStorage.setItem(KEYS.BILLS, JSON.stringify(INITIAL_BILLS));
      return INITIAL_BILLS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_BILLS;
    }
  },

  payBill(billId: number, paymentMethod: string, amount: number): PaymentReceipt {
    const bills = this.getBills();
    const index = bills.findIndex((b) => b.id === billId);
    if (index === -1) throw new Error('Bill not found');

    const bill = bills[index];
    const timestamp = new Date().toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
    const txnRef = `OIL-T3-${bill.flatNumber}-${Date.now().toString().slice(-6)}`;

    bill.isPaid = true;
    bill.paidDate = timestamp;
    bill.paymentRef = txnRef;
    bill.paymentMethod = paymentMethod;
    bill.totalAmount = amount;
    bill.societyMaintenance = amount;

    bills[index] = bill;
    localStorage.setItem(KEYS.BILLS, JSON.stringify(bills));

    const residents = this.getResidents();
    const res = residents.find((r) => r.flatNumber === bill.flatNumber);

    const receipt: PaymentReceipt = {
      billId: bill.id,
      isBulk: false,
      flatNumber: bill.flatNumber,
      residentName: res?.name || `Unit ${bill.flatNumber}`,
      amount: amount,
      billingMonth: bill.month,
      transactionRef: txnRef,
      paymentMethod: paymentMethod,
      date: timestamp
    };

    this.saveReceipt(receipt);
    return receipt;
  },

  payAllBills(flatNumber: string, paymentMethod: string, amount: number): PaymentReceipt {
    const bills = this.getBills();
    const timestamp = new Date().toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
    const txnRef = `OIL-T3-BULK-${flatNumber}-${Date.now().toString().slice(-6)}`;

    const unpaidCount = bills.filter((b) => b.flatNumber === flatNumber && !b.isPaid).length;

    bills.forEach((b) => {
      if (b.flatNumber === flatNumber && !b.isPaid) {
        b.isPaid = true;
        b.paidDate = timestamp;
        b.paymentRef = txnRef;
        b.paymentMethod = paymentMethod;
      }
    });

    localStorage.setItem(KEYS.BILLS, JSON.stringify(bills));

    const residents = this.getResidents();
    const res = residents.find((r) => r.flatNumber === flatNumber);

    const receipt: PaymentReceipt = {
      billId: 0,
      isBulk: true,
      flatNumber: flatNumber,
      residentName: res?.name || `Unit ${flatNumber}`,
      amount: amount,
      billingMonth: unpaidCount > 0 ? `${unpaidCount} Society Maintenance Invoices` : 'Society Maintenance Dues',
      transactionRef: txnRef,
      paymentMethod: paymentMethod,
      date: timestamp
    };

    this.saveReceipt(receipt);
    return receipt;
  },

  getReceipts(): PaymentReceipt[] {
    const raw = localStorage.getItem(KEYS.RECEIPTS);
    return raw ? JSON.parse(raw) : [];
  },

  saveReceipt(receipt: PaymentReceipt): void {
    const list = this.getReceipts();
    list.unshift(receipt);
    localStorage.setItem(KEYS.RECEIPTS, JSON.stringify(list));
  },

  getNotices(): Notice[] {
    const raw = localStorage.getItem(KEYS.NOTICES);
    if (!raw) {
      localStorage.setItem(KEYS.NOTICES, JSON.stringify(INITIAL_NOTICES));
      return INITIAL_NOTICES;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_NOTICES;
    }
  },

  addNotice(notice: Omit<Notice, 'id' | 'date'>): Notice {
    const notices = this.getNotices();
    const newNotice: Notice = {
      ...notice,
      id: Date.now(),
      date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
    };
    notices.unshift(newNotice);
    localStorage.setItem(KEYS.NOTICES, JSON.stringify(notices));
    return newNotice;
  },

  getTopics(): DiscussionTopic[] {
    const raw = localStorage.getItem(KEYS.TOPICS);
    if (!raw) {
      localStorage.setItem(KEYS.TOPICS, JSON.stringify(INITIAL_TOPICS));
      return INITIAL_TOPICS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_TOPICS;
    }
  },

  addTopic(topic: { title: string; category: DiscussionTopic['category']; description: string; authorFlat: string; authorName: string; authorFloor: number }): DiscussionTopic {
    const topics = this.getTopics();
    const newTopic: DiscussionTopic = {
      ...topic,
      id: Date.now(),
      createdAt: Date.now(),
      status: 'OPEN',
      upvotes: 0,
      userUpvoted: false,
      commentsCount: 0
    };
    topics.unshift(newTopic);
    localStorage.setItem(KEYS.TOPICS, JSON.stringify(topics));
    return newTopic;
  },

  toggleUpvote(topicId: number): DiscussionTopic[] {
    const topics = this.getTopics();
    const index = topics.findIndex((t) => t.id === topicId);
    if (index !== -1) {
      const topic = topics[index];
      if (topic.userUpvoted) {
        topic.upvotes = Math.max(0, topic.upvotes - 1);
        topic.userUpvoted = false;
      } else {
        topic.upvotes += 1;
        topic.userUpvoted = true;
      }
      topics[index] = topic;
      localStorage.setItem(KEYS.TOPICS, JSON.stringify(topics));
    }
    return topics;
  },

  getComments(topicId?: number): DiscussionComment[] {
    const raw = localStorage.getItem(KEYS.COMMENTS);
    const comments: DiscussionComment[] = raw ? JSON.parse(raw) : INITIAL_COMMENTS;
    if (!raw) {
      localStorage.setItem(KEYS.COMMENTS, JSON.stringify(INITIAL_COMMENTS));
    }
    if (topicId !== undefined) {
      return comments.filter((c) => c.topicId === topicId);
    }
    return comments;
  },

  addComment(topicId: number, commentText: string, authorFlat: string, authorName: string, authorFloor: number): DiscussionComment {
    const comments = this.getComments();
    const newComment: DiscussionComment = {
      id: Date.now(),
      topicId,
      authorFlat,
      authorName,
      authorFloor,
      comment: commentText,
      createdAt: Date.now()
    };
    comments.push(newComment);
    localStorage.setItem(KEYS.COMMENTS, JSON.stringify(comments));

    // Update topic comment count
    const topics = this.getTopics();
    const tIndex = topics.findIndex((t) => t.id === topicId);
    if (tIndex !== -1) {
      topics[tIndex].commentsCount = (topics[tIndex].commentsCount || 0) + 1;
      localStorage.setItem(KEYS.TOPICS, JSON.stringify(topics));
    }

    return newComment;
  }
};
