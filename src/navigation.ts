import {
  LayoutDashboard, Store, CalendarCheck, ShoppingCart,
  Tag, MapPin, Server, ShieldAlert, Gavel,
  Users, Megaphone, BarChart3, DollarSign,
  Headphones, Phone, MessageSquare, BookOpen, Wrench, ClipboardCheck,
  LifeBuoy, Activity, TrendingUp,
  FileText, Newspaper, Image, Layout,
  Plug, ServerCog, HardDrive,
  Settings, Workflow, Zap, Building, UserCog,
  type LucideIcon,
} from 'lucide-react';
import { routes, type RouteMeta } from './routes';

/* 3-level nav tree: Section → SubGroup → Item */
export type NavItem = { id: string; label: string; icon: LucideIcon; path: string };
export type NavSubGroup = { id: string; label: string; icon: LucideIcon; items: NavItem[] };
export type NavSection = {
  id: string;
  label: string;
  icon: LucideIcon;
  path: string;
  subgroups: NavSubGroup[];
};

/* Helper: find route by path, extract label + icon */
function ri(path: string): NavItem {
  const r = routes.find((x) => x.path === path);
  if (!r) return { id: path, label: path.split('/').pop() ?? path, icon: Settings, path };
  return { id: r.path, label: r.title, icon: r.icon, path: r.path };
}

function items(...paths: string[]): NavItem[] {
  return paths.map(ri);
}

