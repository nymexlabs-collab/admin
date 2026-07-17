import { useState } from 'react';
import {
  DollarSign, Users, CalendarCheck, ShoppingCart, Activity, Cpu,
  Zap, ArrowRight, ShieldAlert, Globe,
} from 'lucide-react';
import { Card, CardHeader, CardBody, StatCard, Badge, BarChart, ProgressBar, Avatar, Button, SegmentedControl } from '../components/ui';
import { platformActivity, recentActivity, liveCalls } from '../data/mock';

export function DashboardPage({ onNavigate }: { onNavigate: (p: string) => void }) {
  const [range, setRange] = useState<'24h' | '7d' | '30d'>('24h');

  const kpis = [
    { label: 'GMV Today', value: '$284.5K', delta: '+12.4%', dir: 'up' as const, icon: DollarSign, spark: [180, 195, 210, 224, 240, 258, 272, 284] },
    { label: 'Active Users', value: '18,429', delta: '+3.2%', dir: 'up' as const, icon: Users, spark: [15, 16, 15.5, 16.8, 17.2, 17.8, 18.1, 18.4] },
    { label: 'Reservations Today', value: '1,847', delta: '+8.1%', dir: 'up' as const, icon: CalendarCheck, spark: [1.2, 1.4, 1.3, 1.5, 1.6, 1.7, 1.78, 1.85] },
    { label: 'Orders Today', value: '3,294', delta: '-1.4%', dir: 'down' as const, icon: ShoppingCart, spark: [3.4, 3.5, 3.3, 3.45, 3.38, 3.32, 3.30, 3.29] },
  ];

  const revenueBars = [
    { label: 'Mon', value: 182 }, { label: 'Tue', value: 214 }, { label: 'Wed', value: 198 },
    { label: 'Thu', value: 241 }, { label: 'Fri', value: 268 }, { label: 'Sat', value: 294 },
    { label: 'Sun', value: 284, highlight: true },
  ];

  const systemHealth = [
    { label: 'API Gateway', value: 99.2, tone: 'success' as const },
    { label: 'Database', value: 97.8, tone: 'success' as const },
    { label: 'Call Infrastructure', value: 94.1, tone: 'warning' as const },
    { label: 'Media CDN', value: 99.9, tone: 'success' as const },
  ];

  const reservationsByHour = [
    { label: '6a', value: 24 }, { label: '8a', value: 68 }, { label: '10a', value: 124 },
    { label: '12p', value: 186 }, { label: '2p', value: 214 }, { label: '4p', value: 178 },
    { label: '6p', value: 142 }, { label: '8p', value: 98 }, { label: '10p', value: 52 },
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

      {/* KPI Row */}
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

      {/* Revenue + Reservations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader
            title="Revenue Snapshot"
            subtitle="Gross merchandise value, last 7 days"
            icon={DollarSign}
            action={<Badge tone="success" dot>Growing</Badge>}
          />
          <CardBody>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div>
                <div className="text-label-md text-label-md text-on-surface-variant mb-1">MRR</div>
                <div className="font-headline-md text-headline-md text-on-surface tabular-nums">$2.4M</div>
              </div>
              <div>
                <div className="text-label-md text-label-md text-on-surface-variant mb-1">ARR</div>
                <div className="font-headline-md text-headline-md text-on-surface tabular-nums">$28.8M</div>
              </div>
              <div>
                <div className="text-label-md text-label-md text-on-surface-variant mb-1">Take Rate</div>
                <div className="font-headline-md text-headline-md text-on-surface tabular-nums">12.4%</div>
              </div>
            </div>
            <BarChart data={revenueBars} height={180} />
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Reservations Today" subtitle="Volume by hour" icon={CalendarCheck} />
          <CardBody>
            <div className="mb-4">
              <span className="font-display-sm text-display-sm text-on-surface tabular-nums">1,847</span>
              <Badge tone="success" className="ml-2">+8.1%</Badge>
            </div>
            <BarChart data={reservationsByHour} height={140} />
          </CardBody>
        </Card>
      </div>

      {/* Live Platform Activity + System Health */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader
            title="Live Platform Activity"
            subtitle="Real-time event stream"
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
          <Card>
            <CardHeader title="System Health" subtitle="Service uptime" icon={Zap} />
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

          <Card>
            <CardHeader title="Active Calls" subtitle="Call center right now" icon={Cpu} />
            <CardBody>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="font-headline-lg text-headline-lg text-on-surface tabular-nums">{liveCalls.length}</span>
                <span className="font-body-sm text-body-sm text-on-surface-variant">in progress</span>
              </div>
              <Button variant="ghost" size="sm" iconRight={ArrowRight} onClick={() => onNavigate('/reservations/callcenter')}>
                View Call Center
              </Button>
            </CardBody>
          </Card>
        </div>
      </div>

      {/* Recent Activity Table */}
      <Card>
        <CardHeader
          title="Recent Activity"
          subtitle="Last 20 admin events across the platform"
          icon={ShieldAlert}
          action={<Button variant="ghost" size="sm" iconRight={ArrowRight} onClick={() => onNavigate('/system/logs')}>View logs</Button>}
        />
        <CardBody className="pt-0">
          <div className="space-y-0">
            {recentActivity.slice(0, 10).map((a, i) => (
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
    </div>
  );
}
