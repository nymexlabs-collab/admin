import {
  LayoutDashboard, Store, CalendarCheck, Gavel, FileText, Plug, Settings,
  type LucideIcon,
} from 'lucide-react';
import { routes, type RouteMeta } from './routes';

export type RouteGroup = {
  id: string;
  label: string;
  icon: LucideIcon;
  path: string;
  children?: { id: string; label: string; icon: LucideIcon; path: string }[];
};

/* Build nav groups from the route registry, organized by top-level domain */
function buildNavFromRoutes(): RouteGroup[] {
  const groups: RouteGroup[] = [
    {
      id: 'insights',
      label: 'Insights',
      icon: LayoutDashboard,
      path: '/dashboard',
      children: [{ id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' }],
    },
  ];

  // Marketplace routes
  const marketplaceChildren = routes
    .filter((r) => r.breadcrumbs[0] === 'Marketplace' && !r.path.includes('/detail'))
    .map((r: RouteMeta) => ({ id: r.path, label: r.title, icon: r.icon, path: r.path }));
  groups.push({
    id: 'marketplace',
    label: 'Marketplace',
    icon: Store,
    path: '/marketplace/listings',
    children: marketplaceChildren,
  });

  // Reservation Services routes
  const reservationChildren = routes
    .filter((r) => r.breadcrumbs[0] === 'Reservation Services' && !r.path.includes('/detail'))
    .map((r: RouteMeta) => ({ id: r.path, label: r.title, icon: r.icon, path: r.path }));
  groups.push({
    id: 'reservations',
    label: 'Reservation Services',
    icon: CalendarCheck,
    path: '/reservations/callcenter',
    children: reservationChildren,
  });

  // Platform Governance routes
  const governanceChildren = routes
    .filter((r) => r.breadcrumbs[0] === 'Platform Governance' && !r.path.includes('/detail'))
    .map((r: RouteMeta) => ({ id: r.path, label: r.title, icon: r.icon, path: r.path }));
  groups.push({
    id: 'governance',
    label: 'Platform Governance',
    icon: Gavel,
    path: '/support/tickets',
    children: governanceChildren,
  });

  // Content Management routes
  const contentChildren = routes
    .filter((r) => r.breadcrumbs[0] === 'Content Management' && !r.path.includes('/detail'))
    .map((r: RouteMeta) => ({ id: r.path, label: r.title, icon: r.icon, path: r.path }));
  groups.push({
    id: 'content',
    label: 'Content Management',
    icon: FileText,
    path: '/content/pages',
    children: contentChildren,
  });

  // API Management routes
  const apiChildren = routes
    .filter((r) => r.breadcrumbs[0] === 'API Management' && !r.path.includes('/detail'))
    .map((r: RouteMeta) => ({ id: r.path, label: r.title, icon: r.icon, path: r.path }));
  groups.push({
    id: 'api',
    label: 'API Management',
    icon: Plug,
    path: '/api-management',
    children: apiChildren,
  });

  // System routes
  const systemChildren = routes
    .filter((r) => r.breadcrumbs[0] === 'System' && !r.path.includes('/detail'))
    .map((r: RouteMeta) => ({ id: r.path, label: r.title, icon: r.icon, path: r.path }));
  groups.push({
    id: 'system',
    label: 'System',
    icon: Settings,
    path: '/system/logs',
    children: systemChildren,
  });

  return groups;
}

export const navigation: RouteGroup[] = buildNavFromRoutes();

export const allRoutes: { path: string; label: string }[] = routes.map((r) => ({
  path: r.path,
  label: r.title,
}));
