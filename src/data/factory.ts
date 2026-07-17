/* Domain-aware mock data factory. Generates realistic data for every entity type in the platform. */

export function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

let seed = 42;
const rand = () => mulberry32(seed++)();
const pick = <T,>(arr: T[]): T => arr[Math.floor(rand() * arr.length)];
const range = (min: number, max: number) => Math.floor(rand() * (max - min + 1)) + min;
const id = (prefix: string, n: number) => `${prefix}-${String(n).padStart(5, '0')}`;
const money = (min: number, max: number) => range(min, max);
const dateStr = (daysAgo: number) => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split('T')[0];
};

const firstNames = ['James', 'Maria', 'Wei', 'Priya', 'Carlos', 'Amara', 'Lars', 'Yuki', 'Sofia', 'Daniel', 'Fatima', 'Noah', 'Elena', 'Marcus', 'Aisha', 'Liam', 'Zara', 'Hiro', 'Chloe', 'Diego', 'Olivia', 'Ethan', 'Maya', 'Kai', 'Nora', 'Leo', 'Iris', 'Sam', 'Ada', 'Ravi'];
const lastNames = ['Chen', 'Patel', 'Silva', 'Okafor', 'Andersen', 'Tanaka', 'Rossi', 'Kim', 'Mendoza', 'Schmidt', 'Khan', 'Lopez', 'Nguyen', 'Park', 'Ahmed', 'Walsh', 'Cohen', 'Yamada', 'Dubois', 'Reyes', 'Brown', 'Müller', 'Silva', 'Costa', 'Petrov', 'Nakamura', 'Oduya', 'Ferrari', 'Lindgren', 'Bauer'];
const companies = ['Costa Verde Rentals', 'Aspen Ridge Resorts', 'Downtown Stays Co', 'Serengeti Safari Ltd', 'Boston Heritage Group', 'Olympic Escapes', 'Amsterdam Canal Suites', 'Lapland Glass Cabins', 'Kyoto Traditional Stays', 'Edinburgh Castle Hotels', 'Joshua Tree Domes', 'Puget Sound Floatels', 'Summit Hospitality', 'BlueWave Vacations', 'Nordic Nights', 'Terra Vista Properties', 'Urban Loft Group', 'Sahara Expeditions', 'Maple Leaf Stays', 'Aegean Blue Rentals'];
const cities = ['Lisbon', 'Aspen', 'Los Angeles', 'Arusha', 'Boston', 'Seattle', 'Amsterdam', 'Rovaniemi', 'Kyoto', 'Edinburgh', 'Joshua Tree', 'Tacoma', 'Miami', 'Barcelona', 'Reykjavik', 'Cape Town', 'Dubai', 'Singapore', 'Prague', 'Mexico City'];
const statuses = ['active', 'pending', 'suspended', 'draft', 'completed', 'processing', 'refunded', 'cancelled', 'open', 'resolved', 'escalated', 'approved', 'rejected', 'under_review'];
const priorities = ['low', 'medium', 'high', 'urgent'];

export function makeName() { return `${pick(firstNames)} ${pick(lastNames)}`; }
export function makeEmail(name: string) { return `${name.toLowerCase().replace(' ', '.')}@${pick(['example.com', 'reservations.io', 'vendor.co', 'stays.net', 'bookings.com'])}`; }
export function makePhone() { return `+1 (${range(200, 989)}) ${range(200, 989)}-${String(range(0, 9999)).padStart(4, '0')}`; }

type Column = { key: string; label: string; type: 'text' | 'badge' | 'money' | 'date' | 'avatar' | 'id' | 'number' | 'progress' };

