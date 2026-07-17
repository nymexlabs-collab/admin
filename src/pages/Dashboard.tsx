import { useState } from 'react';
import {
  DollarSign, Users, CalendarCheck, ShoppingCart, Activity,
  Zap, ArrowRight, ShieldAlert, Globe, Star,
  TrendingUp, TrendingDown, Clock, AlertTriangle,
  CreditCard, ChevronRight, Filter,
  Bookmark, History, type LucideIcon,
} from 'lucide-react';
import { Card, CardHeader, CardBody, StatCard, Badge, BarChart, ProgressBar, Avatar, Button, SegmentedControl } from '../components/ui';
import { platformActivity, recentActivity, makeName } from '../data/mock';

/* ---------- Dashboard widget data ---------- */
const revenueBars = [
  { label: 'Mon', value: 182 }, { label: 'Tue', value: 214 }, { label: 'Wed', value: 198 },
  { label: 'Thu', value: 241 }, { label: 'Fri', value: 268 }, { label: 'Sat', value: 294 },
  { label: 'Sun', value: 284, highlight: true },
];

const reservationsByHour = [
  { label: '6a', value: 24 }, { label: '8a', value: 68 }, { label: '10a', value: 124 },
  { label: '12p', value: 186 }, { label: '2p', value: 214 }, { label: '4p', value: 178 },
  { label: '6p', value: 142 }, { label: '8p', value: 98 }, { label: '10p', value: 52 },
];

const ordersByCategory = [
  { label: 'Vacation', value: 1428 }, { label: 'Events', value: 892 },
  { label: 'Tickets', value: 624 }, { label: 'Services', value: 218 }, { label: 'Other', value: 132 },
];

const systemHealth = [
  { label: 'API Gateway', value: 99.2, tone: 'success' as const },
  { label: 'Database', value: 97.8, tone: 'success' as const },
  { label: 'Call Infrastructure', value: 94.1, tone: 'warning' as const },
  { label: 'Media CDN', value: 99.9, tone: 'success' as const },
  { label: 'Search Index', value: 98.4, tone: 'success' as const },
  { label: 'Payment Gateway', value: 96.2, tone: 'warning' as const },
];

const alerts = [
  { id: 1, severity: 'critical' as const, title: 'Fraud cluster detected', desc: '3 vendor accounts flagged for review', time: '12m ago', icon: ShieldAlert },
  { id: 2, severity: 'warning' as const, title: 'Call infrastructure degraded', desc: '94.1% uptime — investigate SIP gateway', time: '34m ago', icon: AlertTriangle },
  { id: 3, severity: 'info' as const, title: 'Scheduled maintenance window', desc: 'Database optimization tonight at 2:00 AM UTC', time: '2h ago', icon: Clock },
];

const activeUsersBreakdown = [
  { label: 'Vendors', value: 1294, color: 'bg-primary' },
  { label: 'Customers', value: 14289, color: 'bg-secondary' },
  { label: 'Agents', value: 24, color: 'bg-tertiary' },
  { label: 'Admins', value: 12, color: 'bg-error' },
];

const marketplaceKpis = [
  { label: 'Total Listings', value: '8,429', delta: '+142', dir: 'up' as const },
  { label: 'Active Vendors', value: '1,892', delta: '+38', dir: 'up' as const },
  { label: 'Avg Rating', value: '4.6', delta: '+0.2', dir: 'up' as const },
  { label: 'Pending Review', value: '47', delta: 'Action needed', dir: 'down' as const },
];

/* Cross-Entity Timeline data — used inside detail pages */
const crossEntityTimeline = [
  { time: '2m ago', actor: 'System', action: 'Payment captured', entity: 'TXN-48291', type: 'commerce' },
  { time: '18m ago', actor: makeName(), action: 'Booking confirmed', entity: 'RES-18947', type: 'reservation' },
  { time: '1h ago', actor: makeName(), action: 'Profile updated', entity: 'USR-48291', type: 'user' },
  { time: '3h ago', actor: makeName(), action: 'Listing approved', entity: 'LST-92847', type: 'listing' },
  { time: '5h ago', actor: 'System', action: 'Refund processed', entity: 'TXN-38291', type: 'commerce' },
  { time: '8h ago', actor: makeName(), action: 'Review submitted', entity: 'REV-72819', type: 'listing' },
  { time: '1d ago', actor: makeName(), action: 'Account created', entity: 'USR-89241', type: 'user' },
  { time: '2d ago', actor: 'System', action: 'Payout sent', entity: 'PYT-19284', type: 'commerce' },
];

