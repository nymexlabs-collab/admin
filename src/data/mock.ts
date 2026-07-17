/* Deterministic mock data for the admin platform. Seeded so the UI is stable across renders. */

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = mulberry32(42);
const pick = <T,>(arr: T[]): T => arr[Math.floor(rand() * arr.length)];
const range = (min: number, max: number) => Math.floor(rand() * (max - min + 1)) + min;

/* ---------- People ---------- */
const firstNames = ['James', 'Maria', 'Wei', 'Priya', 'Carlos', 'Amara', 'Lars', 'Yuki', 'Sofia', 'Daniel', 'Fatima', 'Noah', 'Elena', 'Marcus', 'Aisha', 'Liam', 'Zara', 'Hiro', 'Chloe', 'Diego'];
const lastNames = ['Chen', 'Patel', 'Silva', 'Okafor', 'Andersen', 'Tanaka', 'Rossi', 'Kim', 'Mendoza', 'Schmidt', 'Khan', 'Lopez', 'Nguyen', 'Park', 'Ahmed', 'Walsh', 'Cohen', 'Yamada', 'Dubois', 'Reyes'];

export function makeName() {
  return `${pick(firstNames)} ${pick(lastNames)}`;
}

export type Agent = {
  id: string;
  name: string;
  email: string;
  team: string;
  status: 'online' | 'on-call' | 'break' | 'offline';
  callsToday: number;
  avgHandle: string;
  csat: number;
  languages: string[];
  skills: string[];
  avatar?: string;
  utilization: number;
};

const teams = ['Reservations A', 'Reservations B', 'Property Support', 'VIP Concierge', 'Escalations'];
const langs = ['English', 'Spanish', 'French', 'German', 'Mandarin', 'Portuguese', 'Japanese'];
const skills = ['Booking', 'Cancellation', 'Lockout', 'Maintenance', 'Billing', 'VIP', 'Refunds', 'Escalation'];

export const agents: Agent[] = Array.from({ length: 24 }, (_, i) => {
  const name = makeName();
  const status = i < 10 ? 'on-call' : i < 16 ? 'online' : i < 20 ? 'break' : 'offline';
  return {
    id: `AG-${String(i + 1).padStart(4, '0')}`,
    name,
    email: `${name.toLowerCase().replace(' ', '.')}@reservations.io`,
    team: pick(teams),
    status,
    callsToday: range(8, 52),
    avgHandle: `${range(2, 12)}m ${range(10, 59)}s`,
    csat: Number((range(78, 99) + rand()).toFixed(1)),
    languages: [pick(langs), pick(langs)].filter((v, i, a) => a.indexOf(v) === i),
    skills: [pick(skills), pick(skills), pick(skills)].filter((v, i, a) => a.indexOf(v) === i),
    utilization: range(45, 98),
  };
});

/* ---------- Live Calls ---------- */
export type LiveCall = {
  id: string;
  caller: string;
  phone: string;
  agent: string;
  team: string;
  duration: string;
  queue: string;
  reason: string;
  status: 'active' | 'hold' | 'waiting';
};

const callReasons = ['New booking', 'Modify reservation', 'Cancellation', 'Lockout', 'Maintenance', 'Payment issue', 'Refund request', 'Check-in help'];
const queues = ['Reservations', 'Property Support', 'VIP', 'Billing', 'Escalations'];

export const liveCalls: LiveCall[] = Array.from({ length: 7 }, (_, i) => ({
  id: `CL-${String(i + 1).padStart(5, '0')}`,
  caller: makeName(),
  phone: `+1 (${range(200, 989)}) ${range(200, 989)}-${String(range(0, 9999)).padStart(4, '0')}`,
  agent: agents[i].name,
  team: agents[i].team,
  duration: `${range(0, 8)}:${String(range(10, 59)).padStart(2, '0')}`,
  queue: pick(queues),
  reason: pick(callReasons),
  status: i === 0 ? 'waiting' : i === 1 ? 'hold' : 'active',
}));

/* ---------- Call queue ---------- */
export const callQueue = Array.from({ length: 5 }, (_, i) => ({
  position: i + 1,
  caller: makeName(),
  phone: `+1 (${range(200, 989)}) ${range(200, 989)}-${String(range(0, 9999)).padStart(4, '0')}`,
  waitTime: `${range(0, 4)}:${String(range(10, 59)).padStart(2, '0')}`,
  priority: i < 2 ? 'high' : 'normal',
  reason: pick(callReasons),
}));

