import { useState, useMemo } from 'react';
import {
  Search, Plus, Download, MoreVertical, Filter, Star,
  TrendingUp, TrendingDown, Minus, ArrowRight, BarChart3, Activity, Database,
} from 'lucide-react';
import {
  Card, CardHeader, CardBody, Badge, Button, StatCard, Table, THead, TH, TR, TD,
  SegmentedControl, ProgressBar, Avatar, PageHeader, EmptyState, Toggle,
} from './ui';
import { type RouteMeta } from '../routes';
import { generateRows, getColumns, generateStats, generateChartData, generateSettingsFields, generateListItems, mulberry32, getDomainMeta } from '../data/factory';

const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const range = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

/* Status badge tone mapping */
function statusTone(status: string): 'success' | 'warning' | 'error' | 'neutral' | 'info' | 'primary' {
  const positive = ['active', 'completed', 'resolved', 'published', 'approved', 'confirmed', 'checked_in', 'checked_out', 'in_stock', 'verified', 'stable', 'running', 'success', 'info'];
  const warning = ['pending', 'processing', 'under_review', 'draft', 'scheduled', 'trial', 'low_stock', 'paused', 'beta', 'warning', 'pending renewal', 'dispatched', 'in_progress'];
  const error = ['suspended', 'cancelled', 'failed', 'rejected', 'escalated', 'out_of_stock', 'revoked', 'deprecated', 'error', 'expired', 'flagged', 'failing'];
  const info = ['reserved', 'deprecated', 'idle'];
  if (positive.includes(status)) return 'success';
  if (warning.includes(status)) return 'warning';
  if (error.includes(status)) return 'error';
  if (info.includes(status)) return 'info';
  return 'neutral';
}

/* Format cell value based on type */
function formatCell(col: { type: string; key: string }, value: any): string {
  if (col.type === 'money') return `$${typeof value === 'number' ? value.toLocaleString() : value}`;
  if (col.type === 'number' && col.key === 'rating') return value.toFixed(1);
  if (col.type === 'number') return typeof value === 'number' ? value.toLocaleString() : String(value);
  return String(value ?? '—');
}

/* ========================================================================
   TABLE PAGE — Master table with search, filter, stats, bulk actions
   ======================================================================== */
