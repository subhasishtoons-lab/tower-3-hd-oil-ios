export interface Resident {
  flatNumber: string;
  floor: number;
  name: string;
  designation: string;
  oilEmpId: string;
  phone: string;
  email: string;
  pin: string;
  intercom: string;
  isCommitteeMember: boolean;
  committeeRole?: string;
  parkingSlot?: string;
  familyMembers?: number;
}

export interface Bill {
  id: number;
  flatNumber: string;
  month: string;
  year: number;
  societyMaintenance: number;
  dgBackupPower: number;
  liftMaintenance: number;
  waterSupplyCharges: number;
  sinkingFund: number;
  festivalFund: number;
  totalAmount: number;
  dueDate: string;
  isPaid: boolean;
  paidDate?: string | null;
  paymentRef?: string | null;
  paymentMethod?: string | null;
}

export interface Notice {
  id: number;
  title: string;
  category: 'URGENT' | 'MAINTENANCE' | 'WATER' | 'POWER' | 'MEETING' | 'FESTIVAL' | 'GENERAL';
  content: string;
  date: string;
  postedBy: string;
  isPinned: boolean;
  priority: 'HIGH' | 'MEDIUM' | 'NORMAL';
}

export interface DiscussionTopic {
  id: number;
  title: string;
  category: 'CLEANING' | 'PARKING' | 'LIFT' | 'WATER_SUPPLY' | 'DG_BACKUP' | 'SECURITY' | 'GENERAL';
  description: string;
  authorFlat: string;
  authorName: string;
  authorFloor: number;
  createdAt: number;
  status: 'OPEN' | 'RESOLVED';
  upvotes: number;
  userUpvoted?: boolean;
  commentsCount: number;
}

export interface DiscussionComment {
  id: number;
  topicId: number;
  authorFlat: string;
  authorName: string;
  authorFloor: number;
  comment: string;
  createdAt: number;
}

export interface PaymentReceipt {
  billId: number;
  isBulk: boolean;
  flatNumber: string;
  residentName: string;
  amount: number;
  billingMonth: string;
  transactionRef: string;
  paymentMethod: string;
  date: string;
}

export type AppTab = 'units' | 'bills' | 'notices' | 'discussions' | 'profile';
