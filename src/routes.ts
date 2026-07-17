import {
  LayoutDashboard, Store, Building2, Package, CalendarCheck, ShoppingCart, Star,
  Tag, MapPin, Server, ShieldAlert, Flag, Gavel, Ban, CreditCard, FileWarning,
  Users, Megaphone, Target, Gift, Percent, Wallet, Receipt, BarChart3, DollarSign,
  Headphones, Phone, MessageSquare, BookOpen, Wrench, Clock, Award, ClipboardCheck,
  LifeBuoy, AlertTriangle, Shield, Key, Lock, Activity, TrendingUp, Database,
  FileText, Newspaper, HelpCircle, Scale, Mail, Bell, Navigation, Image, Layout,
  Plug, Webhook, Code, Gauge, ServerCog, HardDrive, RefreshCw, Stethoscope,
  Ticket, type LucideIcon,
} from 'lucide-react';

export type PageType = 'table' | 'settings' | 'report' | 'detail' | 'list-editor' | 'grid' | 'custom';

export type RouteMeta = {
  path: string;
  title: string;
  type: PageType;
  icon: LucideIcon;
  domain: string;
  breadcrumbs: string[];
  tabs?: string[];
  subtitle?: string;
};

/* Helpers to reduce verbosity */
const t = (path: string, title: string, type: PageType, icon: LucideIcon, domain: string, breadcrumbs: string[], extra?: Partial<RouteMeta>): RouteMeta => ({
  path, title, type, icon, domain, breadcrumbs, ...extra,
});

