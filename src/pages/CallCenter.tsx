import { useState } from 'react';
import {
  Phone, PhoneCall, PhoneMissed,
  Headphones, Clock, TrendingUp, Volume2, Mic, MicOff,
  Pause, Play, Hand, Eye, MessageSquare, Users,
} from 'lucide-react';
import { Card, CardHeader, CardBody, Badge, Avatar, Button, StatCard, ProgressBar, SegmentedControl } from '../components/ui';
import { liveCalls, callQueue, agents } from '../data/mock';

const statusConfig = {
  active: { tone: 'success' as const, label: 'Active', dot: true },
  hold: { tone: 'warning' as const, label: 'On Hold', dot: true },
  waiting: { tone: 'error' as const, label: 'Waiting', dot: true },
};

export function CallCenterPage() {
  const [tab, setTab] = useState<'live' | 'queue' | 'missed' | 'voicemail'>('live');
  const [selectedCall, setSelectedCall] = useState<string | null>(liveCalls[2]?.id ?? null);
  const [muted, setMuted] = useState(false);

  const onlineAgents = agents.filter((a) => a.status === 'online' || a.status === 'on-call').length;
  const activeCall = liveCalls.find((c) => c.id === selectedCall);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface">Call Center</h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-0.5">Real-time call operations, queue monitoring, and agent dashboard</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge tone="success" dot>Live · {onlineAgents} agents online</Badge>
        </div>
      </div>

      {/* Top stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Active Calls" value={liveCalls.filter(c => c.status === 'active').length} icon={PhoneCall} delta="+3 vs avg" deltaDirection="up" />
        <StatCard label="In Queue" value={callQueue.length} icon={Clock} delta="2m avg wait" deltaDirection="up" />
        <StatCard label="Agents Online" value={onlineAgents} icon={Headphones} delta="of 24" deltaDirection="up" />
        <StatCard label="SLA Today" value="94.2%" icon={TrendingUp} delta="-1.1%" deltaDirection="down" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Left: Calls list + queue */}
        <div className="xl:col-span-2 space-y-4">
          <Card>
            <div className="px-3 pt-3">
              <SegmentedControl
                value={tab}
                onChange={setTab}
                options={[
                  { value: 'live', label: 'Live Calls', icon: PhoneCall },
                  { value: 'queue', label: 'Queue', icon: Clock },
                  { value: 'missed', label: 'Missed', icon: PhoneMissed },
                  { value: 'voicemail', label: 'Voicemail', icon: MessageSquare },
                ]}
              />
            </div>
            <CardBody className="pt-3">
              {tab === 'live' && (
                <div className="space-y-1">
                  {liveCalls.map((call) => {
                    const cfg = statusConfig[call.status];
                    const isSelected = selectedCall === call.id;
                    return (
                      <div
                        key={call.id}
                        onClick={() => setSelectedCall(call.id)}
                        className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                          isSelected ? 'bg-secondary-container/30 ring-1 ring-primary/20' : 'hover:bg-surface-container-low'
                        }`}
                      >
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                          call.status === 'active' ? 'bg-success-container' : call.status === 'hold' ? 'bg-warning-container' : 'bg-error-container'
                        }`}>
                          <PhoneCall className={`w-4 h-4 ${call.status === 'active' ? 'text-success' : call.status === 'hold' ? 'text-warning' : 'text-error'}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-body-md text-body-md text-on-surface truncate">{call.caller}</span>
                            <Badge tone={cfg.tone} dot>{cfg.label}</Badge>
                          </div>
                          <span className="font-body-sm text-body-sm text-on-surface-variant">{call.reason} · {call.queue}</span>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-label-md text-label-md text-on-surface tabular-nums">{call.duration}</div>
                          <div className="text-label-sm text-label-sm text-on-surface-variant">{call.agent}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {tab === 'queue' && (
                <div className="space-y-1">
                  {callQueue.map((q) => (
                    <div key={q.position} className="flex items-center gap-3 p-3 rounded-lg hover:bg-surface-container-low transition-colors">
                      <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center shrink-0">
                        <span className="text-label-md text-label-md text-on-surface-variant tabular-nums">{q.position}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="font-body-md text-body-md text-on-surface">{q.caller}</span>
                        <span className="font-body-sm text-body-sm text-on-surface-variant block">{q.reason}</span>
                      </div>
                      {q.priority === 'high' && <Badge tone="error">Priority</Badge>}
                      <div className="text-right shrink-0">
                        <div className="text-label-md text-label-md text-on-surface tabular-nums">{q.waitTime}</div>
                        <div className="text-label-sm text-label-sm text-on-surface-variant">waiting</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {tab === 'missed' && (
                <div className="space-y-1">
                  {[1,2,3].map((i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-lg hover:bg-surface-container-low transition-colors">
                      <div className="w-9 h-9 rounded-full bg-error-container/60 flex items-center justify-center shrink-0">
                        <PhoneMissed className="w-4 h-4 text-error" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="font-body-md text-body-md text-on-surface">Missed call · +1 ({200+i}) 555-0{100+i}</span>
                        <span className="font-body-sm text-body-sm text-on-surface-variant block">{i*7}m ago · Not yet returned</span>
                      </div>
                      <Button variant="secondary" size="sm" icon={Phone}>Return</Button>
                    </div>
                  ))}
                </div>
              )}

              {tab === 'voicemail' && (
                <div className="space-y-1">
                  {[1,2].map((i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-lg hover:bg-surface-container-low transition-colors">
                      <div className="w-9 h-9 rounded-full bg-tertiary-fixed/60 flex items-center justify-center shrink-0">
                        <MessageSquare className="w-4 h-4 text-on-tertiary-fixed" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="font-body-md text-body-md text-on-surface">Voicemail from {['James Chen','Maria Silva'][i-1]}</span>
                        <span className="font-body-sm text-body-sm text-on-surface-variant block">{i}:0{2+i} duration · {i*12}m ago</span>
                      </div>
                      <Button variant="ghost" size="sm" icon={Play}>Play</Button>
                    </div>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>

          {/* Agent performance summary */}
          <Card>
            <CardHeader title="Agent Dashboard" subtitle="Current shift performance" icon={Users} />
            <CardBody>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                <div>
                  <div className="text-label-md text-label-md text-on-surface-variant">Total Calls</div>
                  <div className="font-headline-md text-headline-md text-on-surface tabular-nums">428</div>
                </div>
                <div>
                  <div className="text-label-md text-label-md text-on-surface-variant">Avg Handle</div>
                  <div className="font-headline-md text-headline-md text-on-surface tabular-nums">4:32</div>
                </div>
                <div>
                  <div className="text-label-md text-label-md text-on-surface-variant">CSAT</div>
                  <div className="font-headline-md text-headline-md text-on-surface tabular-nums">92.4%</div>
                </div>
                <div>
                  <div className="text-label-md text-label-md text-on-surface-variant">Abandon</div>
                  <div className="font-headline-md text-headline-md text-on-surface tabular-nums">2.1%</div>
                </div>
              </div>
              <div className="space-y-2">
                {agents.slice(0, 5).map((a) => (
                  <div key={a.id} className="flex items-center gap-3">
                    <Avatar name={a.name} size="sm" />
                    <span className="font-body-sm text-body-sm text-on-surface flex-1 truncate">{a.name}</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant w-16 text-right tabular-nums">{a.callsToday} calls</span>
                    <div className="w-24">
                      <ProgressBar value={a.utilization} tone={a.utilization > 85 ? 'warning' : 'primary'} />
                    </div>
                    <span className="text-label-sm text-label-sm text-on-surface-variant w-10 text-right tabular-nums">{a.utilization}%</span>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Right: Active call panel */}
        <div className="space-y-4">
          <Card className="sticky top-20">
            <CardHeader title="Active Call" subtitle={activeCall?.id ?? 'No call selected'} icon={Phone} />
            <CardBody>
              {activeCall ? (
                <>
                  <div className="flex flex-col items-center py-4">
                    <Avatar name={activeCall.caller} size="lg" className="w-16 h-16 text-base mb-3" />
                    <span className="font-title-md text-title-md text-on-surface">{activeCall.caller}</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">{activeCall.phone}</span>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge tone={statusConfig[activeCall.status].tone} dot>{statusConfig[activeCall.status].label}</Badge>
                      <span className="text-label-md text-label-md text-on-surface-variant tabular-nums">{activeCall.duration}</span>
                    </div>
                  </div>

                  <div className="bg-surface-container-low rounded-lg p-3 space-y-2 mb-4">
                    <div className="flex justify-between">
                      <span className="font-body-sm text-body-sm text-on-surface-variant">Reason</span>
                      <span className="font-body-sm text-body-sm text-on-surface">{activeCall.reason}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-body-sm text-body-sm text-on-surface-variant">Queue</span>
                      <span className="font-body-sm text-body-sm text-on-surface">{activeCall.queue}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-body-sm text-body-sm text-on-surface-variant">Agent</span>
                      <span className="font-body-sm text-body-sm text-on-surface">{activeCall.agent}</span>
                    </div>
                  </div>

                  {/* Call controls */}
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => setMuted(!muted)}
                      className={`w-11 h-11 rounded-full flex items-center justify-center transition-colors ${
                        muted ? 'bg-error text-on-error' : 'bg-surface-container-high text-on-surface hover:bg-surface-container-highest'
                      }`}
                    >
                      {muted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                    </button>
                    <button className="w-11 h-11 rounded-full bg-surface-container-high text-on-surface flex items-center justify-center hover:bg-surface-container-highest transition-colors">
                      <Pause className="w-5 h-5" />
                    </button>
                    <button className="w-11 h-11 rounded-full bg-surface-container-high text-on-surface flex items-center justify-center hover:bg-surface-container-highest transition-colors">
                      <Volume2 className="w-5 h-5" />
                    </button>
                    <button className="w-11 h-11 rounded-full bg-surface-container-high text-on-surface flex items-center justify-center hover:bg-surface-container-highest transition-colors">
                      <Hand className="w-5 h-5" />
                    </button>
                    <button className="w-11 h-11 rounded-full bg-success text-on-success flex items-center justify-center hover:brightness-110 transition-all">
                      <Phone className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-4">
                    <Button variant="secondary" size="sm" icon={Eye}>Whisper</Button>
                    <Button variant="secondary" size="sm" icon={Hand}>Barge</Button>
                  </div>
                </>
              ) : (
                <div className="py-8 text-center">
                  <PhoneCall className="w-8 h-8 text-on-surface-variant mx-auto mb-2" />
                  <p className="font-body-sm text-body-sm text-on-surface-variant">Select a call to view details</p>
                </div>
              )}
            </CardBody>
          </Card>

          {/* Live call volume */}
          <Card>
            <CardHeader title="Call Volume" subtitle="Last 60 minutes" icon={TrendingUp} />
            <CardBody>
              <div className="flex items-baseline gap-2 mb-3">
                <span className="font-headline-md text-headline-md text-on-surface tabular-nums">47</span>
                <span className="font-body-sm text-body-sm text-on-surface-variant">calls/hr</span>
                <Badge tone="success">+12%</Badge>
              </div>
              <div className="flex items-end gap-1 h-20">
                {[30,42,38,55,48,62,58,71,64,80,72,68].map((v, i) => (
                  <div key={i} className="flex-1 bg-secondary-container rounded-t-sm transition-all hover:bg-primary" style={{ height: `${v}%` }} />
                ))}
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
