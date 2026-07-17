import { useState } from 'react';
import {
  Workflow, Phone, MessageSquareText, Route, Search, Voicemail, PhoneOff,
  Plus, Play, Save, Settings2, ChevronRight, Bot, GitBranch, Clock, Zap,
} from 'lucide-react';
import { Card, CardHeader, CardBody, Badge, Button, PageHeader, Toggle } from '../components/ui';
import { ivrNodes, type IVRNode } from '../data/mock';

const nodeConfig: Record<IVRNode['type'], { icon: typeof Phone; color: string; bg: string; label: string }> = {
  greeting: { icon: MessageSquareText, color: 'text-primary', bg: 'bg-secondary-container/40', label: 'Greeting' },
  menu: { icon: GitBranch, color: 'text-on-tertiary-fixed', bg: 'bg-tertiary-fixed/40', label: 'Menu' },
  route: { icon: Route, color: 'text-success', bg: 'bg-success-container/50', label: 'Route' },
  lookup: { icon: Search, color: 'text-warning', bg: 'bg-warning-container/50', label: 'Lookup' },
  voicemail: { icon: Voicemail, color: 'text-on-secondary-fixed', bg: 'bg-secondary-container/30', label: 'Voicemail' },
  hangup: { icon: PhoneOff, color: 'text-error', bg: 'bg-error-container/40', label: 'Hang Up' },
};

