import { useState, useEffect, useMemo, type ReactNode } from 'react';
import {
  Search, Bell, Plus, Command, ChevronDown, ChevronRight, Menu, X,
  Settings, ShieldCheck, AlertTriangle,
} from 'lucide-react';
import { navigation, allRoutes, type NavSection, type NavSubGroup, type NavItem } from '../navigation';

/* ---------------- Nav Item (leaf) ---------------- */
function NavLeaf({ item, activePath, onNavigate }: { item: NavItem; activePath: string; onNavigate: (p: string) => void }) {
  const Icon = item.icon;
  const active = activePath === item.path;
  return (
    <button
      onClick={() => onNavigate(item.path)}
      className={`nav-link w-full pl-3 ${active ? 'nav-link-active' : ''}`}
    >
      <Icon className="w-3.5 h-3.5 shrink-0 opacity-60" />
      <span className="truncate text-body-sm text-body-sm">{item.label}</span>
    </button>
  );
}

/* ---------------- Nav Sub-group (middle level) ---------------- */
function NavSubGroupView({
  subgroup,
  activePath,
  onNavigate,
  expanded,
  onToggle,
}: {
  subgroup: NavSubGroup;
  activePath: string;
  onNavigate: (p: string) => void;
  expanded: boolean;
  onToggle: () => void;
}) {
  const Icon = subgroup.icon;
  const isItemActive = subgroup.items.some((i) => activePath === i.path || activePath.startsWith(i.path + '/'));

  return (
    <div>
      <button
        onClick={onToggle}
        className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-body-sm text-body-sm transition-colors ${
          isItemActive ? 'text-on-surface font-semibold' : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'
        }`}
      >
        <Icon className="w-3.5 h-3.5 shrink-0 opacity-60" />
        <span className="flex-1 text-left truncate">{subgroup.label}</span>
        <ChevronRight className={`w-3 h-3 shrink-0 transition-transform ${expanded ? 'rotate-90' : ''}`} />
      </button>
      {expanded && (
        <div className="ml-4 pl-2 border-l border-outline-variant/60 space-y-0.5 mt-0.5 mb-1 animate-fade-in">
          {subgroup.items.map((item) => (
            <NavLeaf key={item.id} item={item} activePath={activePath} onNavigate={onNavigate} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------------- Nav Section (top level) ---------------- */
function NavSectionView({
  section,
  activePath,
  onNavigate,
  expanded,
  onToggle,
}: {
  section: NavSection;
  activePath: string;
  onNavigate: (p: string) => void;
  expanded: boolean;
  onToggle: () => void;
}) {
  const Icon = section.icon;
  const isSectionActive = section.subgroups.some((sg) =>
    sg.items.some((i) => activePath === i.path || activePath.startsWith(i.path + '/'))
  );

  return (
    <div className="mb-1">
      <button
        onClick={onToggle}
        className={`nav-link w-full justify-between ${isSectionActive ? 'nav-link-active' : ''}`}
      >
        <span className="flex items-center gap-3 min-w-0">
          <Icon className="w-[18px] h-[18px] shrink-0" />
          <span className="truncate">{section.label}</span>
        </span>
        <ChevronDown className={`w-4 h-4 shrink-0 transition-transform ${expanded ? 'rotate-180' : ''}`} />
      </button>
      {expanded && (
        <div className="mt-1 mb-2 ml-3 pl-2 border-l border-outline-variant space-y-1.5 animate-fade-in">
          {section.subgroups.map((sg) => (
            <SubGroupWrapper key={sg.id} subgroup={sg} activePath={activePath} onNavigate={onNavigate} />
          ))}
        </div>
      )}
    </div>
  );
}

/* Sub-group wrapper with its own expand state */
function SubGroupWrapper({
  subgroup,
  activePath,
  onNavigate,
}: {
  subgroup: NavSubGroup;
  activePath: string;
  onNavigate: (p: string) => void;
}) {
  const [expanded, setExpanded] = useState(() =>
    subgroup.items.some((i) => activePath === i.path || activePath.startsWith(i.path + '/'))
  );

  return (
    <NavSubGroupView
      subgroup={subgroup}
      activePath={activePath}
      onNavigate={onNavigate}
      expanded={expanded}
      onToggle={() => setExpanded((v) => !v)}
    />
  );
}

export function Sidebar({
  activePath,
  onNavigate,
  open,
  onClose,
}: {
  activePath: string;
  onNavigate: (path: string) => void;
  open: boolean;
  onClose: () => void;
}) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    for (const s of navigation) {
      const sectionActive = s.subgroups.some((sg) =>
        sg.items.some((i) => activePath === i.path || activePath.startsWith(i.path + '/'))
      );
      init[s.id] = sectionActive;
    }
    return init;
  });

  const toggle = (id: string) => setExpanded((p) => ({ ...p, [id]: !p[id] }));

  return (
    <>
      {open && <div className="fixed inset-0 bg-on-surface/30 z-40 lg:hidden" onClick={onClose} />}

      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-[280px] bg-surface border-r border-outline-variant flex flex-col transition-transform duration-300 lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand */}
        <div className="h-[64px] flex items-center gap-2.5 px-5 border-b border-outline-variant shrink-0">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-sm">
            <ShieldCheck className="w-5 h-5 text-on-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-title-md text-on-surface leading-tight">Concierge</div>
            <div className="text-label-sm text-on-surface-variant leading-tight">Admin Platform</div>
          </div>
          <button onClick={onClose} className="btn-icon lg:hidden">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 scrollbar-hide">
          {navigation.map((s) => (
            <NavSectionView
              key={s.id}
              section={s}
              activePath={activePath}
              onNavigate={onNavigate}
              expanded={expanded[s.id] ?? false}
              onToggle={() => toggle(s.id)}
            />
          ))}
        </nav>

        {/* Footer */}
        <div className="px-3 py-3 border-t border-outline-variant shrink-0">
          <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-surface-container-low transition-colors cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-secondary-container text-on-secondary-fixed font-semibold flex items-center justify-center text-xs">
              AD
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-label-md text-on-surface truncate">Alex Drake</div>
              <div className="text-label-sm text-on-surface-variant truncate">Super Admin</div>
            </div>
            <Settings className="w-4 h-4 text-on-surface-variant" />
          </div>
        </div>
      </aside>
    </>
  );
}

/* ---------------- TopNav ---------------- */
export function TopNav({
  onOpenSidebar,
  onOpenPalette,
  onNavigate,
}: {
  onOpenSidebar: () => void;
  onOpenPalette: () => void;
  onNavigate: (path: string) => void;
  onToggleAlerts: () => void;
}) {
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState<{ path: string; label: string }[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [quickCreateOpen, setQuickCreateOpen] = useState(false);

  useEffect(() => {
    if (search.trim()) {
      const q = search.toLowerCase();
      setSearchResults(allRoutes.filter((r) => r.label.toLowerCase().includes(q)).slice(0, 8));
    } else {
      setSearchResults([]);
    }
  }, [search]);

  return (
    <header className="sticky top-0 z-30 h-[64px] bg-surface/80 backdrop-blur-md border-b border-outline-variant flex items-center gap-3 px-4 lg:px-6">
      <button onClick={onOpenSidebar} className="btn-icon lg:hidden">
        <Menu className="w-5 h-5" />
      </button>

      <div className="relative flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant pointer-events-none" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setShowResults(true); }}
            onFocus={() => setShowResults(true)}
            onBlur={() => setTimeout(() => setShowResults(false), 150)}
            placeholder="Search pages, records, people…"
            className="input pl-9 pr-16 h-9"
          />
          <button
            onClick={onOpenPalette}
            className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-surface-container-high text-on-surface-variant text-label-sm"
          >
            <Command className="w-3 h-3" />K
          </button>
        </div>
        {showResults && searchResults.length > 0 && (
          <div className="absolute top-full mt-1.5 w-full bg-surface-container-lowest border border-outline-variant rounded-xl shadow-elevated overflow-hidden animate-scale-in">
            {searchResults.map((r) => (
              <button
                key={r.path}
                onClick={() => { onNavigate(r.path); setShowResults(false); setSearch(''); }}
                className="w-full text-left px-3 py-2 hover:bg-surface-container-low flex items-center justify-between text-body-sm"
              >
                <span className="text-on-surface">{r.label}</span>
                <span className="text-label-sm text-on-surface-variant">{r.path}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex-1" />

      <button className="btn-icon relative">
        <Bell className="w-5 h-5" />
        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full ring-2 ring-surface" />
      </button>

      <div className="relative">
        <button onClick={() => setQuickCreateOpen((v) => !v)} className="btn-primary h-9 px-3">
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Create</span>
          <ChevronDown className="w-3.5 h-3.5" />
        </button>
        {quickCreateOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setQuickCreateOpen(false)} />
            <div className="absolute right-0 top-full mt-1.5 w-56 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-elevated overflow-hidden z-50 animate-scale-in">
              {[
                { label: 'New Listing', path: '/marketplace/listings' },
                { label: 'New Reservation', path: '/reservations/operations' },
                { label: 'New User', path: '/users' },
                { label: 'New Support Ticket', path: '/support/tickets' },
                { label: 'New Organization', path: '/marketplace/organizations' },
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={() => { onNavigate(item.path); setQuickCreateOpen(false); }}
                  className="w-full text-left px-3 py-2.5 hover:bg-surface-container-low flex items-center gap-2 text-body-sm text-on-surface"
                >
                  <Plus className="w-3.5 h-3.5 text-on-surface-variant" />
                  {item.label}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </header>
  );
}

/* ---------------- Command Palette ---------------- */
export function CommandPalette({
  open,
  onClose,
  onNavigate,
}: {
  open: boolean;
  onClose: () => void;
  onNavigate: (path: string) => void;
}) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (!open) setQuery('');
  }, [open]);

  const results = useMemo(() => {
    if (!query.trim()) return allRoutes.slice(0, 8);
    const q = query.toLowerCase();
    return allRoutes.filter((r) => r.label.toLowerCase().includes(q) || r.path.includes(q)).slice(0, 10);
  }, [query]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center pt-[15vh] px-4">
      <div className="absolute inset-0 bg-on-surface/40 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div className="relative w-full max-w-xl bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-elevated overflow-hidden animate-scale-in">
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-outline-variant">
          <Search className="w-5 h-5 text-on-surface-variant" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search…"
            className="flex-1 bg-transparent text-body-md text-on-surface placeholder:text-outline outline-none"
          />
          <kbd className="px-1.5 py-0.5 rounded bg-surface-container-high text-label-sm text-on-surface-variant">ESC</kbd>
        </div>
        <div className="max-h-80 overflow-y-auto p-2">
          {results.length === 0 ? (
            <div className="px-3 py-8 text-center text-body-sm text-on-surface-variant">No results found</div>
          ) : (
            results.map((r) => (
              <button
                key={r.path}
                onClick={() => { onNavigate(r.path); onClose(); }}
                className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-surface-container-low flex items-center justify-between"
              >
                <span className="text-body-md text-on-surface">{r.label}</span>
                <span className="text-label-sm text-on-surface-variant">{r.path}</span>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------------- Alert Banner ---------------- */
export function AlertBanner({ onDismiss }: { onDismiss: () => void }) {
  const [show, setShow] = useState(true);
  if (!show) return null;
  return (
    <div className="bg-error-container/40 border-b border-error/20 px-4 py-2.5 flex items-center gap-3 animate-slide-in-right">
      <AlertTriangle className="w-4 h-4 text-error shrink-0" />
      <p className="text-body-sm text-on-error-container flex-1">
        Elevated fraud activity detected on 3 vendor accounts. Review recommended.
      </p>
      <button onClick={() => { setShow(false); onDismiss(); }} className="btn-ghost text-error px-2 py-1">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

/* ---------------- App Shell ---------------- */
export function AppShell({
  activePath,
  onNavigate,
  children,
}: {
  activePath: string;
  onNavigate: (path: string) => void;
  children: ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [alertOpen, setAlertOpen] = useState(true);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar
        activePath={activePath}
        onNavigate={(p) => { onNavigate(p); setSidebarOpen(false); }}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="flex-1 min-w-0 flex flex-col">
        <TopNav
          onOpenSidebar={() => setSidebarOpen(true)}
          onOpenPalette={() => setPaletteOpen(true)}
          onNavigate={onNavigate}
          onToggleAlerts={() => setAlertOpen(true)}
        />
        {alertOpen && <AlertBanner onDismiss={() => setAlertOpen(false)} />}
        <main className="flex-1 p-4 lg:p-6 max-w-[1600px] w-full mx-auto">
          {children}
        </main>
      </div>
      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} onNavigate={onNavigate} />
    </div>
  );
}