const domainColumns: Record<string, Column[]> = {
  org: [
    { key: 'name', label: 'Organization', type: 'text' },
    { key: 'type', label: 'Type', type: 'badge' },
    { key: 'listings', label: 'Listings', type: 'number' },
    { key: 'revenue', label: 'Revenue (30d)', type: 'money' },
    { key: 'status', label: 'Status', type: 'badge' },
    { key: 'city', label: 'Location', type: 'text' },
    { key: 'joined', label: 'Joined', type: 'date' },
  ],
  listing: [
    { key: 'title', label: 'Listing', type: 'text' },
    { key: 'vendor', label: 'Vendor', type: 'text' },
    { key: 'city', label: 'Location', type: 'text' },
    { key: 'price', label: 'Price', type: 'money' },
    { key: 'status', label: 'Status', type: 'badge' },
    { key: 'rating', label: 'Rating', type: 'number' },
    { key: 'bookings', label: 'Bookings', type: 'number' },
    { key: 'category', label: 'Category', type: 'badge' },
  ],
  inventory: [
    { key: 'name', label: 'Item', type: 'text' },
    { key: 'listing', label: 'Listing', type: 'text' },
    { key: 'sku', label: 'SKU', type: 'id' },
    { key: 'quantity', label: 'Qty', type: 'number' },
    { key: 'reserved', label: 'Reserved', type: 'number' },
    { key: 'status', label: 'Status', type: 'badge' },
  ],
  reservation: [
    { key: 'id', label: 'Reservation ID', type: 'id' },
    { key: 'guest', label: 'Guest', type: 'avatar' },
    { key: 'listing', label: 'Listing', type: 'text' },
    { key: 'checkIn', label: 'Check-in', type: 'date' },
    { key: 'checkOut', label: 'Check-out', type: 'date' },
    { key: 'total', label: 'Total', type: 'money' },
    { key: 'status', label: 'Status', type: 'badge' },
  ],
  order: [
    { key: 'id', label: 'Order ID', type: 'id' },
    { key: 'customer', label: 'Customer', type: 'avatar' },
    { key: 'vendor', label: 'Vendor', type: 'text' },
    { key: 'date', label: 'Date', type: 'date' },
    { key: 'items', label: 'Items', type: 'number' },
    { key: 'total', label: 'Total', type: 'money' },
    { key: 'status', label: 'Status', type: 'badge' },
  ],
  review: [
    { key: 'id', label: 'Review ID', type: 'id' },
    { key: 'author', label: 'Author', type: 'avatar' },
    { key: 'listing', label: 'Listing', type: 'text' },
    { key: 'rating', label: 'Rating', type: 'number' },
    { key: 'comment', label: 'Comment', type: 'text' },
    { key: 'date', label: 'Date', type: 'date' },
    { key: 'status', label: 'Status', type: 'badge' },
  ],
  user: [
    { key: 'name', label: 'User', type: 'avatar' },
    { key: 'email', label: 'Email', type: 'text' },
    { key: 'role', label: 'Role', type: 'badge' },
    { key: 'status', label: 'Status', type: 'badge' },
    { key: 'joined', label: 'Joined', type: 'date' },
    { key: 'orders', label: 'Orders', type: 'number' },
    { key: 'verified', label: 'Verified', type: 'badge' },
  ],
  user_team: [
    { key: 'name', label: 'Team', type: 'text' },
    { key: 'members', label: 'Members', type: 'number' },
    { key: 'lead', label: 'Team Lead', type: 'avatar' },
    { key: 'status', label: 'Status', type: 'badge' },
  ],
  user_role: [
    { key: 'name', label: 'Role', type: 'text' },
    { key: 'users', label: 'Users', type: 'number' },
    { key: 'permissions', label: 'Permissions', type: 'number' },
    { key: 'status', label: 'Status', type: 'badge' },
  ],
  tenant: [
    { key: 'name', label: 'Tenant', type: 'text' },
    { key: 'plan', label: 'Plan', type: 'badge' },
    { key: 'users', label: 'Users', type: 'number' },
    { key: 'revenue', label: 'MRR', type: 'money' },
    { key: 'status', label: 'Status', type: 'badge' },
    { key: 'created', label: 'Created', type: 'date' },
  ],
  trust: [
    { key: 'id', label: 'Case ID', type: 'id' },
    { key: 'entity', label: 'Entity', type: 'text' },
    { key: 'reason', label: 'Reason', type: 'text' },
    { key: 'reportedBy', label: 'Reported By', type: 'avatar' },
    { key: 'severity', label: 'Severity', type: 'badge' },
    { key: 'status', label: 'Status', type: 'badge' },
    { key: 'date', label: 'Date', type: 'date' },
  ],
  trust_media: [
    { key: 'id', label: 'Media ID', type: 'id' },
    { key: 'listing', label: 'Listing', type: 'text' },
    { key: 'type', label: 'Type', type: 'badge' },
    { key: 'flaggedBy', label: 'Flagged By', type: 'text' },
    { key: 'reason', label: 'Reason', type: 'text' },
    { key: 'status', label: 'Status', type: 'badge' },
  ],
  trust_review: [
    { key: 'id', label: 'Review ID', type: 'id' },
    { key: 'author', label: 'Author', type: 'avatar' },
    { key: 'listing', label: 'Listing', type: 'text' },
    { key: 'rating', label: 'Rating', type: 'number' },
    { key: 'flagged', label: 'Flagged For', type: 'text' },
    { key: 'status', label: 'Status', type: 'badge' },
  ],
  client: [
    { key: 'name', label: 'Client', type: 'text' },
    { key: 'type', label: 'Type', type: 'badge' },
    { key: 'properties', label: 'Properties', type: 'number' },
    { key: 'contract', label: 'Contract', type: 'badge' },
    { key: 'manager', label: 'Account Mgr', type: 'avatar' },
    { key: 'revenue', label: 'Revenue (30d)', type: 'money' },
    { key: 'status', label: 'Status', type: 'badge' },
  ],
  agent: [
    { key: 'name', label: 'Agent', type: 'avatar' },
    { key: 'team', label: 'Team', type: 'text' },
    { key: 'status', label: 'Status', type: 'badge' },
    { key: 'callsToday', label: 'Calls', type: 'number' },
    { key: 'avgHandle', label: 'Avg Handle', type: 'text' },
    { key: 'csat', label: 'CSAT', type: 'progress' },
    { key: 'utilization', label: 'Utilization', type: 'progress' },
  ],
  ticket: [
    { key: 'id', label: 'Ticket ID', type: 'id' },
    { key: 'subject', label: 'Subject', type: 'text' },
    { key: 'requester', label: 'Requester', type: 'avatar' },
    { key: 'priority', label: 'Priority', type: 'badge' },
    { key: 'status', label: 'Status', type: 'badge' },
    { key: 'assignee', label: 'Assignee', type: 'avatar' },
    { key: 'updated', label: 'Updated', type: 'text' },
  ],
  property: [
    { key: 'id', label: 'Ticket ID', type: 'id' },
    { key: 'property', label: 'Property', type: 'text' },
    { key: 'issue', label: 'Issue', type: 'text' },
    { key: 'guest', label: 'Guest', type: 'avatar' },
    { key: 'priority', label: 'Priority', type: 'badge' },
    { key: 'assignee', label: 'Assigned To', type: 'avatar' },
    { key: 'status', label: 'Status', type: 'badge' },
  ],
  marketing: [
    { key: 'name', label: 'Campaign', type: 'text' },
    { key: 'type', label: 'Type', type: 'badge' },
    { key: 'impressions', label: 'Impressions', type: 'number' },
    { key: 'clicks', label: 'Clicks', type: 'number' },
    { key: 'ctr', label: 'CTR', type: 'text' },
    { key: 'budget', label: 'Budget', type: 'money' },
    { key: 'status', label: 'Status', type: 'badge' },
  ],
  commerce: [
    { key: 'id', label: 'Transaction ID', type: 'id' },
    { key: 'customer', label: 'Customer', type: 'avatar' },
    { key: 'vendor', label: 'Vendor', type: 'text' },
    { key: 'amount', label: 'Amount', type: 'money' },
    { key: 'fee', label: 'Platform Fee', type: 'money' },
    { key: 'method', label: 'Method', type: 'badge' },
    { key: 'status', label: 'Status', type: 'badge' },
    { key: 'date', label: 'Date', type: 'date' },
  ],
  qa: [
    { key: 'id', label: 'Review ID', type: 'id' },
    { key: 'agent', label: 'Agent', type: 'avatar' },
    { key: 'reviewer', label: 'Reviewer', type: 'avatar' },
    { key: 'score', label: 'Score', type: 'progress' },
    { key: 'criteria', label: 'Criteria', type: 'text' },
    { key: 'date', label: 'Date', type: 'date' },
    { key: 'status', label: 'Status', type: 'badge' },
  ],
  automation: [
    { key: 'name', label: 'Rule Name', type: 'text' },
    { key: 'trigger', label: 'Trigger', type: 'text' },
    { key: 'action', label: 'Action', type: 'text' },
    { key: 'priority', label: 'Priority', type: 'badge' },
    { key: 'executions', label: 'Executions (7d)', type: 'number' },
    { key: 'status', label: 'Status', type: 'badge' },
  ],
  api: [
    { key: 'name', label: 'Consumer/App', type: 'text' },
    { key: 'key', label: 'API Key', type: 'id' },
    { key: 'requests', label: 'Requests (24h)', type: 'number' },
    { key: 'rateLimit', label: 'Rate Limit', type: 'text' },
    { key: 'lastUsed', label: 'Last Used', type: 'text' },
    { key: 'status', label: 'Status', type: 'badge' },
  ],
  webhook: [
    { key: 'url', label: 'Endpoint URL', type: 'text' },
    { key: 'events', label: 'Events', type: 'text' },
    { key: 'delivery', label: 'Delivery Rate', type: 'progress' },
    { key: 'lastFired', label: 'Last Fired', type: 'text' },
    { key: 'status', label: 'Status', type: 'badge' },
  ],
  system_log: [
    { key: 'timestamp', label: 'Timestamp', type: 'text' },
    { key: 'level', label: 'Level', type: 'badge' },
    { key: 'service', label: 'Service', type: 'text' },
    { key: 'message', label: 'Message', type: 'text' },
    { key: 'host', label: 'Host', type: 'text' },
  ],
  backup: [
    { key: 'id', label: 'Backup ID', type: 'id' },
    { key: 'type', label: 'Type', type: 'badge' },
    { key: 'size', label: 'Size', type: 'text' },
    { key: 'duration', label: 'Duration', type: 'text' },
    { key: 'date', label: 'Date', type: 'date' },
    { key: 'status', label: 'Status', type: 'badge' },
  ],
  scheduler: [
    { key: 'name', label: 'Job Name', type: 'text' },
    { key: 'schedule', label: 'Schedule', type: 'text' },
    { key: 'lastRun', label: 'Last Run', type: 'text' },
    { key: 'nextRun', label: 'Next Run', type: 'text' },
    { key: 'duration', label: 'Avg Duration', type: 'text' },
    { key: 'status', label: 'Status', type: 'badge' },
  ],
  governance: [
    { key: 'name', label: 'Workflow', type: 'text' },
    { key: 'trigger', label: 'Trigger', type: 'text' },
    { key: 'approvers', label: 'Approvers', type: 'number' },
    { key: 'pending', label: 'Pending', type: 'number' },
    { key: 'status', label: 'Status', type: 'badge' },
  ],
  geo: [
    { key: 'name', label: 'Name', type: 'text' },
    { key: 'code', label: 'Code', type: 'id' },
    { key: 'parent', label: 'Parent', type: 'text' },
    { key: 'listings', label: 'Listings', type: 'number' },
    { key: 'status', label: 'Status', type: 'badge' },
  ],
  content: [
    { key: 'title', label: 'Title', type: 'text' },
    { key: 'type', label: 'Type', type: 'badge' },
    { key: 'author', label: 'Author', type: 'avatar' },
    { key: 'status', label: 'Status', type: 'badge' },
    { key: 'updated', label: 'Updated', type: 'date' },
  ],
  search: [
    { key: 'query', label: 'Search Query', type: 'text' },
    { key: 'count', label: 'Searches', type: 'number' },
    { key: 'results', label: 'Avg Results', type: 'number' },
    { key: 'ctr', label: 'CTR', type: 'text' },
    { key: 'revenue', label: 'Revenue', type: 'money' },
  ],
  audit: [
    { key: 'timestamp', label: 'Timestamp', type: 'text' },
    { key: 'actor', label: 'Actor', type: 'avatar' },
    { key: 'action', label: 'Action', type: 'text' },
    { key: 'resource', label: 'Resource', type: 'text' },
    { key: 'ip', label: 'IP Address', type: 'text' },
  ],
  sdk: [
    { key: 'name', label: 'SDK', type: 'text' },
    { key: 'language', label: 'Language', type: 'badge' },
    { key: 'version', label: 'Version', type: 'text' },
    { key: 'downloads', label: 'Downloads', type: 'number' },
    { key: 'updated', label: 'Updated', type: 'date' },
  ],
};

