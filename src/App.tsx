import { useState, useEffect, useCallback } from 'react';
import { AppShell } from './components/Shell';
import { TablePage, SettingsPage, ReportPage, ListEditorPage, DetailPage } from './components/PageGenerators';
import { findRoute } from './routes';
import { DashboardPage } from './pages/Dashboard';
import { CallCenterPage } from './pages/CallCenter';
import { AgentManagementPage } from './pages/AgentManagement';
import { ApiUsagePage } from './pages/ApiUsage';
import { AutomationBuilderPage } from './pages/AutomationBuilder';
import { ListingsPage, OrdersPage, UsersPage } from './pages/Marketplace';
import { SupportTicketsPage } from './pages/SupportTickets';
import { TaxonomyPage } from './pages/Taxonomy';

function useHashRoute() {
  const [path, setPath] = useState(() => window.location.hash.slice(1) || '/dashboard');

  useEffect(() => {
    const handler = () => {
      const hash = window.location.hash.slice(1) || '/dashboard';
      setPath(hash);
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', handler);
    return () => window.removeEventListener('hashchange', handler);
  }, []);

  const navigate = useCallback((p: string) => {
    const clean = p.split('?')[0];
    window.location.hash = clean;
  }, []);

  return { path, navigate };
}

/* Custom pages that have bespoke implementations */
const customPages: Record<string, React.ComponentType<{ onNavigate: (p: string) => void }>> = {
  '/dashboard': DashboardPage,
  '/reservations/callcenter': CallCenterPage as any,
  '/reservations/agents': AgentManagementPage as any,
  '/api-management/usage': ApiUsagePage as any,
  '/settings/reservations/automation/ivr': AutomationBuilderPage as any,
  '/marketplace/listings': ListingsPage as any,
  '/commerce/orders': OrdersPage as any,
  '/users': UsersPage as any,
  '/support/tickets': SupportTicketsPage as any,
};

export default function App() {
  const { path, navigate } = useHashRoute();
  const cleanPath = path.split('?')[0];

  const renderPage = () => {
    // Check for custom page first
    const CustomPage = customPages[cleanPath];
    if (CustomPage) return <CustomPage onNavigate={navigate} />;

    // Taxonomy — all 9 types route to one unified page
    if (cleanPath.startsWith('/settings/taxonomy/')) {
      const taxonomyType = cleanPath.replace('/settings/taxonomy/', '');
      return <TaxonomyPage activeType={taxonomyType} onNavigate={navigate} />;
    }

    // Look up route metadata and render via generator
    const route = findRoute(cleanPath);
    if (!route) {
      return (
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <h1 className="text-headline-lg text-headline-lg text-on-surface">Page not found</h1>
          <p className="text-body-md text-body-md text-on-surface-variant mt-2">The route "{cleanPath}" doesn't exist.</p>
        </div>
      );
    }

    switch (route.type) {
      case 'table': return <TablePage route={route} onNavigate={navigate} />;
      case 'settings': return <SettingsPage route={route} />;
      case 'report': return <ReportPage route={route} />;
      case 'list-editor': return <ListEditorPage route={route} />;
      case 'detail': return <DetailPage route={route} />;
      // 'custom' and 'grid' fall through to table for now
      default: return <TablePage route={route} onNavigate={navigate} />;
    }
  };

  return (
    <AppShell activePath={path} onNavigate={navigate}>
      {renderPage()}
    </AppShell>
  );
}