export const navigation: NavSection[] = [
  /* ===== INSIGHTS ===== */
  {
    id: 'insights',
    label: 'Insights',
    icon: LayoutDashboard,
    path: '/dashboard',
    subgroups: [
      { id: 'insights-main', label: 'Overview', icon: LayoutDashboard, items: [ri('/dashboard')] },
    ],
  },

  /* ===== MARKETPLACE ===== */
  {
    id: 'marketplace',
    label: 'Marketplace',
    icon: Store,
    path: '/marketplace/listings',
    subgroups: [
      {
        id: 'mp-compliance',
        label: 'Compliance',
        icon: ShieldCheck,
        items: items(
          '/marketplace/organizations',
          '/marketplace/listings',
          '/marketplace/inventory',
          '/marketplace/reservations',
          '/marketplace/orders',
          '/marketplace/reviews',
        ),
      },
      {
        id: 'mp-taxonomy',
        label: 'Taxonomy',
        icon: Tag,
        items: items(
          '/settings/taxonomy/categories',
          '/settings/taxonomy/tags',
          '/settings/taxonomy/amenities',
          '/settings/taxonomy/features',
          '/settings/taxonomy/event-types',
          '/settings/taxonomy/listing-types',
          '/settings/taxonomy/service-types',
          '/settings/taxonomy/custom-attributes',
          '/settings/taxonomy/attribute-templates',
        ),
      },
      {
        id: 'mp-geography',
        label: 'Geography',
        icon: MapPin,
        items: items(
          '/settings/geography/countries',
          '/settings/geography/regions',
          '/settings/geography/states',
          '/settings/geography/cities',
          '/settings/geography/service-areas',
        ),
      },
      {
        id: 'mp-tenants',
        label: 'Tenant Management',
        icon: Server,
        items: items(
          '/settings/tenants',
          '/settings/tenants/organizations',
        ),
      },
      {
        id: 'mp-trust',
        label: 'Trust & Safety',
        icon: ShieldAlert,
        items: items(
          '/marketplace/trust/media',
          '/marketplace/trust/reported',
          '/marketplace/trust/reviews',
          '/marketplace/trust/fraud',
          '/marketplace/trust/appeals',
          '/marketplace/trust/violations',
          '/marketplace/trust/suspensions',
          '/marketplace/trust/chargebacks',
          '/settings/trust/risk-rules',
        ),
      },
      {
        id: 'mp-users',
        label: 'Users',
        icon: Users,
        items: items(
          '/users',
          '/users/teams',
          '/settings/users/roles',
          '/settings/users/permissions',
        ),
      },
      {
        id: 'mp-marketing',
        label: 'Marketing & Ads',
        icon: Megaphone,
        items: items(
          '/marketing',
          '/marketing/sponsored',
          '/marketing/featured',
          '/marketing/campaigns',
          '/marketing/promotions',
          '/marketing/referral',
          '/marketing/affiliate',
          '/marketing/coupons',
          '/settings/marketing/discount-rules',
          '/content/landing-pages',
          '/content/banners',
          '/marketing/analytics',
        ),
      },
      {
        id: 'mp-commerce',
        label: 'Commerce',
        icon: ShoppingCart,
        items: items(
          '/commerce/orders',
          '/commerce/transactions',
          '/commerce/payments',
          '/commerce/refunds',
          '/commerce/wallet',
          '/commerce/gift-cards',
          '/commerce/coupons',
          '/settings/commerce/taxes',
          '/commerce/payouts',
          '/settings/commerce/commissions',
          '/commerce/settlement',
          '/commerce/billing',
        ),
      },
    ],
  },

  /* ===== RESERVATION SERVICES ===== */
  {
    id: 'reservations',
    label: 'Reservation Services',
    icon: CalendarCheck,
    path: '/reservations/callcenter',
    subgroups: [
      {
        id: 'rs-clients',
        label: 'Clients',
        icon: Building,
        items: items('/reservations/clients'),
      },
      {
        id: 'rs-operations',
        label: 'Reservation Operations',
        icon: CalendarCheck,
        items: items(
          '/reservations/operations',
          '/reservations/queue',
          '/reservations/calendar',
        ),
      },
      {
        id: 'rs-callcenter',
        label: 'Call Center',
        icon: Phone,
        items: items(
          '/reservations/callcenter',
          '/settings/callcenter/extensions',
          '/settings/callcenter/ring-groups',
          '/settings/callcenter/ivr',
          '/settings/callcenter/routing',
        ),
      },
      {
        id: 'rs-messaging',
        label: 'Messaging',
        icon: MessageSquare,
        items: items(
          '/reservations/messaging',
          '/reservations/messaging/inbox',
          '/settings/messaging/templates',
          '/settings/messaging/auto-responses',
        ),
      },
      {
        id: 'rs-kb',
        label: 'Knowledge Base',
        icon: BookOpen,
        items: items(
          '/reservations/knowledge-base',
          '/reservations/knowledge-base/client-scripts',
          '/reservations/knowledge-base/reservation-scripts',
          '/reservations/knowledge-base/cancellation-scripts',
          '/reservations/knowledge-base/sales-scripts',
          '/reservations/knowledge-base/objections',
          '/reservations/knowledge-base/lockouts',
          '/reservations/knowledge-base/maintenance',
          '/reservations/knowledge-base/emergency',
          '/reservations/knowledge-base/faqs',
        ),
      },
      {
        id: 'rs-property',
        label: 'Property Support',
        icon: Wrench,
        items: items(
          '/reservations/property-support',
          '/reservations/property-support/lockouts',
          '/reservations/property-support/maintenance',
          '/reservations/property-support/housekeeping',
          '/reservations/property-support/complaints',
          '/reservations/property-support/damage',
          '/reservations/property-support/noise',
          '/reservations/property-support/utilities',
          '/reservations/property-support/checkin',
          '/reservations/property-support/checkout',
        ),
      },
      {
        id: 'rs-agents',
        label: 'Agent Management',
        icon: Headphones,
        items: items(
          '/reservations/agents',
          '/reservations/agents/teams',
          '/settings/agents/skills',
          '/settings/agents/languages',
          '/reservations/agents/scheduling',
          '/reservations/agents/performance',
        ),
      },
      {
        id: 'rs-automation',
        label: 'Automation',
        icon: Workflow,
        items: items(
          '/settings/reservations/automation/ivr',
          '/settings/reservations/automation/routing',
          '/settings/reservations/automation/escalation',
          '/settings/reservations/automation/sla',
          '/settings/reservations/automation/followup',
          '/settings/reservations/automation/reminders',
        ),
      },
      {
        id: 'rs-qa',
        label: 'Quality Assurance',
        icon: ClipboardCheck,
        items: items(
          '/reservations/qa',
          '/reservations/qa/call-reviews',
          '/reservations/qa/scorecards',
          '/reservations/qa/coaching',
          '/reservations/qa/recordings',
          '/reservations/qa/compliance',
          '/reservations/qa/feedback',
        ),
      },
      {
        id: 'rs-reporting',
        label: 'Reporting',
        icon: BarChart3,
        items: items('/reservations/reports'),
      },
    ],
  },

  /* ===== PLATFORM GOVERNANCE ===== */
  {
    id: 'governance',
    label: 'Platform Governance',
    icon: Gavel,
    path: '/support/tickets',
    subgroups: [
      {
        id: 'pg-vendor-rules',
        label: 'Vendor Rules',
        icon: Gavel,
        items: items(
          '/settings/vendor-rules/reservations',
          '/settings/vendor-rules/cancellations',
          '/settings/vendor-rules/refunds',
          '/settings/vendor-rules/booking',
          '/settings/workflows',
          '/settings/data-governance',
          '/settings/legal-holds',
          '/settings/consent',
          '/settings/compliance-reports',
          '/settings/audit-policies',
          '/settings/governance-analytics',
        ),
      },
      {
        id: 'pg-support',
        label: 'Support',
        icon: LifeBuoy,
        items: items(
          '/support/tickets',
          '/support/claims',
          '/support/disputes',
          '/support/escalations',
          '/support/knowledge-base',
          '/support/canned-responses',
          '/support/csat',
          '/support/analytics',
        ),
      },
      {
        id: 'pg-user-mgmt',
        label: 'User Management',
        icon: UserCog,
        items: items(
          '/settings/audit-logs',
          '/settings/api-keys',
          '/settings/secrets',
          '/settings/oauth-clients',
          '/settings/sso',
          '/settings/mfa',
          '/settings/compliance',
          '/settings/security-policies',
        ),
      },
      {
        id: 'pg-revenue',
        label: 'Revenue Operations',
        icon: DollarSign,
        items: items('/revenue'),
      },
      {
        id: 'pg-reporting',
        label: 'Reporting',
        icon: BarChart3,
        items: items(
          '/reports',
          '/reports/financial',
          '/reports/users',
          '/reports/user-activity',
          '/reports/support',
          '/reports/marketplace',
          '/reports/health',
          '/reports/incidents',
        ),
      },
      {
        id: 'pg-analytics',
        label: 'Analytics',
        icon: TrendingUp,
        items: items(
          '/analytics',
          '/analytics/revenue',
          '/analytics/gmv',
          '/analytics/bookings',
          '/analytics/occupancy',
          '/analytics/events',
          '/analytics/users',
          '/analytics/growth',
          '/analytics/funnel',
          '/analytics/marketplace',
          '/analytics/cohorts',
          '/analytics/financial',
          '/analytics/tax',
          '/analytics/custom',
        ),
      },
      {
        id: 'pg-search',
        label: 'Search Analytics',
        icon: Search,
        items: items(
          '/analytics/search',
          '/analytics/search/zero-results',
          '/analytics/search/popular',
          '/analytics/search/ctr',
          '/analytics/search/funnel',
          '/analytics/search/revenue',
          '/analytics/search/abandoned',
          '/analytics/search/quality',
          '/analytics/search/logs',
        ),
      },
    ],
  },

  /* ===== CONTENT MANAGEMENT ===== */
  {
    id: 'content',
    label: 'Content Management',
    icon: FileText,
    path: '/content/pages',
    subgroups: [
      {
        id: 'cm-pages',
        label: 'Pages',
        icon: FileText,
        items: items(
          '/content/pages',
          '/content/pages/destinations',
          '/content/pages/browse',
          '/content/pages/directory',
          '/content/pages/services',
          '/content/pages/plan',
          '/content/pages/things-to-do',
          '/content/pages/food-drink',
          '/content/pages/live-shows',
          '/content/pages/travel',
          '/content/pages/party',
          '/content/pages/spaces',
          '/content/pages/vendors',
          '/content/pages/compose',
          '/content/pages/concierge',
        ),
      },
      {
        id: 'cm-content',
        label: 'Content',
        icon: Newspaper,
        items: items(
          '/content/blog',
          '/content/blog/posts',
          '/content/faqs',
          '/content/help-center',
          '/content/legal',
          '/content/email-templates',
          '/content/notification-templates',
          '/content/announcements',
        ),
      },
      {
        id: 'cm-structure',
        label: 'Site Structure',
        icon: Layout,
        items: items(
          '/content/navigation',
          '/content/footer',
        ),
      },
      {
        id: 'cm-media',
        label: 'Media',
        icon: Image,
        items: items(
          '/content/media',
          '/content/ad-banners',
        ),
      },
    ],
  },

  /* ===== API MANAGEMENT ===== */
  {
    id: 'api',
    label: 'API Management',
    icon: Plug,
    path: '/api-management',
    subgroups: [
      {
        id: 'am-core',
        label: 'Core',
        icon: Plug,
        items: items(
          '/api-management',
          '/api-management/consumers',
          '/api-management/keys',
          '/api-management/oauth-apps',
          '/api-management/rate-limits',
        ),
      },
      {
        id: 'am-integrations',
        label: 'Integrations',
        icon: Zap,
        items: items(
          '/settings/integrations/payments',
          '/settings/integrations/calendar',
          '/settings/integrations/communication',
        ),
      },
      {
        id: 'am-monitoring',
        label: 'Monitoring',
        icon: Activity,
        items: items(
          '/api-management/usage',
          '/api-management/analytics',
          '/api-management/webhooks',
          '/api-management/logs',
          '/api-management/sdks',
        ),
      },
    ],
  },

  /* ===== SYSTEM ===== */
  {
    id: 'system',
    label: 'System',
    icon: Settings,
    path: '/system/logs',
    subgroups: [
      {
        id: 'sys-ops',
        label: 'Operations',
        icon: ServerCog,
        items: items(
          '/system/logs',
          '/system/metrics',
          '/system/performance',
          '/system/diagnostics',
        ),
      },
      {
        id: 'sys-infra',
        label: 'Infrastructure',
        icon: HardDrive,
        items: items(
          '/system/backups',
          '/system/scheduler',
          '/system/versions',
          '/system/maintenance',
          '/system/disaster-recovery',
        ),
      },
    ],
  },
];

/* Re-export ShieldCheck for use above */
import { ShieldCheck, Search } from 'lucide-react';

export const allRoutes: { path: string; label: string }[] = routes.map((r: RouteMeta) => ({
  path: r.path,
  label: r.title,
}));