const domainReasons: Record<string, string[]> = {
  trust: ['Prohibited content', 'Fake listing', 'Duplicate content', 'Pricing manipulation', 'Spam', 'Policy violation', 'Copyright infringement'],
  trust_media: ['Nudity', 'Violence', 'Copyright', 'Irrelevant', 'Poor quality', 'Prohibited item'],
  trust_review: ['Suspicious pattern', 'Fake review', 'Offensive language', 'Irrelevant', 'Incentivized'],
  property: ['Lockout', 'No hot water', 'AC failure', 'Cleaning needed', 'Damage found', 'Noise disturbance', 'Power outage', 'WiFi not working'],
  ticket: ['Double charge', 'Cannot access dashboard', 'Photos not loading', 'Refund not received', 'Calendar sync failing', 'Payout delayed', 'Verification stuck'],
};

const domainStatusOptions: Record<string, string[]> = {
  listing: ['active', 'pending', 'suspended', 'draft'],
  order: ['completed', 'processing', 'pending', 'refunded', 'cancelled'],
  reservation: ['confirmed', 'pending', 'checked_in', 'checked_out', 'cancelled'],
  review: ['published', 'pending', 'flagged', 'removed'],
  user: ['active', 'suspended', 'pending'],
  tenant: ['active', 'trial', 'suspended', 'cancelled'],
  trust: ['open', 'under_review', 'actioned', 'dismissed', 'escalated'],
  ticket: ['open', 'pending', 'resolved', 'escalated'],
  property: ['open', 'dispatched', 'in_progress', 'resolved', 'escalated'],
  marketing: ['active', 'paused', 'draft', 'completed', 'scheduled'],
  commerce: ['completed', 'pending', 'failed', 'refunded', 'disputed'],
  qa: ['completed', 'pending', 'flagged'],
  automation: ['active', 'paused', 'draft'],
  api: ['active', 'deprecated', 'revoked'],
  webhook: ['active', 'disabled', 'failing'],
  backup: ['completed', 'in_progress', 'failed'],
  scheduler: ['running', 'idle', 'failed', 'paused'],
  governance: ['active', 'draft', 'archived'],
  geo: ['active', 'inactive'],
  content: ['published', 'draft', 'archived', 'scheduled'],
  audit: ['success', 'warning', 'error'],
  system_log: ['info', 'warning', 'error', 'debug'],
  sdk: ['stable', 'beta', 'deprecated'],
  user_team: ['active', 'inactive'],
  user_role: ['active', 'inactive'],
  inventory: ['in_stock', 'low_stock', 'out_of_stock', 'reserved'],
  search: ['normal', 'trending', 'declining'],
  trust_media: ['pending', 'approved', 'rejected'],
  trust_review: ['pending', 'approved', 'rejected'],
};