export function AutomationBuilderPage() {
  const [selected, setSelected] = useState<string | null>('n2');
  const [aiRouting, setAiRouting] = useState(true);
  const [autoAssign, setAutoAssign] = useState(true);

  const selectedNode = ivrNodes.find((n) => n.id === selected);

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Automation Builder"
        subtitle="IVR flow editor — visually design call routing, menus, and escalation rules"
        icon={Workflow}
        breadcrumbs={[{ label: 'Reservation Services' }, { label: 'Automation' }, { label: 'IVR Builder' }]}
        actions={
          <>
            <Button variant="secondary" icon={Play}>Test Flow</Button>
            <Button variant="primary" icon={Save}>Publish</Button>
          </>
        }
      />

      {/* Automation toggles */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-secondary-container/40 flex items-center justify-center shrink-0">
            <Bot className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1">
            <div className="font-title-md text-title-md text-on-surface">AI Routing</div>
            <div className="font-body-sm text-body-sm text-on-surface-variant">Smart queue assignment</div>
          </div>
          <Toggle checked={aiRouting} onChange={setAiRouting} />
        </Card>
        <Card className="p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-secondary-container/40 flex items-center justify-center shrink-0">
            <Zap className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1">
            <div className="font-title-md text-title-md text-on-surface">Auto Assignment</div>
            <div className="font-body-sm text-body-sm text-on-surface-variant">Round-robin to agents</div>
          </div>
          <Toggle checked={autoAssign} onChange={setAutoAssign} />
        </Card>
        <Card className="p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-secondary-container/40 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1">
            <div className="font-title-md text-title-md text-on-surface">SLA Rules</div>
            <div className="font-body-sm text-body-sm text-on-surface-variant">Active · 30s target</div>
          </div>
          <Badge tone="success" dot>On</Badge>
        </Card>
      </div>

      {/* Flow canvas + side panel */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Canvas */}
        <Card className="lg:col-span-3 overflow-hidden">
          <CardHeader
            title="IVR Flow — Main Line"
            subtitle="Drag nodes to rearrange · Click to edit"
            icon={Phone}
            action={<Button variant="ghost" size="sm" icon={Plus}>Add Node</Button>}
          />
          <CardBody className="pt-0">
            <div className="relative bg-surface-container-low rounded-xl border border-outline-variant overflow-x-auto" style={{ minHeight: '520px' }}>
              {/* Grid background */}
              <div
                className="absolute inset-0 opacity-30"
                style={{
                  backgroundImage: 'radial-gradient(circle, #757685 1px, transparent 1px)',
                  backgroundSize: '20px 20px',
                }}
              />

              {/* SVG connections */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ minHeight: '520px' }}>
                {ivrNodes.map((node) => {
                  if (!node.options) return null;
                  return node.options.map((opt, i) => {
                    const target = ivrNodes.find((n) => n.id === opt.target);
                    if (!target) return null;
                    const x1 = node.position.x + 160;
                    const y1 = node.position.y + 50;
                    const x2 = target.position.x + 80;
                    const y2 = target.position.y;
                    const midY = (y1 + y2) / 2;
                    return (
                      <g key={`${node.id}-${opt.target}-${i}`}>
                        <path
                          d={`M ${x1} ${y1} C ${x1 + 40} ${midY}, ${x2 - 40} ${midY}, ${x2} ${y2}`}
                          fill="none"
                          stroke="#757685"
                          strokeWidth="1.5"
                          strokeDasharray="4 4"
                        />
                        <rect x={(x1 + x2) / 2 - 8} y={midY - 9} width="16" height="18" rx="4" fill="#051da1" />
                        <text x={(x1 + x2) / 2} y={midY + 4} textAnchor="middle" fill="white" fontSize="10" fontWeight="600">
                          {opt.key}
                        </text>
                      </g>
                    );
                  });
                })}
              </svg>

              {/* Nodes */}
              <div className="relative" style={{ minHeight: '520px', width: '700px', margin: '0 auto', padding: '40px' }}>
                {ivrNodes.map((node) => {
                  const cfg = nodeConfig[node.type];
                  const Icon = cfg.icon;
                  const isSelected = selected === node.id;
                  return (
                    <div
                      key={node.id}
                      onClick={() => setSelected(node.id)}
                      className={`absolute w-48 cursor-pointer transition-all ${
                        isSelected ? 'scale-105' : 'hover:scale-[1.02]'
                      }`}
                      style={{
                        left: `${node.position.x + 100}px`,
                        top: `${node.position.y + 20}px`,
                      }}
                    >
                      <div className={`rounded-xl border-2 shadow-sm transition-all ${
                        isSelected ? 'border-primary shadow-card-hover' : 'border-outline-variant bg-surface-container-lowest'
                      }`}>
                        {/* Node header */}
                        <div className={`flex items-center gap-2 px-3 py-2.5 rounded-t-[10px] ${cfg.bg}`}>
                          <Icon className={`w-4 h-4 ${cfg.color}`} />
                          <span className="text-label-md text-label-md text-on-surface font-semibold flex-1">{node.label}</span>
                          <span className="text-label-sm text-label-sm text-on-surface-variant">{cfg.label}</span>
                        </div>
                        {/* Node body */}
                        <div className="px-3 py-2.5 bg-surface-container-lowest rounded-b-[10px]">
                          <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2 leading-snug">
                            "{node.prompt}"
                          </p>
                          {node.options && (
                            <div className="flex flex-wrap gap-1 mt-2 pt-2 border-t border-outline-variant/50">
                              {node.options.map((o) => (
                                <span key={o.key} className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-surface-container-high text-label-sm text-label-sm text-on-surface-variant">
                                  {o.key} <ChevronRight className="w-2.5 h-2.5" />
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        {/* Connection port */}
                        <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-primary border-2 border-surface" />
                        {node.type !== 'greeting' && (
                          <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-surface-container-highest border-2 border-outline" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Side panel — node inspector + palette */}
        <div className="space-y-4">
          {/* Node palette */}
          <Card>
            <CardHeader title="Node Palette" subtitle="Click to add to flow" icon={Plus} />
            <CardBody className="space-y-2">
              {(Object.keys(nodeConfig) as IVRNode['type'][]).map((type) => {
                const cfg = nodeConfig[type];
                const Icon = cfg.icon;
                return (
                  <button
                    key={type}
                    className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-surface-container-low transition-colors text-left"
                  >
                    <div className={`w-8 h-8 rounded-lg ${cfg.bg} flex items-center justify-center shrink-0`}>
                      <Icon className={`w-4 h-4 ${cfg.color}`} />
                    </div>
                    <span className="font-body-sm text-body-sm text-on-surface">{cfg.label}</span>
                    <Plus className="w-3.5 h-3.5 text-on-surface-variant ml-auto" />
                  </button>
                );
              })}
            </CardBody>
          </Card>

          {/* Node inspector */}
          {selectedNode && (
            <Card>
              <CardHeader title="Node Properties" subtitle={selectedNode.label} icon={Settings2} />
              <CardBody className="space-y-4">
                <div>
                  <label className="text-label-md text-label-md text-on-surface-variant mb-1.5 block">Label</label>
                  <input defaultValue={selectedNode.label} className="input" />
                </div>
                <div>
                  <label className="text-label-md text-label-md text-on-surface-variant mb-1.5 block">Voice Prompt</label>
                  <textarea
                    defaultValue={selectedNode.prompt}
                    rows={3}
                    className="input resize-none"
                  />
                </div>
                {selectedNode.options && (
                  <div>
                    <label className="text-label-md text-label-md text-on-surface-variant mb-1.5 block">Menu Options</label>
                    <div className="space-y-1.5">
                      {selectedNode.options.map((o) => {
                        const target = ivrNodes.find((n) => n.id === o.target);
                        return (
                          <div key={o.key} className="flex items-center gap-2 p-2 rounded-lg bg-surface-container-low">
                            <span className="w-6 h-6 rounded bg-primary text-on-primary text-label-sm text-label-sm flex items-center justify-center font-bold">{o.key}</span>
                            <ChevronRight className="w-3 h-3 text-on-surface-variant" />
                            <span className="font-body-sm text-body-sm text-on-surface flex-1 truncate">{target?.label ?? o.target}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
                <div className="flex gap-2 pt-2">
                  <Button variant="secondary" size="sm" className="flex-1">Cancel</Button>
                  <Button variant="primary" size="sm" className="flex-1">Apply</Button>
                </div>
              </CardBody>
            </Card>
          )}
        </div>
      </div>

      {/* Related rules */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'Routing Rules', desc: '8 active rules', icon: Route, path: '/settings/reservations/automation/routing' },
          { title: 'Escalation Rules', desc: '3 tiers configured', icon: Workflow, path: '/settings/reservations/automation/escalation' },
          { title: 'SLA Rules', desc: '30s / 2m / 4m targets', icon: Clock, path: '/settings/reservations/automation/sla' },
          { title: 'Follow-up Rules', desc: '5 automations', icon: MessageSquareText, path: '/settings/reservations/automation/followup' },
        ].map((r) => {
          const Icon = r.icon;
          return (
            <Card key={r.title} hover className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-secondary-container/40 flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-title-md text-title-md text-on-surface truncate">{r.title}</div>
                <div className="font-body-sm text-body-sm text-on-surface-variant truncate">{r.desc}</div>
              </div>
              <ChevronRight className="w-4 h-4 text-on-surface-variant" />
            </Card>
          );
        })}
      </div>
    </div>
  );
}
