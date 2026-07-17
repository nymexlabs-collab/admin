import { useState } from 'react';
import { Plug, Activity, AlertCircle, CheckCircle2, Clock, Zap, Key, Download } from 'lucide-react';
import { Card, CardHeader, CardBody, Badge, Button, StatCard, Table, THead, TH, TR, TD, SegmentedControl, ProgressBar, PageHeader } from '../components/ui';
import { apiEndpoints, apiLatencySeries, apiConsumers } from '../data/mock';

export function ApiUsagePage() {
  const [range, setRange] = useState<'1h' | '24h' | '7d'>('24h');

  const totalCalls = apiEndpoints.reduce((s, e) => s + e.calls, 0);
  const avgError = (apiEndpoints.reduce((s, e) => s + e.errorRate, 0) / apiEndpoints.length).toFixed(1);
  const avgLatency = Math.round(apiEndpoints.reduce((s, e) => s + e.avgLatency, 0) / apiEndpoints.length);

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="API Usage Monitor"
        subtitle="Endpoint performance, error rates, and consumer traffic"
        icon={Plug}
        breadcrumbs={[{ label: 'API Management' }, { label: 'Usage' }]}
        actions={
          <>
            <SegmentedControl value={range} onChange={setRange} options={[{ value: '1h', label: '1h' }, { value: '24h', label: '24h' }, { value: '7d', label: '7d' }]} />
            <Button variant="secondary" icon={Download}>Export</Button>
          </>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Requests" value={(totalCalls / 1000).toFixed(0)} unit="K" delta="+18.2%" deltaDirection="up" icon={Activity} sparkline={[420, 480, 520, 580, 640, 720, 810, 890]} />
        <StatCard label="Avg Latency" value={avgLatency} unit="ms" delta="-8ms" deltaDirection="up" icon={Clock} sparkline={[142, 128, 110, 105, 98, 92, 88, 84]} />
        <StatCard label="Error Rate" value={avgError} unit="%" delta="-0.2%" deltaDirection="up" icon={AlertCircle} sparkline={[1.2, 1.1, 0.9, 0.8, 0.7, 0.6, 0.5, 0.4]} />
        <StatCard label="Active Consumers" value={apiConsumers.filter(c => c.status === 'active').length} icon={Key} delta="4 live" deltaDirection="up" />
      </div>

      {/* Latency chart + status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader title="Request Latency" subtitle="P95 across all endpoints, last 20 minutes" icon={Clock} action={<Badge tone="success" dot>Healthy</Badge>} />
          <CardBody>
            <div className="flex items-baseline gap-2 mb-4">
              <span className="font-display-sm text-display-sm text-on-surface tabular-nums">{avgLatency}ms</span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">average</span>
              <Badge tone="success">-8ms</Badge>
            </div>
            <div className="flex items-end gap-1.5 h-40">
              {apiLatencySeries.map((v, i) => (
                <div key={i} className="flex-1 flex flex-col items-center justify-end group">
                  <div className="w-full rounded-t-md bg-secondary-container group-hover:bg-primary transition-colors relative" style={{ height: `${(v / 320) * 100}%` }}>
                    <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-label-sm text-label-sm text-on-surface-variant opacity-0 group-hover:opacity-100 transition-opacity tabular-nums">{v}ms</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2 text-label-sm text-label-sm text-on-surface-variant">
              <span>20m ago</span>
              <span>now</span>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Service Status" subtitle="All systems" icon={Zap} />
          <CardBody className="space-y-3">
            {[
              { name: 'API Gateway', status: 'operational', latency: '84ms' },
              { name: 'Auth Service', status: 'operational', latency: '42ms' },
              { name: 'Search Index', status: 'operational', latency: '124ms' },
              { name: 'Payment API', status: 'degraded', latency: '218ms' },
              { name: 'Webhook Delivery', status: 'operational', latency: '156ms' },
            ].map((s) => (
              <div key={s.name} className="flex items-center gap-3">
                {s.status === 'operational' ? (
                  <CheckCircle2 className="w-5 h-5 text-success shrink-0" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-warning shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="font-body-sm text-body-sm text-on-surface">{s.name}</div>
                  <div className="text-label-sm text-label-sm text-on-surface-variant tabular-nums">{s.latency}</div>
                </div>
                <Badge tone={s.status === 'operational' ? 'success' : 'warning'}>
                  {s.status === 'operational' ? 'OK' : 'Degraded'}
                </Badge>
              </div>
            ))}
          </CardBody>
        </Card>
      </div>

      {/* Endpoint table */}
      <Card>
        <CardHeader title="Endpoint Performance" subtitle="Top endpoints by request volume" icon={Activity} />
        <CardBody className="pt-0">
          <Table>
            <THead>
              <TR>
                <TH>Endpoint</TH>
                <TH>Method</TH>
                <TH>Calls</TH>
                <TH>Error Rate</TH>
                <TH>Avg Latency</TH>
                <TH>Performance</TH>
              </TR>
            </THead>
            <tbody>
              {apiEndpoints.sort((a, b) => b.calls - a.calls).map((e) => (
                <TR key={e.path}>
                  <TD><code className="font-body-sm text-body-sm text-on-surface">{e.path}</code></TD>
                  <TD>
                    <Badge tone={e.method === 'GET' ? 'info' : e.method === 'POST' ? 'primary' : 'warning'}>{e.method}</Badge>
                  </TD>
                  <TD><span className="font-body-md text-body-md text-on-surface tabular-nums">{e.calls.toLocaleString()}</span></TD>
                  <TD>
                    <span className={`font-body-md text-body-md tabular-nums ${e.errorRate > 1 ? 'text-error' : 'text-on-surface'}`}>
                      {e.errorRate}%
                    </span>
                  </TD>
                  <TD>
                    <span className={`font-body-md text-body-md tabular-nums ${e.avgLatency > 200 ? 'text-warning' : 'text-on-surface'}`}>
                      {e.avgLatency}ms
                    </span>
                  </TD>
                  <TD>
                    <div className="flex items-center gap-2 w-32">
                      <ProgressBar
                        value={100 - e.errorRate * 20}
                        tone={e.errorRate > 1 ? 'error' : e.avgLatency > 200 ? 'warning' : 'success'}
                      />
                    </div>
                  </TD>
                </TR>
              ))}
            </tbody>
          </Table>
        </CardBody>
      </Card>

      {/* Consumers */}
      <Card>
        <CardHeader title="API Consumers" subtitle="Active integrations using your API" icon={Key} action={<Button variant="secondary" size="sm" icon={Key}>Manage Keys</Button>} />
        <CardBody className="pt-0">
          <Table>
            <THead>
              <TR>
                <TH>Consumer</TH>
                <TH>API Key</TH>
                <TH>Calls (24h)</TH>
                <TH>Status</TH>
              </TR>
            </THead>
            <tbody>
              {apiConsumers.map((c) => (
                <TR key={c.name}>
                  <TD><span className="font-body-md text-body-md text-on-surface">{c.name}</span></TD>
                  <TD><code className="font-body-sm text-body-sm text-on-surface-variant">{c.key}</code></TD>
                  <TD><span className="font-body-md text-body-md text-on-surface tabular-nums">{c.calls.toLocaleString()}</span></TD>
                  <TD><Badge tone={c.status === 'active' ? 'success' : 'warning'} dot>{c.status}</Badge></TD>
                </TR>
              ))}
            </tbody>
          </Table>
        </CardBody>
      </Card>
    </div>
  );
}