const listingTitles = [
  'Beachfront Villa – Costa Verde', 'Mountain Cabin – Aspen Ridge', 'Urban Loft – Downtown LA',
  'Safari Tent – Serengeti', 'Historic Townhouse – Boston', 'Treehouse – Olympic Peninsula',
  'Houseboat – Amsterdam Canal', 'Glass Igloo – Lapland', 'Ryokan – Kyoto Old Town',
  'Castle Suite – Edinburgh', 'Desert Dome – Joshua Tree', 'Floating Cabin – Puget Sound',
  'Cliffside Studio – Santorini', 'Rainforest Lodge – Costa Rica', 'Ice Hotel – Quebec',
  'Overwater Bungalow – Maldives', 'Windmill Cottage – Netherlands', 'Lighthouse Stay – Maine',
  'Cave House – Cappadocia', 'Eco Pod – Patagonia',
];
const listingCategories = ['Vacation Rental', 'Event Space', 'Experience', 'Service', 'Ticket', 'Hotel Room'];
const reviewComments = [
  'Amazing stay, host was incredibly welcoming!', 'Property was exactly as described. Would book again.',
  'Great location but the WiFi was spotty.', 'Exceeded our expectations in every way.',
  'Clean, comfortable, and well-located.', 'Some maintenance issues but host resolved quickly.',
  'Perfect for our family vacation.', 'Stunning views, highly recommend.',
  'Not what we expected based on photos.', 'Five stars, would definitely return.',
];
const campaignTypes = ['Sponsored', 'Featured', 'Display', 'Social', 'Email', 'Search'];