export const routes: RouteMeta[] = [
  /* ===== INSIGHTS ===== */
  t('/dashboard', 'Dashboard', 'custom', LayoutDashboard, 'dashboard', ['Insights'], { subtitle: 'Real-time platform health and activity' }),

  /* ===== MARKETPLACE — Compliance ===== */
  t('/marketplace/organizations', 'Organizations', 'table', Building2, 'org', ['Marketplace', 'Compliance']),
  t('/marketplace/listings', 'Listings', 'custom', Store, 'listing', ['Marketplace', 'Compliance'], { tabs: ['Overview', 'Pricing', 'Media', 'Availability', 'Reviews', 'History'] }),
  t('/marketplace/listings/detail', 'Listing Detail', 'detail', Store, 'listing', ['Marketplace', 'Compliance', 'Listings'], { tabs: ['Overview', 'Pricing', 'Media', 'Availability', 'Reviews', 'History'] }),
  t('/marketplace/inventory', 'Inventory', 'table', Package, 'inventory', ['Marketplace', 'Compliance']),
  t('/marketplace/reservations', 'Reservations', 'table', CalendarCheck, 'reservation', ['Marketplace', 'Compliance']),
  t('/marketplace/orders', 'Orders', 'table', ShoppingCart, 'order', ['Marketplace', 'Compliance']),
  t('/marketplace/reviews', 'Reviews', 'table', Star, 'review', ['Marketplace', 'Compliance']),

  /* ===== MARKETPLACE — Taxonomy ===== */
  t('/settings/taxonomy/categories', 'Categories', 'list-editor', Tag, 'taxonomy', ['Marketplace', 'Taxonomy']),
  t('/settings/taxonomy/tags', 'Tags', 'list-editor', Tag, 'taxonomy', ['Marketplace', 'Taxonomy']),
  t('/settings/taxonomy/amenities', 'Amenities', 'list-editor', Tag, 'taxonomy', ['Marketplace', 'Taxonomy']),
  t('/settings/taxonomy/features', 'Features', 'list-editor', Tag, 'taxonomy', ['Marketplace', 'Taxonomy']),
  t('/settings/taxonomy/event-types', 'Event Types', 'list-editor', Tag, 'taxonomy', ['Marketplace', 'Taxonomy']),
  t('/settings/taxonomy/listing-types', 'Listing Types', 'list-editor', Tag, 'taxonomy', ['Marketplace', 'Taxonomy']),
  t('/settings/taxonomy/service-types', 'Service Types', 'list-editor', Tag, 'taxonomy', ['Marketplace', 'Taxonomy']),
  t('/settings/taxonomy/custom-attributes', 'Custom Attributes', 'list-editor', Tag, 'taxonomy', ['Marketplace', 'Taxonomy']),
  t('/settings/taxonomy/attribute-templates', 'Attribute Templates', 'list-editor', Tag, 'taxonomy', ['Marketplace', 'Taxonomy']),

  /* ===== MARKETPLACE — Geography ===== */
  t('/settings/geography/countries', 'Countries', 'table', MapPin, 'geo', ['Marketplace', 'Geography']),
  t('/settings/geography/regions', 'Regions', 'table', MapPin, 'geo', ['Marketplace', 'Geography']),
  t('/settings/geography/states', 'States', 'table', MapPin, 'geo', ['Marketplace', 'Geography']),
  t('/settings/geography/cities', 'Cities', 'table', MapPin, 'geo', ['Marketplace', 'Geography']),
  t('/settings/geography/service-areas', 'Service Areas', 'table', MapPin, 'geo', ['Marketplace', 'Geography']),

  /* ===== MARKETPLACE — Tenant Management ===== */
  t('/settings/tenants', 'Tenants', 'table', Server, 'tenant', ['Marketplace', 'Tenant Management'], { tabs: ['Domains', 'Subscription Plans', 'Usage', 'Storage', 'Billing', 'Feature Flags', 'Enabled Modules', 'Quotas'] }),
  t('/settings/tenants/organizations', 'Tenant Organizations', 'table', Building2, 'org', ['Marketplace', 'Tenant Management']),

  /* ===== MARKETPLACE — Trust ===== */
  t('/marketplace/trust/media', 'Media Moderation', 'grid', Image, 'trust-media', ['Marketplace', 'Trust']),
  t('/marketplace/trust/reported', 'Reported Listings', 'table', Flag, 'trust', ['Marketplace', 'Trust']),
  t('/marketplace/trust/reviews', 'Review Moderation', 'table', Star, 'trust-review', ['Marketplace', 'Trust']),
  t('/marketplace/trust/fraud', 'Fraud Review', 'table', ShieldAlert, 'trust', ['Marketplace', 'Trust']),
  t('/marketplace/trust/appeals', 'Appeals', 'table', Gavel, 'trust', ['Marketplace', 'Trust']),
  t('/marketplace/trust/violations', 'Violations', 'table', FileWarning, 'trust', ['Marketplace', 'Trust']),
  t('/marketplace/trust/suspensions', 'Suspensions', 'table', Ban, 'trust', ['Marketplace', 'Trust']),
  t('/marketplace/trust/chargebacks', 'Chargebacks', 'table', CreditCard, 'trust', ['Marketplace', 'Trust']),

  /* ===== MARKETPLACE — Users ===== */
  t('/users', 'Users', 'custom', Users, 'user', ['Marketplace'], { tabs: ['Profile', 'Identity Verification', 'Sessions', 'Activity Log', 'Store Credit'] }),
  t('/users/teams', 'Teams', 'table', Users, 'user-team', ['Marketplace', 'Users']),
  t('/settings/users/roles', 'Roles', 'table', Shield, 'user-role', ['Marketplace', 'Users', 'Roles']),
  t('/settings/users/permissions', 'Permissions', 'settings', Lock, 'user-perm', ['Marketplace', 'Users', 'Permissions']),

  /* ===== MARKETPLACE — Marketing ===== */
  t('/marketing', 'Marketing Overview', 'report', Megaphone, 'marketing', ['Marketplace', 'Marketing']),
  t('/marketing/sponsored', 'Sponsored Listings', 'table', Megaphone, 'marketing', ['Marketplace', 'Marketing']),
  t('/marketing/featured', 'Featured Placement', 'table', Star, 'marketing', ['Marketplace', 'Marketing']),
  t('/marketing/campaigns', 'Campaigns', 'table', Target, 'marketing', ['Marketplace', 'Marketing']),
  t('/marketing/promotions', 'Promotions', 'table', Percent, 'marketing', ['Marketplace', 'Marketing']),
  t('/marketing/referral', 'Referral Program', 'table', Users, 'marketing', ['Marketplace', 'Marketing']),
  t('/marketing/affiliate', 'Affiliate Program', 'table', Users, 'marketing', ['Marketplace', 'Marketing']),
  t('/marketing/coupons', 'Coupons', 'table', Ticket, 'marketing', ['Marketplace', 'Marketing']),
  t('/marketing/analytics', 'Campaign Analytics', 'report', BarChart3, 'marketing', ['Marketplace', 'Marketing', 'Analytics']),

  /* ===== MARKETPLACE — Commerce ===== */
  t('/commerce/orders', 'Commerce Orders', 'custom', ShoppingCart, 'order', ['Marketplace', 'Commerce']),
  t('/commerce/transactions', 'Transactions', 'table', CreditCard, 'commerce', ['Marketplace', 'Commerce']),
  t('/commerce/payments', 'Payments', 'table', CreditCard, 'commerce', ['Marketplace', 'Commerce']),
  t('/commerce/refunds', 'Refunds', 'table', Receipt, 'commerce', ['Marketplace', 'Commerce']),
  t('/commerce/wallet', 'Wallet', 'table', Wallet, 'commerce', ['Marketplace', 'Commerce']),
  t('/commerce/gift-cards', 'Gift Cards', 'table', Gift, 'commerce', ['Marketplace', 'Commerce']),
  t('/commerce/coupons', 'Commerce Coupons', 'table', Ticket, 'commerce', ['Marketplace', 'Commerce']),
  t('/commerce/payouts', 'Payouts', 'table', Wallet, 'commerce', ['Marketplace', 'Commerce']),
  t('/commerce/settlement', 'Settlement Report', 'report', BarChart3, 'commerce', ['Marketplace', 'Commerce']),
  t('/commerce/billing', 'Billing', 'table', Receipt, 'commerce', ['Marketplace', 'Commerce']),

  /* ===== RESERVATION SERVICES ===== */
  t('/reservations/clients', 'Clients', 'table', Building2, 'client', ['Reservation Services'], { tabs: ['Company Info', 'Contacts', 'Staff Directory', 'Office Hours', 'Emergency Contacts', 'After Hours Rules', 'Escalation Chain', 'Brand Assets', 'FAQs', 'Internal Notes'] }),
  t('/reservations/operations', 'Reservation Operations', 'custom', CalendarCheck, 'reservation-ops', ['Reservation Services'], { subtitle: 'Booking calendar, queue, and reservation management' }),
  t('/reservations/queue', 'Reservation Queue', 'table', CalendarCheck, 'reservation-ops', ['Reservation Services', 'Operations']),
  t('/reservations/calendar', 'Booking Calendar', 'custom', CalendarCheck, 'reservation-ops', ['Reservation Services', 'Operations']),
  t('/reservations/callcenter', 'Call Center', 'custom', Phone, 'callcenter', ['Reservation Services']),
  t('/reservations/messaging', 'Messaging', 'custom', MessageSquare, 'messaging', ['Reservation Services']),
  t('/reservations/messaging/inbox', 'Unified Inbox', 'custom', MessageSquare, 'messaging', ['Reservation Services', 'Messaging']),
  t('/reservations/knowledge-base', 'Knowledge Base', 'custom', BookOpen, 'kb', ['Reservation Services']),
  t('/reservations/knowledge-base/client-scripts', 'Client Scripts', 'list-editor', BookOpen, 'kb', ['Reservation Services', 'Knowledge Base']),
  t('/reservations/knowledge-base/reservation-scripts', 'Reservation Scripts', 'list-editor', BookOpen, 'kb', ['Reservation Services', 'Knowledge Base']),
  t('/reservations/knowledge-base/cancellation-scripts', 'Cancellation Scripts', 'list-editor', BookOpen, 'kb', ['Reservation Services', 'Knowledge Base']),
  t('/reservations/knowledge-base/sales-scripts', 'Sales Scripts', 'list-editor', BookOpen, 'kb', ['Reservation Services', 'Knowledge Base']),
  t('/reservations/knowledge-base/objections', 'Objection Handling', 'list-editor', BookOpen, 'kb', ['Reservation Services', 'Knowledge Base']),
  t('/reservations/knowledge-base/lockouts', 'Lockout Procedures', 'list-editor', BookOpen, 'kb', ['Reservation Services', 'Knowledge Base']),
  t('/reservations/knowledge-base/maintenance', 'Maintenance Procedures', 'list-editor', BookOpen, 'kb', ['Reservation Services', 'Knowledge Base']),
  t('/reservations/knowledge-base/emergency', 'Emergency Procedures', 'list-editor', BookOpen, 'kb', ['Reservation Services', 'Knowledge Base']),
  t('/reservations/knowledge-base/faqs', 'FAQs', 'list-editor', BookOpen, 'kb', ['Reservation Services', 'Knowledge Base']),
  t('/reservations/property-support', 'Property Support', 'table', Wrench, 'property', ['Reservation Services'], { subtitle: 'Property support requests and dispatch' }),
  t('/reservations/property-support/lockouts', 'Lockouts', 'table', Wrench, 'property', ['Reservation Services', 'Property Support']),
  t('/reservations/property-support/maintenance', 'Maintenance Requests', 'table', Wrench, 'property', ['Reservation Services', 'Property Support']),
  t('/reservations/property-support/housekeeping', 'Housekeeping', 'table', Wrench, 'property', ['Reservation Services', 'Property Support']),
  t('/reservations/property-support/complaints', 'Guest Complaints', 'table', Wrench, 'property', ['Reservation Services', 'Property Support']),
  t('/reservations/property-support/damage', 'Damage Reports', 'table', Wrench, 'property', ['Reservation Services', 'Property Support']),
  t('/reservations/property-support/noise', 'Noise Complaints', 'table', Wrench, 'property', ['Reservation Services', 'Property Support']),
  t('/reservations/property-support/utilities', 'Utility Issues', 'table', Wrench, 'property', ['Reservation Services', 'Property Support']),
  t('/reservations/property-support/checkin', 'Check-in Assistance', 'table', Wrench, 'property', ['Reservation Services', 'Property Support']),
  t('/reservations/property-support/checkout', 'Check-out Assistance', 'table', Wrench, 'property', ['Reservation Services', 'Property Support']),
  t('/reservations/agents', 'Agent Management', 'custom', Headphones, 'agent', ['Reservation Services'], { tabs: ['Availability', 'Extension Assignment', 'Queue Assignment', 'Certifications', 'Performance'] }),
  t('/reservations/agents/teams', 'Agent Teams', 'table', Headphones, 'agent', ['Reservation Services', 'Agent Management']),
  t('/reservations/agents/scheduling', 'Shift Scheduling', 'custom', Clock, 'agent', ['Reservation Services', 'Agent Management']),
  t('/reservations/agents/performance', 'Agent Performance', 'report', BarChart3, 'agent', ['Reservation Services', 'Agent Management']),
  t('/settings/agents/skills', 'Agent Skills', 'list-editor', Award, 'agent', ['Reservation Services', 'Agent Management', 'Skills']),
  t('/settings/agents/languages', 'Agent Languages', 'list-editor', Award, 'agent', ['Reservation Services', 'Agent Management', 'Languages']),
  t('/settings/reservations/automation/ivr', 'IVR Builder', 'custom', Phone, 'ivr', ['Reservation Services', 'Automation']),
  t('/settings/reservations/automation/routing', 'Routing Rules', 'table', Phone, 'automation', ['Reservation Services', 'Automation']),
  t('/settings/reservations/automation/escalation', 'Escalation Rules', 'table', AlertTriangle, 'automation', ['Reservation Services', 'Automation']),
  t('/settings/reservations/automation/sla', 'SLA Rules', 'table', Clock, 'automation', ['Reservation Services', 'Automation']),
  t('/settings/reservations/automation/followup', 'Follow-up Rules', 'table', Clock, 'automation', ['Reservation Services', 'Automation']),
  t('/settings/reservations/automation/reminders', 'Reminder Rules', 'table', Bell, 'automation', ['Reservation Services', 'Automation']),
  t('/reservations/qa', 'Quality Assurance', 'table', ClipboardCheck, 'qa', ['Reservation Services']),
  t('/reservations/qa/call-reviews', 'Call Reviews', 'table', ClipboardCheck, 'qa', ['Reservation Services', 'QA']),
  t('/reservations/qa/scorecards', 'Scorecards', 'table', Award, 'qa', ['Reservation Services', 'QA']),
  t('/reservations/qa/coaching', 'Coaching', 'table', Award, 'qa', ['Reservation Services', 'QA']),
  t('/reservations/qa/recordings', 'Recorded Calls', 'table', ClipboardCheck, 'qa', ['Reservation Services', 'QA']),
  t('/reservations/qa/compliance', 'Compliance', 'table', Shield, 'qa', ['Reservation Services', 'QA']),
  t('/reservations/qa/feedback', 'Customer Feedback', 'report', BarChart3, 'qa', ['Reservation Services', 'QA']),
  t('/reservations/reports', 'Reporting', 'report', BarChart3, 'res-report', ['Reservation Services', 'Reporting']),

  /* ===== PLATFORM GOVERNANCE — Vendor Rules ===== */
  t('/settings/vendor-rules/reservations', 'Reservation Policies', 'settings', Gavel, 'governance', ['Platform Governance', 'Vendor Rules']),
  t('/settings/vendor-rules/cancellations', 'Cancellation Policies', 'settings', Gavel, 'governance', ['Platform Governance', 'Vendor Rules']),
  t('/settings/vendor-rules/refunds', 'Refund Policies', 'settings', Gavel, 'governance', ['Platform Governance', 'Vendor Rules']),
  t('/settings/vendor-rules/booking', 'Booking Rules', 'settings', Gavel, 'governance', ['Platform Governance', 'Vendor Rules']),
  t('/settings/workflows', 'Approval Workflows', 'table', Gavel, 'governance', ['Platform Governance', 'Vendor Rules']),
  t('/settings/legal-holds', 'Legal Holds', 'table', Scale, 'governance', ['Platform Governance', 'Vendor Rules']),
  t('/settings/consent', 'Consent Records', 'table', Shield, 'governance', ['Platform Governance', 'Vendor Rules']),
  t('/settings/compliance-reports', 'Compliance Reports', 'report', BarChart3, 'governance', ['Platform Governance', 'Vendor Rules']),
  t('/settings/audit-policies', 'Audit Policies', 'settings', Shield, 'governance', ['Platform Governance', 'Vendor Rules']),
  t('/settings/governance-analytics', 'Governance Analytics', 'report', BarChart3, 'governance', ['Platform Governance', 'Vendor Rules']),

  /* ===== PLATFORM GOVERNANCE — Support ===== */
  t('/support/tickets', 'Support Tickets', 'custom', LifeBuoy, 'ticket', ['Platform Governance', 'Support']),
  t('/support/claims', 'Claims', 'table', LifeBuoy, 'ticket', ['Platform Governance', 'Support']),
  t('/support/disputes', 'Disputes', 'table', AlertTriangle, 'ticket', ['Platform Governance', 'Support']),
  t('/support/escalations', 'Escalations', 'table', AlertTriangle, 'ticket', ['Platform Governance', 'Support']),
  t('/support/knowledge-base', 'Support Knowledge Base', 'list-editor', BookOpen, 'kb', ['Platform Governance', 'Support']),
  t('/support/canned-responses', 'Canned Responses', 'list-editor', MessageSquare, 'kb', ['Platform Governance', 'Support']),
  t('/support/csat', 'Customer Satisfaction', 'report', BarChart3, 'ticket', ['Platform Governance', 'Support']),
  t('/support/analytics', 'Support Analytics', 'report', BarChart3, 'ticket', ['Platform Governance', 'Support']),

  /* ===== PLATFORM GOVERNANCE — User Management ===== */
  t('/settings/audit-logs', 'Audit Logs', 'table', FileText, 'system', ['Platform Governance', 'User Management']),
  t('/settings/api-keys', 'API Keys', 'table', Key, 'api', ['Platform Governance', 'User Management']),
  t('/settings/secrets', 'Secrets', 'table', Lock, 'api', ['Platform Governance', 'User Management']),
  t('/settings/oauth-clients', 'OAuth Clients', 'table', Key, 'api', ['Platform Governance', 'User Management']),
  t('/settings/sso', 'SSO Configuration', 'settings', Lock, 'api', ['Platform Governance', 'User Management']),
  t('/settings/mfa', 'MFA Settings', 'settings', Shield, 'api', ['Platform Governance', 'User Management']),
  t('/settings/compliance', 'Compliance Settings', 'settings', Shield, 'governance', ['Platform Governance', 'User Management']),
  t('/settings/security-policies', 'Security Policies', 'settings', Shield, 'governance', ['Platform Governance', 'User Management']),

  /* ===== PLATFORM GOVERNANCE — Revenue ===== */
  t('/revenue', 'Revenue Operations', 'report', DollarSign, 'revenue', ['Platform Governance', 'Revenue Operations']),

  /* ===== PLATFORM GOVERNANCE — Reporting ===== */
  t('/reports', 'Reports Overview', 'report', BarChart3, 'analytics', ['Platform Governance', 'Reporting']),
  t('/reports/financial', 'Financial Reports', 'report', DollarSign, 'analytics', ['Platform Governance', 'Reporting']),
  t('/reports/users', 'User Reports', 'report', Users, 'analytics', ['Platform Governance', 'Reporting']),
  t('/reports/user-activity', 'User Activity', 'report', Activity, 'analytics', ['Platform Governance', 'Reporting']),
  t('/reports/support', 'Open Support Issues', 'report', LifeBuoy, 'analytics', ['Platform Governance', 'Reporting']),
  t('/reports/marketplace', 'Marketplace Analytics', 'report', BarChart3, 'analytics', ['Platform Governance', 'Reporting']),
  t('/reports/health', 'Marketplace Health', 'report', Activity, 'analytics', ['Platform Governance', 'Reporting']),
  t('/reports/incidents', 'Incident Metrics', 'report', AlertTriangle, 'analytics', ['Platform Governance', 'Reporting']),

  /* ===== PLATFORM GOVERNANCE — Analytics ===== */
  t('/analytics', 'Analytics Overview', 'report', BarChart3, 'analytics', ['Platform Governance', 'Analytics']),
  t('/analytics/revenue', 'Revenue Analytics', 'report', DollarSign, 'analytics', ['Platform Governance', 'Analytics']),
  t('/analytics/gmv', 'GMV Analytics', 'report', DollarSign, 'analytics', ['Platform Governance', 'Analytics']),
  t('/analytics/bookings', 'Booking Analytics', 'report', CalendarCheck, 'analytics', ['Platform Governance', 'Analytics']),
  t('/analytics/occupancy', 'Occupancy Analytics', 'report', BarChart3, 'analytics', ['Platform Governance', 'Analytics']),
  t('/analytics/events', 'Event Analytics', 'report', Activity, 'analytics', ['Platform Governance', 'Analytics']),
  t('/analytics/users', 'User Analytics', 'report', Users, 'analytics', ['Platform Governance', 'Analytics']),
  t('/analytics/growth', 'Growth Analytics', 'report', TrendingUp, 'analytics', ['Platform Governance', 'Analytics']),
  t('/analytics/funnel', 'Funnel Analytics', 'report', BarChart3, 'analytics', ['Platform Governance', 'Analytics']),
  t('/analytics/marketplace', 'Marketplace Analytics', 'report', BarChart3, 'analytics', ['Platform Governance', 'Analytics']),
  t('/analytics/cohorts', 'Cohort Analysis', 'report', Users, 'analytics', ['Platform Governance', 'Analytics']),
  t('/analytics/financial', 'Financial Analytics', 'report', DollarSign, 'analytics', ['Platform Governance', 'Analytics']),
  t('/analytics/tax', 'Tax Reports', 'report', Receipt, 'analytics', ['Platform Governance', 'Analytics']),
  t('/analytics/custom', 'Custom Reports', 'custom', BarChart3, 'analytics', ['Platform Governance', 'Analytics']),

  /* ===== Search Analytics ===== */
  t('/analytics/search', 'Search Analytics', 'report', BarChart3, 'search', ['Platform Governance', 'Search Analytics']),
  t('/analytics/search/zero-results', 'Zero Result Searches', 'report', BarChart3, 'search', ['Platform Governance', 'Search Analytics']),
  t('/analytics/search/popular', 'Popular Searches', 'report', BarChart3, 'search', ['Platform Governance', 'Search Analytics']),
  t('/analytics/search/ctr', 'Search CTR', 'report', BarChart3, 'search', ['Platform Governance', 'Search Analytics']),
  t('/analytics/search/funnel', 'Search Funnel', 'report', BarChart3, 'search', ['Platform Governance', 'Search Analytics']),
  t('/analytics/search/revenue', 'Search Revenue', 'report', DollarSign, 'search', ['Platform Governance', 'Search Analytics']),
  t('/analytics/search/abandoned', 'Abandoned Searches', 'report', BarChart3, 'search', ['Platform Governance', 'Search Analytics']),
  t('/analytics/search/quality', 'Search Quality', 'report', BarChart3, 'search', ['Platform Governance', 'Search Analytics']),
  t('/analytics/search/logs', 'Search Logs', 'table', FileText, 'search', ['Platform Governance', 'Search Analytics']),

  /* ===== CONTENT MANAGEMENT ===== */
  t('/content/pages', 'Pages', 'custom', FileText, 'content', ['Content Management']),
  t('/content/blog', 'Blog', 'list-editor', Newspaper, 'content', ['Content Management']),
  t('/content/blog/posts', 'Blog Posts', 'list-editor', Newspaper, 'content', ['Content Management', 'Blog']),
  t('/content/faqs', 'FAQs', 'list-editor', HelpCircle, 'content', ['Content Management']),
  t('/content/help-center', 'Help Center', 'list-editor', HelpCircle, 'content', ['Content Management']),
  t('/content/legal', 'Legal Center', 'list-editor', Scale, 'content', ['Content Management']),
  t('/content/email-templates', 'Email Templates', 'list-editor', Mail, 'content', ['Content Management']),
  t('/content/notification-templates', 'Notification Templates', 'list-editor', Bell, 'content', ['Content Management']),
  t('/content/navigation', 'Navigation Builder', 'custom', Navigation, 'content', ['Content Management']),
  t('/content/footer', 'Footer Builder', 'custom', Layout, 'content', ['Content Management']),
  t('/content/announcements', 'Announcements', 'list-editor', Bell, 'content', ['Content Management']),
  t('/content/media', 'Media Library', 'custom', Image, 'content', ['Content Management']),
  t('/content/ad-banners', 'Ad Banners', 'list-editor', Image, 'content', ['Content Management']),

  /* ===== API MANAGEMENT ===== */
  t('/api-management', 'API Management', 'table', Plug, 'api', ['API Management']),
  t('/api-management/consumers', 'Consumers', 'table', Users, 'api', ['API Management']),
  t('/api-management/keys', 'API Keys', 'table', Key, 'api', ['API Management']),
  t('/api-management/usage', 'API Usage Monitor', 'custom', Gauge, 'api', ['API Management']),
  t('/api-management/analytics', 'API Analytics', 'report', BarChart3, 'api', ['API Management']),
  t('/api-management/webhooks', 'Webhooks', 'table', Webhook, 'api', ['API Management']),
  t('/api-management/logs', 'API Logs', 'table', FileText, 'api', ['API Management']),
  t('/api-management/oauth-apps', 'OAuth Apps', 'table', Key, 'api', ['API Management']),
  t('/api-management/rate-limits', 'Rate Limits', 'settings', Gauge, 'api', ['API Management']),
  t('/api-management/sdks', 'SDKs', 'table', Code, 'api', ['API Management']),

  /* ===== SYSTEM ===== */
  t('/system/logs', 'System Logs', 'table', FileText, 'system', ['System']),
  t('/system/metrics', 'Metrics', 'report', Activity, 'system', ['System']),
  t('/system/performance', 'Performance', 'report', Gauge, 'system', ['System']),
  t('/system/backups', 'Backups', 'table', HardDrive, 'system', ['System']),
  t('/system/scheduler', 'Scheduler', 'table', Clock, 'system', ['System']),
  t('/system/diagnostics', 'System Diagnostics', 'custom', Stethoscope, 'system', ['System']),
  t('/system/versions', 'Version Management', 'settings', RefreshCw, 'system', ['System']),
  t('/system/maintenance', 'Maintenance Mode', 'settings', ServerCog, 'system', ['System']),
  t('/system/disaster-recovery', 'Disaster Recovery', 'settings', ServerCog, 'system', ['System']),

  /* ===== Settings — Integrations ===== */
  t('/settings/integrations/payments', 'Payment Providers', 'settings', CreditCard, 'api', ['API Management', 'Integrations']),
  t('/settings/integrations/calendar', 'Calendar Integrations', 'settings', CalendarCheck, 'api', ['API Management', 'Integrations']),
  t('/settings/integrations/communication', 'Communication Integrations', 'settings', MessageSquare, 'api', ['API Management', 'Integrations']),

  /* ===== Settings — Call Center ===== */
  t('/settings/callcenter/extensions', 'Phone Extensions', 'table', Phone, 'callcenter', ['Reservation Services', 'Call Center', 'Settings']),
  t('/settings/callcenter/ring-groups', 'Ring Groups', 'table', Phone, 'callcenter', ['Reservation Services', 'Call Center', 'Settings']),
  t('/settings/callcenter/ivr', 'IVR Menus', 'table', Phone, 'callcenter', ['Reservation Services', 'Call Center', 'Settings']),
  t('/settings/callcenter/routing', 'Call Routing', 'table', Phone, 'callcenter', ['Reservation Services', 'Call Center', 'Settings']),

  /* ===== Settings — Messaging ===== */
  t('/settings/messaging/templates', 'Message Templates', 'list-editor', MessageSquare, 'messaging', ['Reservation Services', 'Messaging', 'Settings']),
  t('/settings/messaging/auto-responses', 'Auto Responses', 'list-editor', MessageSquare, 'messaging', ['Reservation Services', 'Messaging', 'Settings']),

  /* ===== Settings — Trust ===== */
  t('/settings/trust/risk-rules', 'Risk Rules', 'table', ShieldAlert, 'trust', ['Marketplace', 'Trust', 'Settings']),

  /* ===== Settings — Marketing ===== */
  t('/settings/marketing/discount-rules', 'Discount Rules', 'table', Percent, 'marketing', ['Marketplace', 'Marketing', 'Settings']),

  /* ===== Settings — Commerce ===== */
  t('/settings/commerce/taxes', 'Tax Configuration', 'settings', Receipt, 'commerce', ['Marketplace', 'Commerce', 'Settings']),
  t('/settings/commerce/commissions', 'Commission Rules', 'settings', Percent, 'commerce', ['Marketplace', 'Commerce', 'Settings']),

  /* ===== Settings — Data Governance ===== */
  t('/settings/data-governance', 'Data Governance', 'settings', Database, 'governance', ['Platform Governance', 'Vendor Rules', 'Data Governance']),

  /* ===== Content — Landing Pages & Banners ===== */
  t('/content/landing-pages', 'Landing Pages', 'list-editor', Layout, 'content', ['Content Management', 'Marketing']),
  t('/content/banners', 'Banners', 'list-editor', Image, 'content', ['Content Management', 'Marketing']),

  /* ===== Content — Page editors ===== */
  t('/content/pages/destinations', 'Destinations Editor', 'custom', FileText, 'content', ['Content Management', 'Pages', 'Travel Engine']),
  t('/content/pages/browse', 'Browse Editor', 'custom', FileText, 'content', ['Content Management', 'Pages', 'Ticketing Engine']),
  t('/content/pages/directory', 'Directory Editor', 'custom', FileText, 'content', ['Content Management', 'Pages', 'Directory Engine']),
  t('/content/pages/services', 'Services Page', 'custom', FileText, 'content', ['Content Management', 'Pages', 'Surface Pages']),
  t('/content/pages/plan', 'Plan Page', 'custom', FileText, 'content', ['Content Management', 'Pages', 'Surface Pages']),
  t('/content/pages/things-to-do', 'Things to Do Page', 'custom', FileText, 'content', ['Content Management', 'Pages', 'Surface Pages']),
  t('/content/pages/food-drink', 'Food & Drink Page', 'custom', FileText, 'content', ['Content Management', 'Pages', 'Surface Pages']),
  t('/content/pages/live-shows', 'Live Shows Page', 'custom', FileText, 'content', ['Content Management', 'Pages', 'Surface Pages']),
  t('/content/pages/travel', 'Travel Page', 'custom', FileText, 'content', ['Content Management', 'Pages', 'Surface Pages']),
  t('/content/pages/party', 'Party Page', 'custom', FileText, 'content', ['Content Management', 'Pages', 'Surface Pages']),
  t('/content/pages/spaces', 'Spaces Page', 'custom', FileText, 'content', ['Content Management', 'Pages', 'Surface Pages']),
  t('/content/pages/vendors', 'Vendors Page', 'custom', FileText, 'content', ['Content Management', 'Pages', 'Surface Pages']),
  t('/content/pages/compose', 'Compose Page', 'custom', FileText, 'content', ['Content Management', 'Pages', 'Surface Pages']),
  t('/content/pages/concierge', 'Concierge Page', 'custom', FileText, 'content', ['Content Management', 'Pages', 'Surface Pages']),
];

export const routeMap: Record<string, RouteMeta> = Object.fromEntries(routes.map((r) => [r.path, r]));

export function findRoute(path: string): RouteMeta | undefined {
  const clean = path.split('?')[0];
  return routeMap[clean];
}