const timelineIconMap: Record<string, LucideIcon> = {
  commerce: CreditCard,
  reservation: CalendarCheck,
  user: Users,
  listing: Globe,
};

/* Saved Views */
const savedViews = [
  { id: 'all', label: 'All Records' },
  { id: 'active', label: 'Active Only' },
  { id: 'today', label: 'Created Today' },
  { id: 'mine', label: 'Assigned to Me' },
  { id: 'flagged', label: 'Flagged / Pending' },
];

export function DashboardPage({ onNavigate }: { onNavigate: (p: string) => void }) {
  const [range, setRange] = useState<'24h' | '7d' | '30d'>('24h');
  const [alertDismissed, setAlertDismissed] = useState<Set<number>>(new Set());

  const visibleAlerts = alerts.filter((a) => !alertDismissed.has(a.id));

  const kpis = [
    { label: 'GMV Today', value: '$284.5K', delta: '+12.4%', dir: 'up' as const, icon: DollarSign, spark: [180, 195, 210, 224, 240, 258, 272, 284] },
    { label: 'Active Users', value: '18,429', delta: '+3.2%', dir: 'up' as const, icon: Users, spark: [15, 16, 15.5, 16.8, 17.2, 17.8, 18.1, 18.4] },
    { label: 'Reservations Today', value: '1,847', delta: '+8.1%', dir: 'up' as const, icon: CalendarCheck, spark: [1.2, 1.4, 1.3, 1.5, 1.6, 1.7, 1.78, 1.85] },
    { label: 'Orders Today', value: '3,294', delta: '-1.4%', dir: 'down' as const, icon: ShoppingCart, spark: [3.4, 3.5, 3.3, 3.45, 3.38, 3.32, 3.30, 3.29] },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface">Operations Dashboard</h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-0.5">Real-time platform health, revenue, and activity — last updated 2 min ago</p>
        </div>
        <div className="flex items-center gap-2">
          <SegmentedControl
            value={range}
            onChange={setRange}
            options={[
              { value: '24h', label: '24h' },
              { value: '7d', label: '7d' },
              { value: '30d', label: '30d' },
            ]}
          />
          <Button variant="secondary" size="md" icon={ArrowRight} onClick={() => onNavigate('/analytics')}>
            Full Analytics
          </Button>
        </div>
      </div>

      {/* Alerts Banner — appears at top when triggered */}
      {visibleAlerts.length > 0 && (
        <div className="space-y-2">
          {visibleAlerts.map((alert) => {
            const AlertIcon = alert.icon;
            const tone = alert.severity === 'critical' ? 'bg-error-container/60 border-error/30' : alert.severity === 'warning' ? 'bg-warning-container/50 border-warning/30' : 'bg-tertiary-fixed/40 border-tertiary/30';
            const iconColor = alert.severity === 'critical' ? 'text-error' : alert.severity === 'warning' ? 'text-warning' : 'text-tertiary';
            return (
              <div key={alert.id} className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${tone} animate-slide-in-right`}>
                <AlertIcon className={`w-5 h-5 ${iconColor} shrink-0`} />
                <div className="flex-1 min-w-0">
                  <span className="font-body-md text-body-md text-on-surface font-semibold">{alert.title}</span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant ml-2">{alert.desc}</span>
                </div>
                <span className="text-label-sm text-label-sm text-on-surface-variant shrink-0 hidden sm:inline">{alert.time}</span>
                {alert.severity === 'critical' && (
                  <Button variant="danger" size="sm" onClick={() => onNavigate('/marketplace/trust/fraud')}>Review</Button>
                )}
                <button onClick={() => setAlertDismissed((p) => new Set([...p, alert.id]))} className="btn-icon shrink-0">
                  <span className="text-on-surface-variant text-lg leading-none">&times;</span>
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* KPI Row — Marketplace KPIs widget */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {kpis.map((k) => (
          <StatCard
            key={k.label}
            label={k.label}
            value={k.value}
            delta={k.delta}
            deltaDirection={k.dir}
            icon={k.icon}
            sparkline={k.spark}
          />
        ))}
      </div>

      {/* Revenue Snapshot + Reservations Today */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Revenue Snapshot Widget — Data FROM: Commerce/Transactions, Commerce/Payouts */}
        <Card className="lg:col-span-2">
          <CardHeader
            title="Revenue Snapshot"
            subtitle="Gross merchandise value, last 7 days — data from Commerce/Transactions, Payouts"
            icon={DollarSign}
            action={<Badge tone="success" dot>Growing</Badge>}
          />
          <CardBody>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div>
                <div className="text-label-md text-label-md text-on-surface-variant mb-1">MRR</div>
                <div className="font-headline-md text-headline-md text-on-surface tabular-nums">$2.4M</div>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3 text-success" />
                  <span className="text-label-sm text-success">+8.2%</span>
                </div>
              </div>
              <div>
                <div className="text-label-md text-label-md text-on-surface-variant mb-1">ARR</div>
                <div className="font-headline-md text-headline-md text-on-surface tabular-nums">$28.8M</div>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3 text-success" />
                  <span className="text-label-sm text-success">+14.1%</span>
                </div>
              </div>
              <div>
                <div className="text-label-md text-label-md text-on-surface-variant mb-1">Take Rate</div>
                <div className="font-headline-md text-headline-md text-on-surface tabular-nums">12.4%</div>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3 text-success" />
                  <span className="text-label-sm text-success">+0.3%</span>
                </div>
              </div>
            </div>
            <BarChart data={revenueBars} height={180} />
          </CardBody>
        </Card>

        {/* Reservations Today Widget — Data FROM: Reservation Services/New Reservations */}
        <Card>
          <CardHeader
            title="Reservations Today"
            subtitle="Volume by hour — from New Reservations"
            icon={CalendarCheck}
            action={<Button variant="ghost" size="sm" iconRight={ArrowRight} onClick={() => onNavigate('/reservations/operations')}>Manage</Button>}
          />
          <CardBody>
            <div className="mb-4">
              <span className="font-display-sm text-display-sm text-on-surface tabular-nums">1,847</span>
              <Badge tone="success" className="ml-2">+8.1%</Badge>
            </div>
            <BarChart data={reservationsByHour} height={140} />
          </CardBody>
        </Card>
      </div>

      {/* Live Platform Activity + System Health + Active Users */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Live Platform Activity Widget — Data FROM: System/Monitoring, Users/Sessions */}
        <Card className="lg:col-span-2">
          <CardHeader
            title="Live Platform Activity"
            subtitle="Real-time event stream — from System/Monitoring, Users/Sessions"
            icon={Activity}
            action={<Badge tone="info" dot>Live</Badge>}
          />
          <CardBody className="pt-0">
            <div className="space-y-0">
              {platformActivity.map((evt, i) => (
                <div key={i} className="flex items-center gap-3 py-2.5 border-b border-outline-variant/40 last:border-0">
                  <span className="text-label-sm text-label-sm text-on-surface-variant tabular-nums w-12 shrink-0">{evt.time}</span>
                  <div className="w-7 h-7 rounded-full bg-secondary-container/40 flex items-center justify-center shrink-0">
                    <Globe className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="font-body-sm text-body-sm text-on-surface">{evt.event}</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant"> · {evt.entity}</span>
                  </div>
                  <span className="text-label-sm text-label-sm text-on-surface-variant shrink-0 hidden sm:inline">{evt.user}</span>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        <div className="space-y-4">
          {/* System Health Widget — Data FROM: System/Monitoring, System/Health Checks */}
          <Card>
            <CardHeader
              title="System Health"
              subtitle="Service uptime — from Monitoring, Health Checks"
              icon={Zap}
              action={<Button variant="ghost" size="sm" iconRight={ArrowRight} onClick={() => onNavigate('/system/metrics')}>Details</Button>}
            />
            <CardBody className="space-y-3">
              {systemHealth.map((s) => (
                <div key={s.label}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-body-sm text-body-sm text-on-surface">{s.label}</span>
                    <span className="text-label-md text-label-md text-on-surface-variant tabular-nums">{s.value}%</span>
                  </div>
                  <ProgressBar value={s.value} tone={s.tone} />
                </div>
              ))}
            </CardBody>
          </Card>

          {/* Active Users Widget — Data FROM: Users/Sessions, Users/All Users */}
          <Card>
            <CardHeader
              title="Active Users"
              subtitle="By role — from Sessions, All Users"
              icon={Users}
              action={<Button variant="ghost" size="sm" iconRight={ArrowRight} onClick={() => onNavigate('/users')}>View</Button>}
            />
            <CardBody>
              <div className="flex items-baseline gap-2 mb-3">
                <span className="font-headline-lg text-headline-lg text-on-surface tabular-nums">18,429</span>
                <span className="font-body-sm text-body-sm text-on-surface-variant">online now</span>
              </div>
              <div className="space-y-2">
                {activeUsersBreakdown.map((u) => (
                  <div key={u.label} className="flex items-center gap-3">
                    <span className="text-body-sm text-body-sm text-on-surface-variant w-20">{u.label}</span>
                    <div className="flex-1 h-2 bg-surface-container-high rounded-full overflow-hidden">
                      <div className={`h-full ${u.color} rounded-full transition-all duration-500`} style={{ width: `${(u.value / 14289) * 100}%` }} />
                    </div>
                    <span className="text-body-sm text-body-sm text-on-surface tabular-nums w-12 text-right">{u.value.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>
      </div>

      {/* Marketplace KPIs + Orders Today */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Marketplace KPIs Widget — Data FROM: Commerce/Orders, Reservation Services/Reservations */}
        <Card className="lg:col-span-2">
          <CardHeader
            title="Marketplace KPIs"
            subtitle="Platform metrics — from Commerce/Orders, Reservations"
            icon={Star}
            action={<Button variant="ghost" size="sm" iconRight={ArrowRight} onClick={() => onNavigate('/marketplace/listings')}>Marketplace</Button>}
          />
          <CardBody>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {marketplaceKpis.map((kpi) => (
                <div key={kpi.label} className="p-4 rounded-xl bg-surface-container-low">
                  <div className="text-label-md text-label-md text-on-surface-variant mb-1">{kpi.label}</div>
                  <div className="font-headline-md text-headline-md text-on-surface tabular-nums">{kpi.value}</div>
                  <div className={`flex items-center gap-1 mt-1 ${kpi.dir === 'up' ? 'text-success' : 'text-error'}`}>
                    {kpi.dir === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    <span className="text-label-sm">{kpi.delta}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* Orders Today Widget — Data FROM: Commerce/Orders */}
        <Card>
          <CardHeader
            title="Orders Today"
            subtitle="By category — from Commerce/Orders"
            icon={ShoppingCart}
            action={<Button variant="ghost" size="sm" iconRight={ArrowRight} onClick={() => onNavigate('/commerce/orders')}>View</Button>}
          />
          <CardBody>
            <div className="flex items-baseline gap-2 mb-4">
              <span className="font-headline-lg text-headline-lg text-on-surface tabular-nums">3,294</span>
              <Badge tone="error">-1.4%</Badge>
            </div>
            <div className="space-y-2.5">
              {ordersByCategory.map((cat) => {
                const max = Math.max(...ordersByCategory.map((c) => c.value));
                return (
                  <div key={cat.label}>
                    <div className="flex justify-between mb-1">
                      <span className="text-body-sm text-body-sm text-on-surface-variant">{cat.label}</span>
                      <span className="text-body-sm text-body-sm text-on-surface tabular-nums">{cat.value.toLocaleString()}</span>
                    </div>
                    <ProgressBar value={(cat.value / max) * 100} tone="primary" />
                  </div>
                );
              })}
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Recent Activity Widget — Data FROM: Audit Logs (System node) */}
      <Card>
        <CardHeader
          title="Recent Activity"
          subtitle="Last 20 admin events — from Audit Logs (System)"
          icon={History}
          action={
            <div className="flex items-center gap-2">
              {/* Saved Views dropdown — interacts with Dashboard filters, state stored in User Preferences */}
              <SavedViewsDropdown />
              <Button variant="ghost" size="sm" iconRight={ArrowRight} onClick={() => onNavigate('/settings/audit-logs')}>View logs</Button>
            </div>
          }
        />
        <CardBody className="pt-0">
          <div className="space-y-0">
            {recentActivity.slice(0, 12).map((a, i) => (
              <div key={i} className="flex items-center gap-3 py-2.5 border-b border-outline-variant/40 last:border-0">
                <Avatar name={a.actor} size="sm" />
                <div className="flex-1 min-w-0">
                  <span className="font-body-sm text-body-sm text-on-surface">{a.actor}</span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant"> {a.action} </span>
                  <span className="font-body-sm text-body-sm text-primary">{a.target}</span>
                </div>
                <Badge tone="neutral">{a.type}</Badge>
                <span className="text-label-sm text-label-sm text-on-surface-variant shrink-0 w-12 text-right tabular-nums">{a.time}</span>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* Cross-Entity Timeline — Data FROM: Orders, Reservations, Users, Listings */}
      <Card>
        <CardHeader
          title="Cross-Entity Timeline"
          subtitle="Unified activity across Orders, Reservations, Users, and Listings"
          icon={Activity}
          action={<Badge tone="info">Embed</Badge>}
        />
        <CardBody className="pt-0">
          <div className="relative">
            <div className="absolute left-[15px] top-2 bottom-2 w-px bg-outline-variant" />
            <div className="space-y-0">
              {crossEntityTimeline.map((evt, i) => {
                const TimelineIcon = timelineIconMap[evt.type] ?? Globe;
                return (
                  <div key={i} className="flex items-center gap-3 py-3 relative">
                    <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center shrink-0 z-10 border-2 border-surface">
                      <TimelineIcon className="w-3.5 h-3.5 text-on-surface-variant" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="font-body-sm text-body-sm text-on-surface">{evt.actor}</span>
                      <span className="font-body-sm text-body-sm text-on-surface-variant"> {evt.action} </span>
                      <code className="font-body-sm text-body-sm text-primary">{evt.entity}</code>
                    </div>
                    <span className="text-label-sm text-label-sm text-on-surface-variant shrink-0">{evt.time}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

/* ---------- Saved Views Dropdown ---------- */
/* Interacts with: Dashboard filters. State stored in: User Preferences */
function SavedViewsDropdown() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState('all');

  return (
    <div className="relative">
      <Button variant="secondary" size="sm" icon={Bookmark} onClick={() => setOpen((v) => !v)}>
        {savedViews.find((v) => v.id === selected)?.label ?? 'Saved Views'}
        <ChevronRight className={`w-3 h-3 ml-1 transition-transform ${open ? 'rotate-90' : ''}`} />
      </Button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-1.5 w-48 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-elevated overflow-hidden z-50 animate-scale-in">
            <div className="px-3 py-2 border-b border-outline-variant text-label-sm text-on-surface-variant uppercase tracking-wider">Saved Views</div>
            {savedViews.map((v) => (
              <button
                key={v.id}
                onClick={() => { setSelected(v.id); setOpen(false); }}
                className={`w-full text-left px-3 py-2.5 flex items-center gap-2 text-body-sm hover:bg-surface-container-low ${selected === v.id ? 'text-primary font-semibold' : 'text-on-surface'}`}
              >
                <Bookmark className={`w-3.5 h-3.5 ${selected === v.id ? 'fill-primary text-primary' : 'text-on-surface-variant'}`} />
                {v.label}
              </button>
            ))}
            <div className="px-3 py-2 border-t border-outline-variant">
              <button className="w-full text-left text-body-sm text-primary flex items-center gap-2">
                <Filter className="w-3.5 h-3.5" />
                Save current view…
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