/* Generate rows for a domain */
export function generateRows(domain: string, count = 15): Record<string, any>[] {
  const cols = domainColumns[domain] ?? domainColumns.org;
  const statusOptions = domainStatusOptions[domain] ?? statuses;
  const rows: Record<string, any>[] = [];

  for (let i = 0; i < count; i++) {
    const row: Record<string, any> = {};
    const name = makeName();
    const company = pick(companies);
    const city = pick(cities);
    const daysAgo = range(0, 365);

    for (const col of cols) {
      switch (col.type) {
        case 'id':
          row[col.key] = id(col.key.slice(0, 3).toUpperCase(), range(10000, 99999));
          break;
        case 'avatar':
          row[col.key] = makeName();
          break;
        case 'text':
          if (col.key === 'name' || col.key === 'title') {
            row[col.key] = domain === 'org' || domain === 'tenant' || domain === 'client' || domain === 'marketing'
              ? company : domain === 'listing' ? pick(listingTitles) : name;
          } else if (col.key === 'vendor' || col.key === 'listing' || col.key === 'property') {
            row[col.key] = rand() > 0.5 ? pick(listingTitles) : company;
          } else if (col.key === 'email') {
            row[col.key] = makeEmail(name);
          } else if (col.key === 'city' || col.key === 'location') {
            row[col.key] = city;
          } else if (col.key === 'issue') {
            row[col.key] = pick(domainReasons.property ?? domainReasons.ticket ?? ['General inquiry']);
          } else if (col.key === 'reason') {
            row[col.key] = pick(domainReasons[domain] ?? ['General']);
          } else if (col.key === 'comment') {
            row[col.key] = pick(reviewComments);
          } else if (col.key === 'message') {
            row[col.key] = pick(['Requesting refund for booking', 'Cannot modify reservation dates', 'Property access issue', 'Billing discrepancy on invoice', 'Feature request: bulk export']);
          } else if (col.key === 'subject') {
            row[col.key] = pick(domainReasons.ticket ?? ['General inquiry']);
          } else if (col.key === 'flagged') {
            row[col.key] = pick(domainReasons.trust_review ?? ['Suspicious pattern']);
          } else if (col.key === 'trigger') {
            row[col.key] = pick(['On new booking', 'On cancellation', 'On refund request', 'On listing approval', 'On agent login', 'On queue overflow', 'On SLA breach']);
          } else if (col.key === 'action') {
            row[col.key] = pick(['Assign to team', 'Send notification', 'Escalate to manager', 'Auto-approve', 'Create ticket', 'Schedule callback']);
          } else if (col.key === 'url') {
            row[col.key] = `https://hooks.${pick(['app', 'partner', 'integration'])}.com/webhooks/${id('evt', range(1000, 9999))}`;
          } else if (col.key === 'events') {
            row[col.key] = pick(['booking.created, booking.cancelled', 'payment.completed, payment.failed', 'listing.approved, listing.rejected', 'user.registered, user.suspended', 'reservation.confirmed']);
          } else if (col.key === 'query') {
            row[col.key] = pick(['beachfront villa', 'aspen cabin', 'tokyo hotel', 'safari tent', 'amsterdam houseboat', 'mountain retreat', 'downtown loft', 'treehouse stay']);
          } else if (col.key === 'schedule') {
            row[col.key] = pick(['*/5 * * * *', '0 * * * *', '0 2 * * *', '0 0 * * 0', '0 0 1 * *', '*/15 * * * *']);
          } else if (col.key === 'service' || col.key === 'host') {
            row[col.key] = pick(['api-gateway', 'auth-service', 'search-index', 'payment-api', 'webhook-delivery', 'notification-service', 'media-cdn', 'scheduler']);
          } else if (col.key === 'level') {
            row[col.key] = pick(['info', 'warning', 'error', 'debug']);
          } else if (col.key === 'message') {
            row[col.key] = pick(['Request processed successfully', 'Rate limit threshold approaching', 'Connection timeout to database', 'Failed to deliver webhook after 3 retries', 'Cache invalidated for listing index', 'Scheduled job completed']);
          } else if (col.key === 'timestamp' || col.key === 'lastRun' || col.key === 'nextRun' || col.key === 'lastUsed' || col.key === 'lastFired' || col.key === 'updated') {
            row[col.key] = `${range(1, 48)}${pick(['m ago', 'h ago'])}`;
          } else {
            row[col.key] = pick(['Standard configuration', 'Active', 'N/A', '—']);
          }
          break;
        case 'badge':
          if (col.key === 'status') {
            row[col.key] = pick(statusOptions);
          } else if (col.key === 'role') {
            row[col.key] = pick(['admin', 'vendor', 'customer', 'support']);
          } else if (col.key === 'type') {
            row[col.key] = domain === 'org' ? pick(['Vendor', 'Partner', 'Agency', 'Enterprise']) : domain === 'client' ? pick(['Vacation Rental Co', 'Property Manager', 'Individual Owner']) : domain === 'marketing' ? pick(campaignTypes) : pick(['Standard', 'Premium', 'Enterprise']);
          } else if (col.key === 'plan') {
            row[col.key] = pick(['Starter', 'Growth', 'Scale', 'Enterprise']);
          } else if (col.key === 'priority' || col.key === 'severity') {
            row[col.key] = pick(priorities);
          } else if (col.key === 'contract') {
            row[col.key] = pick(['Active', 'Pending renewal', 'Expired']);
          } else if (col.key === 'verified') {
            row[col.key] = rand() > 0.3 ? 'verified' : 'unverified';
          } else if (col.key === 'category') {
            row[col.key] = pick(listingCategories);
          } else if (col.key === 'method') {
            row[col.key] = pick(['Stripe', 'PayPal', 'Bank Transfer', 'Wallet']);
          } else if (col.key === 'level') {
            row[col.key] = pick(['info', 'warning', 'error']);
          } else {
            row[col.key] = pick(statusOptions);
          }
          break;
        case 'money':
          row[col.key] = money(50, 5000);
          break;
        case 'date':
          row[col.key] = dateStr(daysAgo);
          break;
        case 'number':
          if (col.key === 'rating') row[col.key] = Number((range(30, 50) / 10).toFixed(1));
          else if (col.key === 'ctr') row[col.key] = `${(rand() * 5 + 0.5).toFixed(1)}%`;
          else row[col.key] = range(1, 500);
          break;
        case 'progress':
          if (col.key === 'csat' || col.key === 'score' || col.key === 'delivery') row[col.key] = range(65, 99);
          else if (col.key === 'utilization') row[col.key] = range(35, 95);
          else row[col.key] = range(50, 100);
          break;
      }
    }
    rows.push(row);
  }
  return rows;
}