export function TablePage({ route }: { route: RouteMeta; onNavigate?: (p: string) => void }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(0);
  const pageSize = 10;

  const domain = route.domain;
  const meta = useMemo(() => getDomainMeta(domain), [domain]);
  const columns = useMemo(() => getColumns(domain), [domain]);
  const stats = useMemo(() => generateStats(domain), [domain]);
  const allRows = useMemo(() => generateRows(domain, 25), [domain]);

  const statusOptions = useMemo(() => {
    const statuses = new Set(allRows.map((r) => r.status).filter(Boolean));
    return ['all', ...Array.from(statuses)];
  }, [allRows]);

  const filtered = allRows.filter((r) => {
    if (statusFilter !== 'all' && r.status !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return Object.values(r).some((v) => String(v).toLowerCase().includes(q));
    }
    return true;
  });

  const paginated = filtered.slice(page * pageSize, (page + 1) * pageSize);
  const totalPages = Math.ceil(filtered.length / pageSize);

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title={route.title}
        subtitle={route.subtitle}
        icon={route.icon}
        breadcrumbs={route.breadcrumbs.map((b) => ({ label: b }))}
        actions={
          <>
            <Button variant="secondary" icon={Download}>Export</Button>
            <Button variant="primary" icon={Plus}>Add New</Button>
          </>
        }
      />

      {/* Data sources — from spec relationships */}
      <div className="flex items-center gap-2 flex-wrap text-label-sm text-label-sm text-on-surface-variant">
        <Database className="w-3.5 h-3.5" />
        <span>Data from:</span>
        {meta.dataSources.map((src) => (
          <Badge key={src} tone="info" className="text-label-sm">{src}</Badge>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <StatCard
            key={s.label}
            label={s.label}
            value={s.value}
            delta={s.delta}
            deltaDirection={s.deltaDir ?? 'up'}
          />
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            placeholder="Search…"
            className="input pl-9 h-9"
          />
        </div>
        {statusOptions.length > 1 && (
          <SegmentedControl
            value={statusFilter}
            onChange={(v) => { setStatusFilter(v); setPage(0); }}
            options={statusOptions.slice(0, 6).map((s) => ({
              value: s,
              label: s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1).replace('_', ' '),
            }))}
          />
        )}
        {selected.size > 0 && (
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-body-sm text-body-sm text-on-surface-variant">{selected.size} selected</span>
            <Button variant="secondary" size="sm">Bulk Action</Button>
            <Button variant="ghost" size="sm" onClick={() => setSelected(new Set())}>Clear</Button>
          </div>
        )}
      </div>

      {/* Table */}
      <Card>
        <Table>
          <THead>
            <TR>
              <TH className="w-10"><input type="checkbox" className="rounded border-outline" /></TH>
              {columns.map((col) => (
                <TH key={col.key}>{col.label}</TH>
              ))}
              <TH></TH>
            </TR>
          </THead>
          <tbody>
            {paginated.map((row, idx) => {
              const rowId = row.id ?? `row-${idx}`;
              return (
                <TR key={rowId}>
                  <TD>
                    <input
                      type="checkbox"
                      checked={selected.has(rowId)}
                      onChange={() => toggleSelect(rowId)}
                      className="rounded border-outline"
                    />
                  </TD>
                  {columns.map((col) => (
                    <TD key={col.key}>
                      {renderCell(col, row[col.key])}
                    </TD>
                  ))}
                  <TD><Button variant="ghost" size="icon"><MoreVertical className="w-4 h-4" /></Button></TD>
                </TR>
              );
            })}
          </tbody>
        </Table>

        {/* Pagination */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-outline-variant">
          <span className="text-body-sm text-body-sm text-on-surface-variant">
            Showing {paginated.length} of {filtered.length} records
          </span>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" disabled={page === 0} onClick={() => setPage(page - 1)}>Prev</Button>
            <span className="text-body-sm text-body-sm text-on-surface-variant px-2">
              {page + 1} / {totalPages || 1}
            </span>
            <Button variant="ghost" size="sm" disabled={page >= totalPages - 1} onClick={() => setPage(page + 1)}>Next</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

function renderCell(col: { type: string; key: string }, value: any) {
  if (!value && value !== 0) return <span className="text-body-sm text-body-sm text-outline">—</span>;

  if (col.type === 'badge') {
    return <Badge tone={statusTone(value)} dot>{String(value).replace(/_/g, ' ')}</Badge>;
  }

  if (col.type === 'avatar') {
    return (
      <div className="flex items-center gap-2">
        <Avatar name={String(value)} size="sm" />
        <span className="text-body-sm text-body-sm text-on-surface">{value}</span>
      </div>
    );
  }

  if (col.type === 'money') {
    return <span className="text-body-md text-body-md text-on-surface tabular-nums">{formatCell(col, value)}</span>;
  }

  if (col.type === 'progress') {
    const pct = typeof value === 'number' ? value : 0;
    return (
      <div className="flex items-center gap-2 w-28">
        <ProgressBar value={pct} tone={pct > 85 ? 'warning' : 'primary'} />
        <span className="text-label-sm text-label-sm text-on-surface-variant tabular-nums w-9">{pct}%</span>
      </div>
    );
  }

  if (col.type === 'number') {
    if (col.key === 'rating') {
      return (
        <span className="inline-flex items-center gap-1 text-body-sm text-body-sm text-on-surface tabular-nums">
          <Star className="w-3.5 h-3.5 text-warning fill-warning" />
          {Number(value).toFixed(1)}
        </span>
      );
    }
    return <span className="text-body-sm text-body-sm text-on-surface tabular-nums">{formatCell(col, value)}</span>;
  }

  if (col.type === 'id') {
    return <code className="text-body-sm text-body-sm text-on-surface">{value}</code>;
  }

  if (col.type === 'date') {
    return <span className="text-body-sm text-body-sm text-on-surface-variant tabular-nums">{value}</span>;
  }

  return <span className="text-body-sm text-body-sm text-on-surface">{value}</span>;
}

/* ========================================================================
   SETTINGS PAGE — Form fields with toggles, selects, text inputs
   ======================================================================== */
export function SettingsPage({ route }: { route: RouteMeta }) {
  const meta = useMemo(() => getDomainMeta(route.domain), [route.domain]);
  const fields = useMemo(() => generateSettingsFields(route.domain), [route.domain]);
  const [values, setValues] = useState<Record<string, any>>(() =>
    Object.fromEntries(fields.map((f) => [f.label, f.value]))
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title={route.title}
        subtitle={route.subtitle}
        icon={route.icon}
        breadcrumbs={route.breadcrumbs.map((b) => ({ label: b }))}
        actions={
          <>
            <Button variant="secondary">Reset</Button>
            <Button variant="primary">Save Changes</Button>
          </>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader title="Configuration" subtitle="General settings for this module" />
            <CardBody className="space-y-5">
              {fields.map((field) => (
                <div key={field.label}>
                  <label className="text-label-md text-label-md text-on-surface-variant mb-1.5 block">{field.label}</label>
                  {field.type === 'toggle' ? (
                    <div className="flex items-center gap-3">
                      <Toggle
                        checked={values[field.label] ?? false}
                        onChange={(v) => setValues((p) => ({ ...p, [field.label]: v }))}
                      />
                      {field.description && (
                        <span className="text-body-sm text-body-sm text-on-surface-variant">{field.description}</span>
                      )}
                    </div>
                  ) : field.type === 'select' ? (
                    <select
                      value={values[field.label] ?? ''}
                      onChange={(e) => setValues((p) => ({ ...p, [field.label]: e.target.value }))}
                      className="input"
                    >
                      {field.options?.map((o) => <option key={o} value={o}>{o}</option>)}
                    </select>
                  ) : field.type === 'textarea' ? (
                    <textarea
                      value={values[field.label] ?? ''}
                      onChange={(e) => setValues((p) => ({ ...p, [field.label]: e.target.value }))}
                      rows={4}
                      className="input resize-none"
                    />
                  ) : field.type === 'number' ? (
                    <input
                      type="number"
                      value={values[field.label] ?? ''}
                      onChange={(e) => setValues((p) => ({ ...p, [field.label]: Number(e.target.value) }))}
                      className="input"
                    />
                  ) : (
                    <input
                      type="text"
                      value={values[field.label] ?? ''}
                      onChange={(e) => setValues((p) => ({ ...p, [field.label]: e.target.value }))}
                      className="input"
                    />
                  )}
                  {field.type !== 'toggle' && field.description && (
                    <p className="text-body-sm text-body-sm text-on-surface-variant mt-1">{field.description}</p>
                  )}
                </div>
              ))}
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Advanced" subtitle="Additional configuration options" />
            <CardBody className="space-y-4">
              {[
                { label: 'Enable notifications', desc: 'Send alerts when changes occur', on: true },
                { label: 'Require approval', desc: 'Changes need manager approval before taking effect', on: false },
                { label: 'Audit logging', desc: 'Log all configuration changes to audit trail', on: true },
                { label: 'Auto-sync to tenants', desc: 'Propagate settings to all tenant instances', on: false },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between py-2 border-b border-outline-variant/40 last:border-0">
                  <div>
                    <div className="text-body-md text-body-md text-on-surface">{item.label}</div>
                    <div className="text-body-sm text-body-sm text-on-surface-variant">{item.desc}</div>
                  </div>
                  <Toggle checked={item.on} onChange={() => {}} />
                </div>
              ))}
            </CardBody>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader title="Status" subtitle="Current configuration state" />
            <CardBody className="space-y-3">
              <div className="flex justify-between">
                <span className="text-body-sm text-body-sm text-on-surface-variant">Last Updated</span>
                <span className="text-body-sm text-body-sm text-on-surface">2 hours ago</span>
              </div>
              <div className="flex justify-between">
                <span className="text-body-sm text-body-sm text-on-surface-variant">Updated By</span>
                <span className="text-body-sm text-body-sm text-on-surface">Alex Drake</span>
              </div>
              <div className="flex justify-between">
                <span className="text-body-sm text-body-sm text-on-surface-variant">Version</span>
                <Badge tone="info">v2.4.1</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-body-sm text-body-sm text-on-surface-variant">Status</span>
                <Badge tone="success" dot>Active</Badge>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Linked Entities" subtitle="Spec relationships" />
            <CardBody className="space-y-2">
              {meta.links.map((link) => (
                <div key={link.label} className="flex items-center justify-between py-1.5">
                  <div>
                    <div className="text-body-sm text-body-sm text-on-surface">{link.label}</div>
                    <div className="text-label-sm text-label-sm text-on-surface-variant">{link.relation}</div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-on-surface-variant" />
                </div>
              ))}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}

/* ========================================================================
   REPORT PAGE — Charts, stats, data tables
   ======================================================================== */
export function ReportPage({ route }: { route: RouteMeta }) {
  const [range, setRange] = useState<'7d' | '30d' | '90d'>('30d');
  const meta = useMemo(() => getDomainMeta(route.domain), [route.domain]);
  const chart = useMemo(() => generateChartData(route.domain), [route.domain]);
  const stats = useMemo(() => generateStats(route.domain), [route.domain]);
  const tableData = useMemo(() => generateRows(route.domain, 8), [route.domain]);
  const columns = useMemo(() => getColumns(route.domain), [route.domain]);

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title={route.title}
        subtitle={route.subtitle ?? `${chart.label} trends and breakdowns`}
        icon={route.icon}
        breadcrumbs={route.breadcrumbs.map((b) => ({ label: b }))}
        actions={
          <>
            <SegmentedControl value={range} onChange={setRange} options={[
              { value: '7d', label: '7d' },
              { value: '30d', label: '30d' },
              { value: '90d', label: '90d' },
            ]} />
            <Button variant="secondary" icon={Download}>Export</Button>
          </>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <StatCard key={s.label} label={s.label} value={s.value} delta={s.delta} deltaDirection={s.deltaDir ?? 'up'} sparkline={Array.from({ length: 8 }, () => Math.random() * 100)} />
        ))}
      </div>

      {/* Main chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader title={`${chart.label} Trend`} subtitle={`Last ${range} — ${chart.unit ?? ''}`} icon={BarChart3} action={<Badge tone="success" dot>Live</Badge>} />
          <CardBody>
            <div className="flex items-baseline gap-2 mb-6">
              <span className="text-display-sm text-display-sm text-on-surface tabular-nums">
                {chart.unit === '$' ? '$' : ''}{chart.data[chart.data.length - 1].value.toLocaleString()}{chart.unit === '%' ? '%' : ''}
              </span>
              <span className="text-body-sm text-body-sm text-on-surface-variant">current period</span>
              <Badge tone="success">+14.2%</Badge>
            </div>
            <div className="flex items-end gap-2 h-48">
              {chart.data.map((d, i) => {
                const max = Math.max(...chart.data.map((x) => x.value));
                const h = (d.value / max) * 100;
                return (
                  <div key={i} className="flex-1 flex flex-col items-center justify-end group">
                    <span className="text-label-sm text-label-sm text-on-surface-variant mb-1 opacity-0 group-hover:opacity-100 transition-opacity tabular-nums">
                      {chart.unit === '$' ? '$' : ''}{d.value.toLocaleString()}{chart.unit === '%' ? '%' : ''}
                    </span>
                    <div
                      className="w-full rounded-t-md bg-secondary-container group-hover:bg-primary transition-colors"
                      style={{ height: `${Math.max(h, 2)}%` }}
                    />
                    <span className="text-label-sm text-label-sm text-on-surface-variant mt-2">{d.label}</span>
                  </div>
                );
              })}
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Breakdown" subtitle="By category — spec-defined" icon={Filter} />
          <CardBody className="space-y-3">
            {meta.breakdown.map((cat) => (
              <div key={cat.label}>
                <div className="flex justify-between mb-1">
                  <span className="text-body-sm text-body-sm text-on-surface">{cat.label}</span>
                  <span className="text-body-sm text-body-sm text-on-surface-variant tabular-nums">{cat.pct}%</span>
                </div>
                <ProgressBar value={cat.pct} />
              </div>
            ))}
          </CardBody>
        </Card>
      </div>

      {/* Secondary charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader title="Comparison" subtitle="Period over period" icon={TrendingUp} />
          <CardBody>
            <div className="space-y-3">
              {chart.data.slice(0, 7).map((d, i) => {
                const prev = d.value * (0.8 + Math.random() * 0.3);
                const change = ((d.value - prev) / prev) * 100;
                return (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-body-sm text-body-sm text-on-surface-variant w-8">{d.label}</span>
                    <div className="flex-1">
                      <ProgressBar value={Math.abs(change) * 10} tone={change >= 0 ? 'success' : 'error'} />
                    </div>
                    <span className={`text-body-sm text-body-sm tabular-nums w-16 text-right ${change >= 0 ? 'text-success' : 'text-error'}`}>
                      {change >= 0 ? '+' : ''}{change.toFixed(1)}%
                    </span>
                  </div>
                );
              })}
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Key Insights" subtitle="From spec data sources" icon={Activity} />
          <CardBody className="space-y-3">
            {meta.insights.map((insight) => (
              <div key={insight.label} className="flex items-center gap-3 py-1">
                {insight.dir === 'up' ? <TrendingUp className="w-4 h-4 text-success shrink-0" /> : insight.dir === 'down' ? <TrendingDown className="w-4 h-4 text-error shrink-0" /> : <Minus className="w-4 h-4 text-on-surface-variant shrink-0" />}
                <div className="flex-1">
                  <div className="text-body-sm text-body-sm text-on-surface">{insight.label}</div>
                  <div className="text-body-sm text-body-sm text-on-surface-variant">{insight.value}</div>
                </div>
              </div>
            ))}
          </CardBody>
        </Card>
      </div>

      {/* Data table */}
      <Card>
        <CardHeader title="Detailed Breakdown" subtitle="Underlying data" icon={BarChart3} />
        <CardBody className="pt-0">
          <Table>
            <THead>
              <TR>
                {columns.slice(0, 6).map((col) => <TH key={col.key}>{col.label}</TH>)}
              </TR>
            </THead>
            <tbody>
              {tableData.slice(0, 8).map((row, i) => (
                <TR key={i}>
                  {columns.slice(0, 6).map((col) => (
                    <TD key={col.key}>{renderCell(col, row[col.key])}</TD>
                  ))}
                </TR>
              ))}
            </tbody>
          </Table>
        </CardBody>
      </Card>
    </div>
  );
}

/* ========================================================================
   LIST EDITOR PAGE — Two-panel: list + editor
   ======================================================================== */
export function ListEditorPage({ route }: { route: RouteMeta }) {
  const items = useMemo(() => generateListItems(route.domain), [route.domain]);
  const [selectedId, setSelectedId] = useState<string | null>(items[0]?.id ?? null);
  const selectedItem = items.find((i) => i.id === selectedId);

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title={route.title}
        subtitle={route.subtitle}
        icon={route.icon}
        breadcrumbs={route.breadcrumbs.map((b) => ({ label: b }))}
        actions={<Button variant="primary" icon={Plus}>New Item</Button>}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* List panel */}
        <Card className="lg:col-span-1">
          <div className="px-3 pt-3 pb-2 border-b border-outline-variant">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
              <input placeholder="Search items…" className="input pl-9 h-9" />
            </div>
          </div>
          <div className="max-h-[600px] overflow-y-auto">
            {items.map((item) => (
              <button
                key={item.id}
                onClick={() => setSelectedId(item.id)}
                className={`w-full text-left px-4 py-3 border-b border-outline-variant/40 last:border-0 transition-colors ${
                  selectedId === item.id ? 'bg-secondary-container/30' : 'hover:bg-surface-container-low'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-body-md text-body-md text-on-surface truncate">{item.name}</span>
                  <Badge tone={statusTone(item.status)}>{item.status}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-body-sm text-body-sm text-on-surface-variant truncate">{item.category}</span>
                  <span className="text-label-sm text-label-sm text-on-surface-variant">{item.updated}</span>
                </div>
              </button>
            ))}
          </div>
        </Card>

        {/* Editor panel */}
        <Card className="lg:col-span-2">
          {selectedItem ? (
            <>
              <CardHeader
                title={selectedItem.name}
                subtitle={`Last updated ${selectedItem.updated}`}
                icon={route.icon}
                action={
                  <div className="flex gap-2">
                    <Button variant="secondary" size="sm">Preview</Button>
                    <Button variant="primary" size="sm">Save</Button>
                  </div>
                }
              />
              <CardBody className="space-y-5">
                <div>
                  <label className="text-label-md text-label-md text-on-surface-variant mb-1.5 block">Name</label>
                  <input defaultValue={selectedItem.name} className="input" />
                </div>
                <div>
                  <label className="text-label-md text-label-md text-on-surface-variant mb-1.5 block">Category</label>
                  <select className="input" defaultValue={selectedItem.category}>
                    {['General', 'Emergency', 'Sales', 'Support', 'Billing'].map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-label-md text-label-md text-on-surface-variant mb-1.5 block">Description / Content</label>
                  <textarea defaultValue={selectedItem.description} rows={8} className="input resize-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-label-md text-label-md text-on-surface-variant mb-1.5 block">Status</label>
                    <select className="input" defaultValue={selectedItem.status}>
                      <option value="active">Active</option>
                      <option value="draft">Draft</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-label-md text-label-md text-on-surface-variant mb-1.5 block">Tags</label>
                    <input placeholder="Add tags…" className="input" />
                  </div>
                </div>
                <div className="flex items-center gap-3 pt-2 border-t border-outline-variant/40">
                  <Toggle checked={true} onChange={() => {}} label="Published" />
                  <Toggle checked={false} onChange={() => {}} label="Featured" />
                </div>
              </CardBody>
            </>
          ) : (
            <EmptyState icon={route.icon} title="Select an item" description="Choose an item from the list to edit its contents." />
          )}
        </Card>
      </div>
    </div>
  );
}

/* ========================================================================
   DETAIL PAGE — Tabbed detail view
   ======================================================================== */
export function DetailPage({ route }: { route: RouteMeta }) {
  const meta = useMemo(() => getDomainMeta(route.domain), [route.domain]);
  const tabs = route.tabs ?? ['Overview', 'Details', 'History', 'Settings'];
  const [activeTab, setActiveTab] = useState(0);
  const columns = useMemo(() => getColumns(route.domain), [route.domain]);
  const rows = useMemo(() => generateRows(route.domain, 5), [route.domain]);

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title={route.title}
        subtitle={route.subtitle}
        icon={route.icon}
        breadcrumbs={route.breadcrumbs.map((b) => ({ label: b }))}
        actions={
          <>
            <Button variant="secondary">Edit</Button>
            <Button variant="primary">Save</Button>
          </>
        }
      />

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-outline-variant overflow-x-auto scrollbar-hide">
        {tabs.map((tab, i) => (
          <button
            key={tab}
            onClick={() => setActiveTab(i)}
            className={`px-4 py-2.5 text-body-md text-body-md whitespace-nowrap transition-colors border-b-2 -mb-px ${
              activeTab === i ? 'border-primary text-primary font-semibold' : 'border-transparent text-on-surface-variant hover:text-on-surface'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader title={tabs[activeTab]} subtitle={`Details for ${route.title}`} />
            <CardBody className="space-y-4">
              {columns.slice(0, 5).map((col) => (
                <div key={col.key} className="flex items-center justify-between py-2 border-b border-outline-variant/40 last:border-0">
                  <span className="text-body-sm text-body-sm text-on-surface-variant">{col.label}</span>
                  <span className="text-body-sm text-body-sm text-on-surface">{renderCell(col, rows[0]?.[col.key])}</span>
                </div>
              ))}
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Activity Timeline" subtitle="Recent events" />
            <CardBody className="space-y-3">
              {Array.from({ length: 6 }, (_, i) => ({
                time: `${range(1, 48)}h ago`,
                actor: makeNameFromSeed(i + 10),
                action: pick(['created this record', 'updated pricing', 'changed status to active', 'uploaded media', 'approved listing', 'assigned to team']),
              })).map((evt, i) => (
                <div key={i} className="flex items-center gap-3 py-2 border-b border-outline-variant/40 last:border-0">
                  <Avatar name={evt.actor} size="sm" />
                  <div className="flex-1">
                    <span className="text-body-sm text-body-sm text-on-surface">{evt.actor}</span>
                    <span className="text-body-sm text-body-sm text-on-surface-variant"> {evt.action}</span>
                  </div>
                  <span className="text-label-sm text-label-sm text-on-surface-variant">{evt.time}</span>
                </div>
              ))}
            </CardBody>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader title="Quick Stats" />
            <CardBody className="space-y-3">
              {generateStats(route.domain).slice(0, 3).map((s) => (
                <div key={s.label}>
                  <div className="text-body-sm text-body-sm text-on-surface-variant">{s.label}</div>
                  <div className="text-headline-md text-headline-md text-on-surface tabular-nums">{s.value}</div>
                </div>
              ))}
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Linked Entities" subtitle="From spec relationships" />
            <CardBody className="space-y-2">
              {meta.links.map((link) => (
                <div key={link.label} className="flex items-center justify-between py-2 border-b border-outline-variant/40 last:border-0">
                  <div>
                    <div className="text-body-sm text-body-sm text-on-surface">{link.label}</div>
                    <div className="text-label-sm text-label-sm text-on-surface-variant">{link.relation}</div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-on-surface-variant" />
                </div>
              ))}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}

function makeNameFromSeed(s: number) {
  const r = mulberry32(s)();
  const firstNames = ['James', 'Maria', 'Wei', 'Priya', 'Carlos', 'Amara', 'Lars', 'Yuki', 'Sofia', 'Daniel'];
  const lastNames = ['Chen', 'Patel', 'Silva', 'Rossi', 'Kim', 'Mendoza', 'Schmidt', 'Tanaka', 'Ahmed', 'Walsh'];
  return `${firstNames[Math.floor(r * firstNames.length)]} ${lastNames[Math.floor(mulberry32(s + 1)() * lastNames.length)]}`;
}