/* ---------- Dashboard stats ---------- */
export const dashboardStats = [
  { label: 'GMV (Today)', value: '$284.5K', delta: '+12.4%', direction: 'up' as const, icon: 'dollar' },
  { label: 'Active Users', value: '18,429', delta: '+3.2%', direction: 'up' as const, icon: 'users' },
  { label: 'Reservations Today', value: '1,847', delta: '+8.1%', direction: 'up' as const, icon: 'calendar' },
  { label: 'Orders Today', value: '3,294', delta: '-1.4%', direction: 'down' as const, icon: 'shopping' },
];

export const revenueSnapshot = {
  today: 284500,
  mrr: 2.4e6,
  arr: 28.8e6,
  takeRate: 12.4,
  growth: [180, 195, 210, 224, 240, 258, 272, 284],
};

export const platformActivity = Array.from({ length: 8 }, () => ({
  time: `${range(0, 23)}:${String(range(0, 59)).padStart(2, '0')}`,
  event: pick(['New listing approved', 'Order completed', 'Reservation confirmed', 'User registered', 'Refund processed', 'Vendor verified', 'Listing flagged', 'Payment captured']),
  entity: `#${range(10000, 99999)}`,
  user: makeName(),
}));

/* ---------- API Usage ---------- */
export const apiEndpoints = [
  { path: '/v1/listings', method: 'GET', calls: 184293, errorRate: 0.2, avgLatency: 84 },
  { path: '/v1/bookings', method: 'POST', calls: 92847, errorRate: 0.8, avgLatency: 142 },
  { path: '/v1/users', method: 'GET', calls: 73829, errorRate: 0.1, avgLatency: 62 },
  { path: '/v1/payments', method: 'POST', calls: 42019, errorRate: 1.2, avgLatency: 218 },
  { path: '/v1/reservations', method: 'GET', calls: 38472, errorRate: 0.3, avgLatency: 95 },
  { path: '/v1/orders', method: 'GET', calls: 29384, errorRate: 0.4, avgLatency: 78 },
  { path: '/v1/search', method: 'GET', calls: 248392, errorRate: 0.6, avgLatency: 124 },
  { path: '/v1/webhooks/events', method: 'POST', calls: 18273, errorRate: 2.1, avgLatency: 312 },
];

export const apiLatencySeries = [120, 98, 142, 87, 105, 134, 92, 78, 110, 95, 88, 102, 84, 96, 72, 118, 91, 104, 82, 99];

export const apiConsumers = [
  { name: 'Web App', key: 'pk_live_web_••••3f2a', calls: 429384, status: 'active' },
  { name: 'Mobile iOS', key: 'pk_live_ios_••••8b1c', calls: 284729, status: 'active' },
  { name: 'Mobile Android', key: 'pk_live_and_••••4e9f', calls: 193847, status: 'active' },
  { name: 'Partner: Acme Travel', key: 'pk_live_prt_••••2a7b', calls: 8492, status: 'active' },
  { name: 'Legacy SOAP Gateway', key: 'pk_live_lgc_••••0c4d', calls: 291, status: 'deprecated' },
];

/* ---------- Listings ---------- */
const listingTitles = [
  'Beachfront Villa – Costa Verde', 'Mountain Cabin – Aspen Ridge', 'Urban Loft – Downtown LA',
  'Safari Tent – Serengeti', 'Historic Townhouse – Boston', 'Treehouse – Olympic Peninsula',
  'Houseboat – Amsterdam Canal', 'Glass Igloo – Lapland', 'Ryokan – Kyoto Old Town',
  'Castle Suite – Edinburgh', 'Desert Dome – Joshua Tree', 'Floating Cabin – Puget Sound',
];
const listingStatuses = ['active', 'pending', 'suspended', 'draft'] as const;
const cities = ['Lisbon', 'Aspen', 'Los Angeles', 'Arusha', 'Boston', 'Seattle', 'Amsterdam', 'Rovaniemi', 'Kyoto', 'Edinburgh', 'Joshua Tree', 'Tacoma'];

export const listings = listingTitles.map((title, i) => ({
  id: `LST-${String(i + 1).padStart(5, '0')}`,
  title,
  vendor: makeName(),
  city: cities[i],
  price: range(85, 850),
  status: pick([...listingStatuses]),
  rating: Number((range(35, 50) / 10).toFixed(1)),
  bookings: range(3, 248),
  category: pick(['Vacation Rental', 'Event Space', 'Experience', 'Service', 'Ticket']),
}));

