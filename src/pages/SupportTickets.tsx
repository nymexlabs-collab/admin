import { useState } from 'react';
import { LifeBuoy, Plus, Search, Mail, MessageSquare, Phone, Globe, Clock } from 'lucide-react';
import { Card, CardBody, Badge, Button, StatCard, PageHeader, Avatar, SegmentedControl } from '../components/ui';
import { supportTickets } from '../data/mock';

const priorityConfig = {
  low: { tone: 'neutral' as const, label: 'Low' },
  medium: { tone: 'info' as const, label: 'Medium' },
  high: { tone: 'warning' as const, label: 'High' },
  urgent: { tone: 'error' as const, label: 'Urgent' },
};

const statusConfig = {
  open: { tone: 'info' as const, label: 'Open' },
  pending: { tone: 'warning' as const, label: 'Pending' },
  resolved: { tone: 'success' as const, label: 'Resolved' },
  escalated: { tone: 'error' as const, label: 'Escalated' },
};

const channelIcons = { email: Mail, chat: MessageSquare, phone: Phone, web: Globe };

export function SupportTicketsPage() {
  const [view, setView] = useState<'board' | 'list'>('board');
  const [search, setSearch] = useState('');

  const filtered = supportTickets.filter((t) =>
    !search || t.subject.toLowerCase().includes(search.toLowerCase()) || t.requester.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    { id: 'open', label: 'Open' },
    { id: 'pending', label: 'Pending' },
    { id: 'escalated', label: 'Escalated' },
    { id: 'resolved', label: 'Resolved' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Support Tickets"
        subtitle="Customer support requests across all channels"
        icon={LifeBuoy}
        breadcrumbs={[{ label: 'Platform Governance' }, { label: 'Support' }, { label: 'Tickets' }]}
        actions={<Button variant="primary" icon={Plus}>New Ticket</Button>}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Open Tickets" value={supportTickets.filter(t => t.status === 'open').length} icon={LifeBuoy} />
        <StatCard label="Escalated" value={supportTickets.filter(t => t.status === 'escalated').length} icon={LifeBuoy} delta="Needs attention" deltaDirection="down" />
        <StatCard label="Avg Resolution" value="4.2h" icon={Clock} delta="-18m" deltaDirection="up" />
        <StatCard label="CSAT" value="91%" icon={LifeBuoy} delta="+2.1%" deltaDirection="up" />
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search tickets…" className="input pl-9 h-9" />
        </div>
        <div className="flex-1" />
        <SegmentedControl value={view} onChange={setView} options={[{ value: 'board', label: 'Board' }, { value: 'list', label: 'List' }]} />
      </div>

      {view === 'board' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {columns.map((col) => {
            const colTickets = filtered.filter((t) => t.status === col.id);
            return (
              <div key={col.id} className="space-y-3">
                <div className="flex items-center justify-between px-1">
                  <span className="font-title-md text-title-md text-on-surface">{col.label}</span>
                  <Badge tone="neutral">{colTickets.length}</Badge>
                </div>
                {colTickets.map((t) => {
                  const ChannelIcon = channelIcons[t.channel];
                  return (
                    <Card key={t.id} hover className="p-3.5">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <Badge tone={priorityConfig[t.priority].tone}>{priorityConfig[t.priority].label}</Badge>
                        <span className="text-label-sm text-label-sm text-on-surface-variant">{t.updated}</span>
                      </div>
                      <p className="font-body-sm text-body-sm text-on-surface mb-3 line-clamp-2">{t.subject}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 min-w-0">
                          <Avatar name={t.requester} size="sm" />
                          <span className="font-body-sm text-body-sm text-on-surface-variant truncate">{t.requester}</span>
                        </div>
                        <ChannelIcon className="w-3.5 h-3.5 text-on-surface-variant shrink-0" />
                      </div>
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-outline-variant/40">
                        <code className="text-label-sm text-label-sm text-on-surface-variant">{t.id}</code>
                        <span className="text-label-sm text-label-sm text-on-surface-variant">{t.assignee}</span>
                      </div>
                    </Card>
                  );
                })}
                {colTickets.length === 0 && (
                  <div className="text-center py-8 font-body-sm text-body-sm text-on-surface-variant">No tickets</div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {view === 'list' && (
        <Card>
          <CardBody className="space-y-2">
            {filtered.map((t) => {
              const ChannelIcon = channelIcons[t.channel];
              return (
                <div key={t.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-surface-container-low transition-colors">
                  <Avatar name={t.requester} size="sm" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-body-md text-body-md text-on-surface truncate">{t.subject}</span>
                      <Badge tone={priorityConfig[t.priority].tone}>{priorityConfig[t.priority].label}</Badge>
                    </div>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">{t.requester} · {t.id}</span>
                  </div>
                  <ChannelIcon className="w-4 h-4 text-on-surface-variant" />
                  <Badge tone={statusConfig[t.status].tone} dot>{statusConfig[t.status].label}</Badge>
                  <span className="text-label-sm text-label-sm text-on-surface-variant w-16 text-right shrink-0">{t.updated}</span>
                </div>
              );
            })}
          </CardBody>
        </Card>
      )}
    </div>
  );
}
