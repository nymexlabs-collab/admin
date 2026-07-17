import { useState } from 'react';
import { Headphones, Plus, Search, MoreVertical, Mail, Phone, Star, Award, Globe, Calendar } from 'lucide-react';
import { Card, CardBody, Badge, Avatar, Button, StatCard, Table, THead, TH, TR, TD, SegmentedControl, ProgressBar, PageHeader } from '../components/ui';
import { agents } from '../data/mock';

const statusConfig = {
  online: { tone: 'success' as const, label: 'Online' },
  'on-call': { tone: 'primary' as const, label: 'On Call' },
  break: { tone: 'warning' as const, label: 'On Break' },
  offline: { tone: 'neutral' as const, label: 'Offline' },
};

export function AgentManagementPage() {
  const [view, setView] = useState<'table' | 'cards'>('table');
  const [team, setTeam] = useState<'all' | 'Reservations A' | 'Reservations B' | 'Property Support' | 'VIP Concierge' | 'Escalations'>('all');
  const [search, setSearch] = useState('');

  const filtered = agents.filter((a) => {
    if (team !== 'all' && a.team !== team) return false;
    if (search && !a.name.toLowerCase().includes(search.toLowerCase()) && !a.email.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Agent Management"
        subtitle="Manage agents, teams, skills, and shift scheduling"
        icon={Headphones}
        breadcrumbs={[{ label: 'Reservation Services' }, { label: 'Agent Management' }]}
        actions={
          <>
            <Button variant="secondary" icon={Calendar}>Schedule</Button>
            <Button variant="primary" icon={Plus}>Add Agent</Button>
          </>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Agents" value={agents.length} icon={Headphones} />
        <StatCard label="On Shift" value={agents.filter(a => a.status !== 'offline').length} icon={Headphones} delta="16 active" deltaDirection="up" />
        <StatCard label="Avg CSAT" value="91.8%" icon={Star} delta="+2.3%" deltaDirection="up" />
        <StatCard label="Teams" value={5} icon={Award} />
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search agents…"
            className="input pl-9 h-9"
          />
        </div>
        <SegmentedControl
          value={team}
          onChange={setTeam}
          options={[
            { value: 'all', label: 'All' },
            { value: 'Reservations A', label: 'Res A' },
            { value: 'Reservations B', label: 'Res B' },
            { value: 'Property Support', label: 'Support' },
            { value: 'VIP Concierge', label: 'VIP' },
            { value: 'Escalations', label: 'Escalation' },
          ]}
        />
        <div className="flex-1" />
        <SegmentedControl
          value={view}
          onChange={setView}
          options={[
            { value: 'table', label: 'Table' },
            { value: 'cards', label: 'Cards' },
          ]}
        />
      </div>

      {/* Table view */}
      {view === 'table' && (
        <Card>
          <Table>
            <THead>
              <TR>
                <TH>Agent</TH>
                <TH>Team</TH>
                <TH>Status</TH>
                <TH>Calls Today</TH>
                <TH>Avg Handle</TH>
                <TH>CSAT</TH>
                <TH>Utilization</TH>
                <TH>Languages</TH>
                <TH></TH>
              </TR>
            </THead>
            <tbody>
              {filtered.map((a) => (
                <TR key={a.id}>
                  <TD>
                    <div className="flex items-center gap-3">
                      <Avatar name={a.name} size="sm" />
                      <div>
                        <div className="font-body-md text-body-md text-on-surface">{a.name}</div>
                        <div className="font-body-sm text-body-sm text-on-surface-variant">{a.id}</div>
                      </div>
                    </div>
                  </TD>
                  <TD><span className="font-body-sm text-body-sm text-on-surface">{a.team}</span></TD>
                  <TD><Badge tone={statusConfig[a.status].tone} dot>{statusConfig[a.status].label}</Badge></TD>
                  <TD><span className="font-body-md text-body-md text-on-surface tabular-nums">{a.callsToday}</span></TD>
                  <TD><span className="font-body-sm text-body-sm text-on-surface-variant tabular-nums">{a.avgHandle}</span></TD>
                  <TD>
                    <span className="inline-flex items-center gap-1 font-body-md text-body-md text-on-surface tabular-nums">
                      <Star className="w-3.5 h-3.5 text-warning fill-warning" />
                      {a.csat}%
                    </span>
                  </TD>
                  <TD>
                    <div className="flex items-center gap-2 w-28">
                      <ProgressBar value={a.utilization} tone={a.utilization > 85 ? 'warning' : 'primary'} />
                      <span className="text-label-sm text-label-sm text-on-surface-variant tabular-nums w-9">{a.utilization}%</span>
                    </div>
                  </TD>
                  <TD>
                    <div className="flex gap-1">
                      {a.languages.map((l) => (
                        <span key={l} className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-surface-container-high text-label-sm text-label-sm text-on-surface-variant">
                          <Globe className="w-3 h-3" />{l.slice(0, 2)}
                        </span>
                      ))}
                    </div>
                  </TD>
                  <TD>
                    <Button variant="ghost" size="icon"><MoreVertical className="w-4 h-4" /></Button>
                  </TD>
                </TR>
              ))}
            </tbody>
          </Table>
        </Card>
      )}

      {/* Cards view */}
      {view === 'cards' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((a) => (
            <Card key={a.id} hover>
              <CardBody>
                <div className="flex items-start gap-3 mb-4">
                  <Avatar name={a.name} size="lg" />
                  <div className="flex-1 min-w-0">
                    <div className="font-title-md text-title-md text-on-surface truncate">{a.name}</div>
                    <div className="font-body-sm text-body-sm text-on-surface-variant truncate">{a.team}</div>
                    <Badge tone={statusConfig[a.status].tone} dot className="mt-1">{statusConfig[a.status].label}</Badge>
                  </div>
                  <Button variant="ghost" size="icon"><MoreVertical className="w-4 h-4" /></Button>
                </div>
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="text-center p-2 rounded-lg bg-surface-container-low">
                    <div className="text-label-sm text-label-sm text-on-surface-variant">Calls</div>
                    <div className="font-title-md text-title-md text-on-surface tabular-nums">{a.callsToday}</div>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-surface-container-low">
                    <div className="text-label-sm text-label-sm text-on-surface-variant">Handle</div>
                    <div className="font-title-md text-title-md text-on-surface tabular-nums">{a.avgHandle}</div>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-surface-container-low">
                    <div className="text-label-sm text-label-sm text-on-surface-variant">CSAT</div>
                    <div className="font-title-md text-title-md text-on-surface tabular-nums">{a.csat}%</div>
                  </div>
                </div>
                <div className="mb-3">
                  <div className="flex justify-between mb-1">
                    <span className="text-label-sm text-label-sm text-on-surface-variant">Utilization</span>
                    <span className="text-label-sm text-label-sm text-on-surface tabular-nums">{a.utilization}%</span>
                  </div>
                  <ProgressBar value={a.utilization} tone={a.utilization > 85 ? 'warning' : 'primary'} />
                </div>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {a.skills.map((s) => (
                    <Badge key={s} tone="neutral">{s}</Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Button variant="secondary" size="sm" icon={Mail} className="flex-1">Email</Button>
                  <Button variant="secondary" size="sm" icon={Phone} className="flex-1">Call</Button>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