/* ---------- Orders ---------- */
const orderStatuses = ['completed', 'processing', 'pending', 'refunded', 'cancelled'] as const;
export const orders = Array.from({ length: 20 }, () => ({
  id: `ORD-${String(range(10000, 99999))}`,
  customer: makeName(),
  vendor: makeName(),
  date: `2026-07-${String(range(1, 16)).padStart(2, '0')}`,
  total: range(45, 2400),
  status: pick([...orderStatuses]),
  items: range(1, 5),
}));

/* ---------- Users ---------- */
const userRoles = ['admin', 'vendor', 'customer', 'support'] as const;
const userStatuses = ['active', 'suspended', 'pending'] as const;
export const users = Array.from({ length: 20 }, () => ({
  id: `USR-${String(range(10000, 99999))}`,
  name: makeName(),
  email: `${makeName().toLowerCase().replace(' ', '.')}@example.com`,
  role: pick([...userRoles]),
  status: pick([...userStatuses]),
  joined: `2026-${String(range(1, 7)).padStart(2, '0')}-${String(range(1, 28)).padStart(2, '0')}`,
  orders: range(0, 84),
  verified: rand() > 0.3,
}));

/* ---------- Recent activity ---------- */
export const recentActivity = Array.from({ length: 12 }, () => ({
  id: `EVT-${range(10000, 99999)}`,
  time: `${range(0, 23)}:${String(range(0, 59)).padStart(2, '0')}`,
  actor: makeName(),
  action: pick(['approved listing', 'suspended user', 'processed refund', 'updated policy', 'resolved ticket', 'assigned agent', 'updated pricing', 'merged vendor']),
  target: `#${range(10000, 99999)}`,
  type: pick(['marketplace', 'trust', 'commerce', 'users', 'system'] as const),
}));

/* ---------- Support tickets ---------- */
export const supportTickets = Array.from({ length: 15 }, () => ({
  id: `TKT-${String(range(10000, 99999))}`,
  subject: pick(['Double charge on booking #48291', 'Cannot access vendor dashboard', 'Listing photos not loading', 'Refund not received after 5 days', 'Calendar sync failing with Google', 'Guest complaint – property uninhabitable', 'Payout delayed', 'Identity verification stuck']),
  requester: makeName(),
  priority: pick(['low', 'medium', 'high', 'urgent'] as const),
  status: pick(['open', 'pending', 'resolved', 'escalated'] as const),
  assignee: makeName(),
  updated: `${range(1, 48)}h ago`,
  channel: pick(['email', 'chat', 'phone', 'web'] as const),
}));

/* ---------- IVR nodes ---------- */
export type IVRNode = {
  id: string;
  type: 'greeting' | 'menu' | 'route' | 'lookup' | 'voicemail' | 'hangup';
  label: string;
  prompt: string;
  options?: { key: string; target: string }[];
  position: { x: number; y: number };
};

export const ivrNodes: IVRNode[] = [
  { id: 'n1', type: 'greeting', label: 'Welcome', prompt: 'Thank you for calling. Press 1 for reservations, 2 for support.', position: { x: 0, y: 0 } },
  { id: 'n2', type: 'menu', label: 'Main Menu', prompt: 'For new reservations press 1. For existing bookings press 2. For support press 3.', options: [
    { key: '1', target: 'n3' }, { key: '2', target: 'n4' }, { key: '3', target: 'n5' },
  ], position: { x: 0, y: 120 } },
  { id: 'n3', type: 'route', label: 'New Reservation', prompt: 'Routing to Reservations A team.', position: { x: -180, y: 260 } },
  { id: 'n4', type: 'lookup', label: 'Booking Lookup', prompt: 'Please enter your 6-digit reservation number.', position: { x: 0, y: 260 } },
  { id: 'n5', type: 'menu', label: 'Support Menu', prompt: 'For lockout press 1. For maintenance press 2. For all other issues press 3.', options: [
    { key: '1', target: 'n6' }, { key: '2', target: 'n6' }, { key: '3', target: 'n7' },
  ], position: { x: 180, y: 260 } },
  { id: 'n6', type: 'route', label: 'Property Support', prompt: 'Routing to Property Support team.', position: { x: 90, y: 400 } },
  { id: 'n7', type: 'voicemail', label: 'Voicemail', prompt: 'Please leave a message after the tone.', position: { x: 280, y: 400 } },
];