export function getColumns(domain: string): Column[] {
  return domainColumns[domain] ?? domainColumns.org;
}

/* Report chart data generator */
export function generateChartData(domain: string, points = 12) {
  const seedMap: Record<string, { label: string; base: number; variance: number; unit?: string }> = {
    revenue: { label: 'Revenue', base: 28000, variance: 8000, unit: '$' },
    gmv: { label: 'GMV', base: 240000, variance: 60000, unit: '$' },
    bookings: { label: 'Bookings', base: 1500, variance: 400 },
    occupancy: { label: 'Occupancy', base: 68, variance: 15, unit: '%' },
    users: { label: 'Users', base: 18000, variance: 3000 },
    growth: { label: 'Growth', base: 12, variance: 6, unit: '%' },
    analytics: { label: 'Events', base: 45000, variance: 12000 },
    calls: { label: 'Calls', base: 420, variance: 80 },
    csat: { label: 'CSAT', base: 91, variance: 4, unit: '%' },
    search: { label: 'Searches', base: 38000, variance: 10000 },
    system: { label: 'Requests', base: 890000, variance: 200000 },
    api: { label: 'API Calls', base: 520000, variance: 150000 },
  };
  const cfg = seedMap[domain] ?? seedMap.analytics;
  const data = Array.from({ length: points }, (_, i) => ({
    label: i < 7 ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i] : `W${i - 6}`,
    value: Math.round(cfg.base + (rand() - 0.3) * cfg.variance),
  }));
  return { data, label: cfg.label, unit: cfg.unit };
}

