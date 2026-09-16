import { Resident, Bill, Notice, DiscussionTopic, DiscussionComment } from '../types';

export const INITIAL_RESIDENTS: Resident[] = Array.from({ length: 24 }, (_, i) => {
  const flatNum = 49 + i;
  const flatStr = flatNum.toString().padStart(3, '0');
  const floor = Math.floor(i / 4) + 1;

  const designations = [
    'Superintending Engineer (Production)',
    'Senior Manager (Drilling)',
    'Chief Chemist (R&D)',
    'Executive Engineer (Civil)',
    'Senior Accounts Officer (Finance)',
    'Chief Manager (Instrumentation)',
    'Manager (Geology)',
    'Senior Medical Officer (OIL Hospital)'
  ];

  const names = [
    'S. Barua', 'P. K. Gogoi', 'D. K. Phukan', 'R. K. Saikia',
    'N. K. Hazarika', 'M. C. Sarmah', 'A. J. Bora', 'B. K. Deka',
    'T. R. Nath', 'H. P. Goswami', 'K. K. Chetia', 'J. N. Sonowal',
    'U. C. Dutta', 'P. J. Baruah', 'B. M. Kalita', 'S. N. Medhi',
    'A. K. Bhattacharyya', 'R. N. Das', 'P. C. Lahkar', 'G. K. Chaliha',
    'K. P. Talukdar', 'M. N. Tamuly', 'D. C. Mahanta', 'S. K. Rajkhowa'
  ];

  const isCommittee = flatStr === '049' || flatStr === '057' || flatStr === '065';
  const role = flatStr === '049' ? 'President (Tower 3)' : flatStr === '057' ? 'General Secretary' : flatStr === '065' ? 'Treasurer' : undefined;

  return {
    flatNumber: flatStr,
    floor,
    name: names[i] || `Resident ${flatStr}`,
    designation: designations[i % designations.length],
    oilEmpId: `OIL${104000 + flatNum}`,
    phone: `+91 94350 ${12000 + flatNum}`,
    email: `resident.${flatStr}@oilindia.in`,
    pin: '1234',
    intercom: `3${flatStr}`,
    isCommitteeMember: isCommittee,
    committeeRole: role,
    parkingSlot: `P-${flatStr}`,
    familyMembers: 2 + (i % 3)
  };
});

export const INITIAL_BILLS: Bill[] = [];

// Generate bills for each unit (September 2026 to March 2027)
const billingCycles = [
  { month: 'September 2026', year: 2026, dueDate: '15 Oct 2026', isPaid: true },
  { month: 'October 2026', year: 2026, dueDate: '15 Nov 2026', isPaid: false },
  { month: 'November 2026', year: 2026, dueDate: '15 Dec 2026', isPaid: false },
  { month: 'December 2026', year: 2026, dueDate: '15 Jan 2027', isPaid: false },
  { month: 'January 2027', year: 2027, dueDate: '15 Feb 2027', isPaid: false },
  { month: 'February 2027', year: 2027, dueDate: '15 Mar 2027', isPaid: false },
  { month: 'March 2027', year: 2027, dueDate: '15 Apr 2027', isPaid: false }
];

let billIdCounter = 1;
for (let flatNum = 49; flatNum <= 72; flatNum++) {
  const flatStr = flatNum.toString().padStart(3, '0');
  billingCycles.forEach((cycle) => {
    INITIAL_BILLS.push({
      id: billIdCounter++,
      flatNumber: flatStr,
      month: cycle.month,
      year: cycle.year,
      societyMaintenance: 568.0,
      dgBackupPower: 0.0,
      liftMaintenance: 0.0,
      waterSupplyCharges: 0.0,
      sinkingFund: 0.0,
      festivalFund: 0.0,
      totalAmount: 568.0,
      dueDate: cycle.dueDate,
      isPaid: cycle.isPaid,
      paidDate: cycle.isPaid ? '15 Sep 2026, 11:30 AM' : null,
      paymentRef: cycle.isPaid ? `OIL-T3-${flatStr}-202609` : null,
      paymentMethod: cycle.isPaid ? 'OIL Company Salary Deduction' : null
    });
  });
}