/* Stats cards for table pages */
export function generateStats(domain: string) {
  const statsMap: Record<string, { label: string; value: string; delta?: string; deltaDir?: 'up' | 'down' }[]> = {
    org: [
      { label: 'Total Organizations', value: '1,247', delta: '+24', deltaDir: 'up' },
      { label: 'Active Vendors', value: '892', delta: '+12', deltaDir: 'up' },
      { label: 'Pending Approval', value: '18', delta: '-3', deltaDir: 'up' },
      { label: 'Avg Revenue / Org', value: '$24.5K', delta: '+5.2%', deltaDir: 'up' },
    ],
    listing: [
      { label: 'Total Listings', value: '8,429', delta: '+142', deltaDir: 'up' },
      { label: 'Active', value: '5,872', delta: '70%', deltaDir: 'up' },
      { label: 'Pending Review', value: '47', delta: 'Action needed', deltaDir: 'down' },
      { label: 'Avg Rating', value: '4.6', delta: '+0.2', deltaDir: 'up' },
    ],
    order: [
      { label: 'Orders Today', value: '3,294', delta: '+8.1%', deltaDir: 'up' },
      { label: 'Completed', value: '2,371', delta: '72%', deltaDir: 'up' },
      { label: 'Pending', value: '412', delta: 'Processing', deltaDir: 'up' },
      { label: 'Refunded', value: '89', delta: '-$2.4K', deltaDir: 'down' },
    ],
    user: [
      { label: 'Total Users', value: '48,291', delta: '+1,240', deltaDir: 'up' },
      { label: 'Vendors', value: '1,892', delta: '+38', deltaDir: 'up' },
      { label: 'Verified', value: '33,804', delta: '70%', deltaDir: 'up' },
      { label: 'Suspended', value: '142', delta: '+12', deltaDir: 'down' },
    ],
    ticket: [
      { label: 'Open Tickets', value: '284', delta: '-18', deltaDir: 'up' },
      { label: 'Escalated', value: '23', delta: 'Needs attention', deltaDir: 'down' },
      { label: 'Avg Resolution', value: '4.2h', delta: '-18m', deltaDir: 'up' },
      { label: 'CSAT', value: '91%', delta: '+2.1%', deltaDir: 'up' },
    ],
    trust: [
      { label: 'Open Cases', value: '67', delta: '+8', deltaDir: 'down' },
      { label: 'Critical', value: '12', delta: 'Urgent', deltaDir: 'down' },
      { label: 'Resolved (7d)', value: '184', delta: '+24%', deltaDir: 'up' },
      { label: 'Avg Resolution', value: '6.2h', delta: '-1.1h', deltaDir: 'up' },
    ],
    client: [
      { label: 'Total Clients', value: '142', delta: '+8', deltaDir: 'up' },
      { label: 'Active Contracts', value: '128', delta: '90%', deltaDir: 'up' },
      { label: 'Properties Managed', value: '4,829', delta: '+240', deltaDir: 'up' },
      { label: 'Revenue (30d)', value: '$1.2M', delta: '+14%', deltaDir: 'up' },
    ],
    agent: [
      { label: 'Total Agents', value: '24', delta: '+2', deltaDir: 'up' },
      { label: 'On Shift', value: '16', delta: '67%', deltaDir: 'up' },
      { label: 'Avg CSAT', value: '91.8%', delta: '+2.3%', deltaDir: 'up' },
      { label: 'Teams', value: '7', delta: 'Active', deltaDir: 'up' },
    ],
    commerce: [
      { label: 'Transactions (24h)', value: '12,847', delta: '+15%', deltaDir: 'up' },
      { label: 'Volume', value: '$284.5K', delta: '+12%', deltaDir: 'up' },
      { label: 'Platform Fees', value: '$34.2K', delta: '+11%', deltaDir: 'up' },
      { label: 'Failed', value: '47', delta: '0.4%', deltaDir: 'up' },
    ],
    marketing: [
      { label: 'Active Campaigns', value: '24', delta: '+3', deltaDir: 'up' },
      { label: 'Total Impressions', value: '4.2M', delta: '+18%', deltaDir: 'up' },
      { label: 'Avg CTR', value: '3.2%', delta: '+0.4%', deltaDir: 'up' },
      { label: 'Spend (30d)', value: '$48.2K', delta: '+8%', deltaDir: 'down' },
    ],
    api: [
      { label: 'Total Requests (24h)', value: '890K', delta: '+18%', deltaDir: 'up' },
      { label: 'Avg Latency', value: '94ms', delta: '-8ms', deltaDir: 'up' },
      { label: 'Error Rate', value: '0.4%', delta: '-0.1%', deltaDir: 'up' },
      { label: 'Active Consumers', value: '5', delta: 'All healthy', deltaDir: 'up' },
    ],
    webhook: [
      { label: 'Total Webhooks', value: '48', delta: '+4', deltaDir: 'up' },
      { label: 'Delivery Rate', value: '98.2%', delta: '+0.3%', deltaDir: 'up' },
      { label: 'Failed (24h)', value: '127', delta: '-22%', deltaDir: 'up' },
      { label: 'Avg Delivery Time', value: '142ms', delta: '-12ms', deltaDir: 'up' },
    ],
    system_log: [
      { label: 'Logs (24h)', value: '2.4M', delta: '+8%', deltaDir: 'up' },
      { label: 'Errors', value: '1,847', delta: '+124', deltaDir: 'down' },
      { label: 'Warnings', value: '8,294', delta: '-8%', deltaDir: 'up' },
      { label: 'Services Tracked', value: '12', delta: 'All online', deltaDir: 'up' },
    ],
    backup: [
      { label: 'Total Backups', value: '1,847', delta: '+30', deltaDir: 'up' },
      { label: 'Last Backup', value: '2h ago', delta: 'On schedule', deltaDir: 'up' },
      { label: 'Storage Used', value: '847 GB', delta: '+12 GB', deltaDir: 'down' },
      { label: 'Success Rate', value: '99.2%', delta: '+0.1%', deltaDir: 'up' },
    ],
    scheduler: [
      { label: 'Scheduled Jobs', value: '48', delta: '+2', deltaDir: 'up' },
      { label: 'Running Now', value: '3', delta: 'Active', deltaDir: 'up' },
      { label: 'Failed (24h)', value: '2', delta: '-5', deltaDir: 'up' },
      { label: 'Avg Duration', value: '4m 12s', delta: '-18s', deltaDir: 'up' },
    ],
    governance: [
      { label: 'Active Workflows', value: '18', delta: '+2', deltaDir: 'up' },
      { label: 'Pending Approvals', value: '24', delta: 'Action needed', deltaDir: 'down' },
      { label: 'Completed (30d)', value: '342', delta: '+12%', deltaDir: 'up' },
      { label: 'Avg Approval Time', value: '2.4h', delta: '-22m', deltaDir: 'up' },
    ],
    geo: [
      { label: 'Countries', value: '47', delta: '+2', deltaDir: 'up' },
      { label: 'Cities', value: '2,841', delta: '+124', deltaDir: 'up' },
      { label: 'Service Areas', value: '892', delta: '+24', deltaDir: 'up' },
      { label: 'Active Regions', value: '184', delta: 'All operational', deltaDir: 'up' },
    ],
    content: [
      { label: 'Total Pages', value: '247', delta: '+12', deltaDir: 'up' },
      { label: 'Published', value: '184', delta: '74%', deltaDir: 'up' },
      { label: 'Drafts', value: '42', delta: 'In progress', deltaDir: 'up' },
      { label: 'Scheduled', value: '21', delta: '+4', deltaDir: 'up' },
    ],
    search: [
      { label: 'Searches (24h)', value: '38.4K', delta: '+12%', deltaDir: 'up' },
      { label: 'Zero Results', value: '4.2%', delta: '-0.8%', deltaDir: 'up' },
      { label: 'Avg CTR', value: '12.4%', delta: '+1.2%', deltaDir: 'up' },
      { label: 'Search Revenue', value: '$18.2K', delta: '+8%', deltaDir: 'up' },
    ],
    audit: [
      { label: 'Audit Events (24h)', value: '14,829', delta: '+8%', deltaDir: 'up' },
      { label: 'Critical Actions', value: '342', delta: 'Logged', deltaDir: 'up' },
      { label: 'Failed Access', value: '47', delta: '-12', deltaDir: 'up' },
      { label: 'Active Admins', value: '12', delta: 'All tracked', deltaDir: 'up' },
    ],
    property: [
      { label: 'Open Tickets', value: '84', delta: '+12', deltaDir: 'down' },
      { label: 'Dispatched', value: '38', delta: 'In progress', deltaDir: 'up' },
      { label: 'Resolved (24h)', value: '47', delta: '+8', deltaDir: 'up' },
      { label: 'Avg Response', value: '18m', delta: '-4m', deltaDir: 'up' },
    ],
    qa: [
      { label: 'Reviews (30d)', value: '428', delta: '+24', deltaDir: 'up' },
      { label: 'Avg Score', value: '87.2%', delta: '+1.4%', deltaDir: 'up' },
      { label: 'Flagged', value: '12', delta: 'Needs coaching', deltaDir: 'down' },
      { label: 'Compliance Rate', value: '94.1%', delta: '+0.8%', deltaDir: 'up' },
    ],
    automation: [
      { label: 'Active Rules', value: '24', delta: '+3', deltaDir: 'up' },
      { label: 'Executions (7d)', value: '8,429', delta: '+18%', deltaDir: 'up' },
      { label: 'Avg Response Time', value: '1.2s', delta: '-0.3s', deltaDir: 'up' },
      { label: 'Success Rate', value: '98.4%', delta: '+0.2%', deltaDir: 'up' },
    ],
    sdk: [
      { label: 'Available SDKs', value: '8', delta: '6 languages', deltaDir: 'up' },
      { label: 'Total Downloads', value: '248K', delta: '+18%', deltaDir: 'up' },
      { label: 'Latest Release', value: 'v2.4.1', delta: '3 days ago', deltaDir: 'up' },
      { label: 'Active Integrators', value: '1,847', delta: '+124', deltaDir: 'up' },
    ],
  };
  return statsMap[domain] ?? statsMap.org;
}

/* Settings page field generator */
export function generateSettingsFields(domain: string) {
  const fieldsMap: Record<string, { label: string; type: 'text' | 'toggle' | 'select' | 'number' | 'textarea'; value: any; options?: string[]; description?: string }[]> = {
    governance: [
      { label: 'Policy Name', type: 'text', value: 'Standard Cancellation Policy' },
      { label: 'Cancellation Window', type: 'select', value: '24 hours', options: ['12 hours', '24 hours', '48 hours', '72 hours', '7 days'] },
      { label: 'Refund Percentage', type: 'number', value: 80, description: 'Percentage refunded if cancelled within window' },
      { label: 'Auto-approve Refunds', type: 'toggle', value: false, description: 'Automatically approve refunds under $100' },
      { label: 'Require Manager Approval', type: 'toggle', value: true, description: 'Refunds over $500 require manager approval' },
      { label: 'Policy Description', type: 'textarea', value: 'Guests can cancel up to 24 hours before check-in for a full refund. Within 24 hours, a 20% fee applies.' },
    ],
    default: [
      { label: 'Name', type: 'text', value: '' },
      { label: 'Description', type: 'textarea', value: '' },
      { label: 'Status', type: 'select', value: 'active', options: ['active', 'inactive', 'draft'] },
      { label: 'Priority', type: 'select', value: 'medium', options: ['low', 'medium', 'high', 'urgent'] },
      { label: 'Enabled', type: 'toggle', value: true, description: 'Enable this configuration' },
    ],
  };
  return fieldsMap[domain] ?? fieldsMap.default;
}

/* List editor items */
export function generateListItems(domain: string, count = 12) {
  const items: { id: string; name: string; description: string; category?: string; status: string; updated: string }[] = [];
  const itemNames: Record<string, string[]> = {
    taxonomy: ['Vacation Rental', 'Hotel Room', 'Hostel', 'Resort', 'Villa', 'Apartment', 'Cabin', 'Glamping', 'Boutique Hotel', 'Guesthouse', 'Serviced Apartment', 'Tiny House'],
    kb: ['Greeting & Verification', 'New Booking Flow', 'Date Modification', 'Cancellation Process', 'Refund Explanation', 'Upselling Premium', 'Handling Price Objections', 'Lockout Emergency Steps', 'Maintenance Dispatch Protocol', 'Noise Complaint De-escalation', 'Check-in Issues Guide', 'Payment Failure Recovery'],
    content: ['Homepage Hero Update', 'About Us Revision', 'Terms of Service v3.2', 'Privacy Policy Update', 'Summer Campaign Landing', 'Vendor Onboarding Guide', 'Help Center: Booking FAQ', 'Email: Welcome Series', 'Push: Booking Confirmed', 'SMS: Check-in Reminder', 'Cancellation Policy Page', 'Partner Program Page'],
    messaging: ['Welcome Message', 'Booking Confirmation', 'Check-in Instructions', 'Cancellation Notice', 'Refund Processed', 'Review Request', 'Payment Reminder', 'Host Verification', 'Reservation Modified', 'Payout Notification'],
  };
  const names = itemNames[domain] ?? itemNames.content;
  for (let i = 0; i < count; i++) {
    items.push({
      id: id('ITM', range(1000, 9999)),
      name: names[i % names.length],
      description: 'Standard configuration item with detailed instructions and automated triggers.',
      category: pick(['General', 'Emergency', 'Sales', 'Support', 'Billing']),
      status: pick(['active', 'draft', 'archived']),
      updated: dateStr(range(0, 90)),
    });
  }
  return items;
}