export const INITIAL_NOTICES: Notice[] = [
  {
    id: 1,
    title: 'Water Tank Cleaning & Overhead Reservoir Disinfection',
    category: 'WATER',
    content: 'Routine bi-annual deep cleaning and chlorination of the rooftop overhead tanks and underground sump reservoir for Tower 3 will take place on Saturday from 9:00 AM to 3:00 PM. Water supply will be interrupted during this period. Residents are requested to store adequate water.',
    date: '14 Sep 2026',
    postedBy: 'Tower 3 Society Committee',
    isPinned: true,
    priority: 'HIGH'
  },
  {
    id: 2,
    title: 'Bi-Monthly Passenger Lift Safety & Gear Servicing',
    category: 'MAINTENANCE',
    content: 'Otis maintenance engineers will be on-site on Tuesday between 10:00 AM and 1:00 PM for preventative maintenance and governor inspection of Lift #1 and Lift #2. Only one lift will remain operational at a time.',
    date: '12 Sep 2026',
    postedBy: 'Estate Maintenance Section, OIL',
    isPinned: true,
    priority: 'MEDIUM'
  },
  {
    id: 3,
    title: 'Tower 3 General Body Meeting (GBM) for Q4 2026',
    category: 'MEETING',
    content: 'All Tower 3 residents and committee members are requested to attend the upcoming Quarterly General Body Meeting at the Tower 3 Ground Floor Community Area on Sunday at 6:30 PM. Agenda includes car shed maintenance and festival preparations.',
    date: '10 Sep 2026',
    postedBy: 'General Secretary (Flat 057)',
    isPinned: false,
    priority: 'HIGH'
  },
  {
    id: 4,
    title: 'Durga Puja & Autumn Festive Illumination Notice',
    category: 'FESTIVAL',
    content: 'Society contributions towards the campus lighting and festival decoration have been scheduled. Tower 3 premises will feature LED string lighting across balconies and main entrance.',
    date: '08 Sep 2026',
    postedBy: 'Welfare Sub-Committee',
    isPinned: false,
    priority: 'NORMAL'
  },
  {
    id: 5,
    title: 'Automatic DG Transfer Switch Maintenance',
    category: 'POWER',
    content: 'Testing of 125 KVA DG Backup Generator automatic transfer switch (ATS) will be conducted for 15 minutes on Thursday morning. No disruption to normal town power is anticipated.',
    date: '05 Sep 2026',
    postedBy: 'Electrical Maintenance Dept.',
    isPinned: false,
    priority: 'MEDIUM'
  }
];

export const INITIAL_TOPICS: DiscussionTopic[] = [
  {
    id: 1,
    title: 'Grass cutting that will work very soon',
    category: 'CLEANING',
    description: 'Grass cutting work in and around Tower 3 premises will start very soon. Residents are requested to keep walkways and corridor edges clear.',
    authorFlat: '049',
    authorName: 'Tower 3 Society',
    authorFloor: 1,
    createdAt: Date.now() - 7200000,
    status: 'OPEN',
    upvotes: 4,
    userUpvoted: false,
    commentsCount: 2
  },
  {
    id: 2,
    title: 'Car shed work that will start from this month',
    category: 'PARKING',
    description: 'Car shed construction and maintenance work will start from this month for Tower 3 residents.',
    authorFlat: '057',
    authorName: 'Tower 3 Society',
    authorFloor: 3,
    createdAt: Date.now() - 14400000,
    status: 'OPEN',
    upvotes: 7,
    userUpvoted: false,
    commentsCount: 1
  }
];

export const INITIAL_COMMENTS: DiscussionComment[] = [
  {
    id: 1,
    topicId: 1,
    authorFlat: '052',
    authorName: 'S. Barua',
    authorFloor: 1,
    comment: 'Much needed! The grass near the rear generator pathway has grown quite tall after the recent monsoon rains.',
    createdAt: Date.now() - 3600000
  },
  {
    id: 2,
    topicId: 1,
    authorFlat: '061',
    authorName: 'R. K. Saikia',
    authorFloor: 4,
    comment: 'Please also ask the gardener to trim the flowering bushes along the front entry ramp.',
    createdAt: Date.now() - 1800000
  },
  {
    id: 3,
    topicId: 2,
    authorFlat: '068',
    authorName: 'B. M. Kalita',
    authorFloor: 5,
    comment: 'Will this cover the repainting of parking slot markings from P-049 to P-072 as well?',
    createdAt: Date.now() - 7200000
  }
];
