import { useState, useMemo } from 'react';
import {
  Tag, Star, Sparkles, CalendarDays, Home, Briefcase, Settings2,
  Layers, Plus, Search, GripVertical, MoreVertical, ArrowRight, Folder,
} from 'lucide-react';
import { Card, CardHeader, CardBody, Badge, Button, PageHeader, Toggle, SegmentedControl, ProgressBar } from '../components/ui';
import type { LucideIcon } from 'lucide-react';

/* Each taxonomy type has its own data shape, columns, and config */
type TaxonomyType = {
  id: string;
  label: string;
  singular: string;
  icon: LucideIcon;
  description: string;
  columns: { key: string; label: string }[];
  items: Record<string, any>[];
  config: { label: string; type: 'toggle' | 'select' | 'text' | 'number'; value: any; description?: string; options?: string[] }[];
};

const taxonomyTypes: TaxonomyType[] = [
  {
    id: 'categories',
    label: 'Categories',
    singular: 'Category',
    icon: Folder,
    description: 'Top-level classification for all marketplace listings. Categories are the primary taxonomy used in search, navigation, and filtering.',
    columns: [
      { key: 'name', label: 'Category Name' },
      { key: 'listings', label: 'Listings' },
      { key: 'subcategories', label: 'Sub-Categories' },
      { key: 'featured', label: 'Featured' },
      { key: 'status', label: 'Status' },
      { key: 'sort', label: 'Sort Order' },
    ],
    items: [
      { name: 'Vacation Rentals', listings: 4829, subcategories: 12, featured: true, status: 'active', sort: 1 },
      { name: 'Hotels & Resorts', listings: 1847, subcategories: 8, featured: true, status: 'active', sort: 2 },
      { name: 'Event Spaces', listings: 924, subcategories: 6, featured: false, status: 'active', sort: 3 },
      { name: 'Experiences', listings: 1284, subcategories: 9, featured: true, status: 'active', sort: 4 },
      { name: 'Tickets & Events', listings: 2471, subcategories: 14, featured: true, status: 'active', sort: 5 },
      { name: 'Services', listings: 628, subcategories: 4, featured: false, status: 'active', sort: 6 },
      { name: 'Dining & Nightlife', listings: 412, subcategories: 7, featured: false, status: 'pending', sort: 7 },
      { name: 'Travel Packages', listings: 189, subcategories: 3, featured: false, status: 'draft', sort: 8 },
    ],
    config: [
      { label: 'Allow Nested Categories', type: 'toggle', value: true, description: 'Enable sub-categories up to 3 levels deep' },
      { label: 'Max Depth', type: 'select', value: '3', options: ['1', '2', '3', '4'], description: 'Maximum nesting level for categories' },
      { label: 'Require Image', type: 'toggle', value: true, description: 'Each category must have a display image' },
      { label: 'Auto-generate Slug', type: 'toggle', value: true, description: 'Create URL slug from category name' },
      { label: 'Default Sort', type: 'select', value: 'Alphabetical', options: ['Alphabetical', 'Listings Count', 'Manual Order', 'Recently Added'] },
    ],
  },
  {
    id: 'tags',
    label: 'Tags',
    singular: 'Tag',
    icon: Tag,
    description: 'Free-form labels applied to listings for granular search and filtering. Tags are cross-cutting — a listing can have multiple tags across categories.',
    columns: [
      { key: 'name', label: 'Tag' },
      { key: 'usage', label: 'Times Used' },
      { key: 'category', label: 'Suggested Category' },
      { key: 'synonyms', label: 'Synonyms' },
      { key: 'status', label: 'Status' },
    ],
    items: [
      { name: 'pet-friendly', usage: 1247, category: 'Vacation Rentals', synonyms: 'pets allowed, dog friendly', status: 'active' },
      { name: 'ocean-view', usage: 892, category: 'Vacation Rentals', synonyms: 'sea view, beachfront view', status: 'active' },
      { name: 'wheelchair-accessible', usage: 438, category: 'All', synonyms: 'accessible, ADA compliant', status: 'active' },
      { name: 'self-check-in', usage: 2184, category: 'Vacation Rentals', synonyms: 'keyless entry, smart lock', status: 'active' },
      { name: 'luxury', usage: 1629, category: 'Hotels & Resorts', synonyms: 'premium, high-end, upscale', status: 'active' },
      { name: 'budget', usage: 847, category: 'All', synonyms: 'affordable, economy, cheap', status: 'active' },
      { name: 'family-friendly', usage: 1924, category: 'All', synonyms: 'kid friendly, children welcome', status: 'active' },
      { name: 'wifi', usage: 3847, category: 'All', synonyms: 'internet, high-speed internet', status: 'active' },
      { name: 'pool', usage: 1294, category: 'Hotels & Resorts', synonyms: 'swimming pool, indoor pool', status: 'active' },
      { name: 'instant-book', usage: 2419, category: 'All', synonyms: 'immediate booking, no approval', status: 'active' },
      { name: 'long-term-stay', usage: 342, category: 'Vacation Rentals', synonyms: 'monthly, extended stay', status: 'pending' },
      { name: 'eco-friendly', usage: 218, category: 'All', synonyms: 'sustainable, green, solar', status: 'active' },
    ],
    config: [
      { label: 'Allow User-Generated Tags', type: 'toggle', value: true, description: 'Vendors can create new tags when listing' },
      { label: 'Require Approval', type: 'toggle', value: false, description: 'New user-generated tags require admin approval' },
      { label: 'Auto-Suggest Synonyms', type: 'toggle', value: true, description: 'AI suggests synonyms when creating tags' },
      { label: 'Max Tags Per Listing', type: 'number', value: 15, description: 'Maximum tags a single listing can have' },
      { label: 'Tag Format', type: 'select', value: 'kebab-case', options: ['kebab-case', 'camelCase', 'snake_case', 'Title Case'] },
    ],
  },
  {
    id: 'amenities',
    label: 'Amenities',
    singular: 'Amenity',
    icon: Sparkles,
    description: 'Physical features and services available at a property. Amenities are structured with icons and grouped into categories for the booking flow.',
    columns: [
      { key: 'name', label: 'Amenity' },
      { key: 'group', label: 'Group' },
      { key: 'icon', label: 'Icon' },
      { key: 'listings', label: 'Listings With This' },
      { key: 'filterable', label: 'Searchable' },
      { key: 'status', label: 'Status' },
    ],
    items: [
      { name: 'WiFi', group: 'Connectivity', icon: 'wifi', listings: 3847, filterable: true, status: 'active' },
      { name: 'Air Conditioning', group: 'Climate', icon: 'wind', listings: 2941, filterable: true, status: 'active' },
      { name: 'Heating', group: 'Climate', icon: 'flame', listings: 2814, filterable: true, status: 'active' },
      { name: 'Kitchen', group: 'Facilities', icon: 'chef-hat', listings: 2418, filterable: true, status: 'active' },
      { name: 'Pool', group: 'Recreation', icon: 'waves', listings: 1294, filterable: true, status: 'active' },
      { name: 'Hot Tub', group: 'Recreation', icon: 'droplet', listings: 628, filterable: true, status: 'active' },
      { name: 'Free Parking', group: 'Access', icon: 'car', listings: 2184, filterable: true, status: 'active' },
      { name: 'Gym / Fitness', group: 'Recreation', icon: 'dumbbell', listings: 412, filterable: true, status: 'active' },
      { name: 'Washer / Dryer', group: 'Facilities', icon: 'washing-machine', listings: 1924, filterable: true, status: 'active' },
      { name: 'Fireplace', group: 'Climate', icon: 'flame', listings: 847, filterable: false, status: 'active' },
      { name: 'BBQ Grill', group: 'Outdoor', icon: 'flame', listings: 1294, filterable: true, status: 'active' },
      { name: 'Workspace', group: 'Facilities', icon: 'briefcase', listings: 684, filterable: true, status: 'pending' },
      { name: 'EV Charging', group: 'Access', icon: 'zap', listings: 142, filterable: true, status: 'active' },
    ],
    config: [
      { label: 'Group Display', type: 'select', value: 'By Category', options: ['By Category', 'Flat List', 'By Popularity'] },
      { label: 'Show Icons in Search', type: 'toggle', value: true, description: 'Display amenity icons in search filter sidebar' },
      { label: 'Allow Custom Amenities', type: 'toggle', value: false, description: 'Vendors can define amenities not in the standard list' },
      { label: 'Required on Listing', type: 'toggle', value: true, description: 'At least 3 amenities required per listing' },
      { label: 'Minimum Amenities', type: 'number', value: 3, description: 'Minimum amenities a listing must have' },
    ],
  },
  {
    id: 'features',
    label: 'Features',
    singular: 'Feature',
    icon: Star,
    description: 'Functional capabilities and attributes that differentiate listings. Features are more specific than amenities and used for comparison views.',
    columns: [
      { key: 'name', label: 'Feature' },
      { key: 'category', label: 'Applies To' },
      { key: 'type', label: 'Data Type' },
      { key: 'unit', label: 'Unit' },
      { key: 'usage', label: 'Listings' },
      { key: 'status', label: 'Status' },
    ],
    items: [
      { name: 'Max Guests', category: 'All', type: 'number', unit: 'guests', usage: 8429, status: 'active' },
      { name: 'Bedrooms', category: 'All', type: 'number', unit: 'rooms', usage: 8429, status: 'active' },
      { name: 'Bathrooms', category: 'All', type: 'number', unit: 'baths', usage: 8429, status: 'active' },
      { name: 'Square Footage', category: 'Vacation Rentals', type: 'number', unit: 'sqft', usage: 4829, status: 'active' },
      { name: 'Star Rating', category: 'Hotels & Resorts', type: 'select', unit: 'stars', usage: 1847, status: 'active' },
      { name: 'Capacity', category: 'Event Spaces', type: 'number', unit: 'people', usage: 924, status: 'active' },
      { name: 'Duration', category: 'Experiences', type: 'select', unit: 'hours', usage: 1284, status: 'active' },
      { name: 'Age Restriction', category: 'Tickets & Events', type: 'select', unit: 'years', usage: 2471, status: 'active' },
      { name: 'Pet Policy', category: 'All', type: 'select', unit: '—', usage: 8429, status: 'active' },
      { name: 'Smoking Policy', category: 'All', type: 'select', unit: '—', usage: 8429, status: 'active' },
      { name: 'Check-in Time', category: 'Vacation Rentals', type: 'select', unit: 'time', usage: 4829, status: 'active' },
      { name: 'Check-out Time', category: 'Vacation Rentals', type: 'select', unit: 'time', usage: 4829, status: 'active' },
    ],
    config: [
      { label: 'Display in Comparison View', type: 'toggle', value: true, description: 'Show features side-by-side when comparing listings' },
      { label: 'Required Features', type: 'select', value: 'Max Guests, Bedrooms', options: ['Max Guests, Bedrooms', 'All', 'None'] },
      { label: 'Allow Decimal Values', type: 'toggle', value: false, description: 'Permit decimal values for numeric features' },
      { label: 'Auto-Generate from Amenities', type: 'toggle', value: true, description: 'Derive features from selected amenities automatically' },
    ],
  },
  {
    id: 'event-types',
    label: 'Event Types',
    singular: 'Event Type',
    icon: CalendarDays,
    description: 'Categorization for ticketed events and experiences. Event types drive the ticketing engine browse flow and pricing templates.',
    columns: [
      { key: 'name', label: 'Event Type' },
      { key: 'parent', label: 'Parent Category' },
      { key: 'events', label: 'Active Events' },
      { key: 'defaultDuration', label: 'Default Duration' },
      { key: 'pricingModel', label: 'Pricing Model' },
      { key: 'status', label: 'Status' },
    ],
    items: [
      { name: 'Concert', parent: 'Live Shows', events: 284, defaultDuration: '3 hours', pricingModel: 'Tiered', status: 'active' },
      { name: 'Festival', parent: 'Live Shows', events: 47, defaultDuration: '8 hours', pricingModel: 'Tiered', status: 'active' },
      { name: 'Theater', parent: 'Live Shows', events: 142, defaultDuration: '2.5 hours', pricingModel: 'Fixed', status: 'active' },
      { name: 'Comedy Show', parent: 'Live Shows', events: 89, defaultDuration: '1.5 hours', pricingModel: 'Fixed', status: 'active' },
      { name: 'Sports Event', parent: 'Tickets & Events', events: 218, defaultDuration: 'Varies', pricingModel: 'Tiered', status: 'active' },
      { name: 'Conference', parent: 'Tickets & Events', events: 34, defaultDuration: '8 hours', pricingModel: 'Tiered', status: 'active' },
      { name: 'Workshop', parent: 'Experiences', events: 128, defaultDuration: '2 hours', pricingModel: 'Fixed', status: 'active' },
      { name: 'Tour', parent: 'Experiences', events: 384, defaultDuration: '3 hours', pricingModel: 'Fixed', status: 'active' },
      { name: 'Class', parent: 'Experiences', events: 92, defaultDuration: '1.5 hours', pricingModel: 'Fixed', status: 'active' },
      { name: 'Private Event', parent: 'Event Spaces', events: 67, defaultDuration: 'Varies', pricingModel: 'Quote', status: 'pending' },
    ],
    config: [
      { label: 'Default Pricing Model', type: 'select', value: 'Tiered', options: ['Fixed', 'Tiered', 'Quote', 'Dynamic'] },
      { label: 'Allow Custom Duration', type: 'toggle', value: true, description: 'Organizers can override default duration' },
      { label: 'Require Cover Image', type: 'toggle', value: true, description: 'Each event type must have a default cover image' },
      { label: 'Enable Early Bird Pricing', type: 'toggle', value: true, description: 'Support early-bird discount tiers per event type' },
    ],
  },
  {
    id: 'listing-types',
    label: 'Listing Types',
    singular: 'Listing Type',
    icon: Home,
    description: 'Property and space types that determine the listing form fields, pricing structure, and booking flow. Each type has its own attribute set.',
    columns: [
      { key: 'name', label: 'Listing Type' },
      { key: 'bookingModel', label: 'Booking Model' },
      { key: 'template', label: 'Attribute Template' },
      { key: 'listings', label: 'Active Listings' },
      { key: 'requiresApproval', label: 'Approval Required' },
      { key: 'status', label: 'Status' },
    ],
    items: [
      { name: 'Entire Home', bookingModel: 'Nightly', template: 'Standard Property', listings: 3847, requiresApproval: true, status: 'active' },
      { name: 'Private Room', bookingModel: 'Nightly', template: 'Room', listings: 1294, requiresApproval: true, status: 'active' },
      { name: 'Shared Room', bookingModel: 'Nightly', template: 'Room', listings: 248, requiresApproval: true, status: 'active' },
      { name: 'Hotel Room', bookingModel: 'Nightly', template: 'Hotel', listings: 1847, requiresApproval: false, status: 'active' },
      { name: 'Serviced Apartment', bookingModel: 'Nightly', template: 'Standard Property', listings: 412, requiresApproval: true, status: 'active' },
      { name: 'Event Venue', bookingModel: 'Hourly', template: 'Event Space', listings: 628, requiresApproval: true, status: 'active' },
      { name: 'Meeting Room', bookingModel: 'Hourly', template: 'Meeting Space', listings: 218, requiresApproval: false, status: 'active' },
      { name: 'Experience', bookingModel: 'Fixed Schedule', template: 'Experience', listings: 1284, requiresApproval: true, status: 'active' },
      { name: 'Service', bookingModel: 'Quote', template: 'Service', listings: 628, requiresApproval: true, status: 'active' },
      { name: 'Ticket', bookingModel: 'Seat Selection', template: 'Ticket', listings: 2471, requiresApproval: false, status: 'active' },
    ],
    config: [
      { label: 'Default Booking Model', type: 'select', value: 'Nightly', options: ['Nightly', 'Hourly', 'Fixed Schedule', 'Quote', 'Seat Selection'] },
      { label: 'Auto-Assign Template', type: 'toggle', value: true, description: 'Automatically assign attribute template based on listing type' },
      { label: 'Allow Type Change', type: 'toggle', value: false, description: 'Allow vendors to change listing type after creation' },
      { label: 'Require Photos', type: 'toggle', value: true, description: 'Minimum 5 photos required per listing' },
    ],
  },
  {
    id: 'service-types',
    label: 'Service Types',
    singular: 'Service Type',
    icon: Briefcase,
    description: 'Categories for service-based offerings (not spaces or tickets). Service types define pricing structure, provider requirements, and scheduling rules.',
    columns: [
      { key: 'name', label: 'Service Type' },
      { key: 'delivery', label: 'Delivery Method' },
      { key: 'pricing', label: 'Pricing Structure' },
      { key: 'providers', label: 'Active Providers' },
      { key: 'leadTime', label: 'Min Lead Time' },
      { key: 'status', label: 'Status' },
    ],
    items: [
      { name: 'Cleaning Service', delivery: 'On-site', pricing: 'Flat Rate', providers: 248, leadTime: '24 hours', status: 'active' },
      { name: 'Concierge Service', delivery: 'On-site', pricing: 'Hourly', providers: 142, leadTime: '2 hours', status: 'active' },
      { name: 'Chef / Catering', delivery: 'On-site', pricing: 'Per Person', providers: 89, leadTime: '48 hours', status: 'active' },
      { name: 'Photography', delivery: 'On-site', pricing: 'Package', providers: 184, leadTime: '72 hours', status: 'active' },
      { name: 'Transportation', delivery: 'Off-site', pricing: 'Distance Based', providers: 218, leadTime: '1 hour', status: 'active' },
      { name: 'Tour Guide', delivery: 'On-site', pricing: 'Per Person', providers: 92, leadTime: '4 hours', status: 'active' },
      { name: 'Event Planning', delivery: 'Remote / On-site', pricing: 'Quote', providers: 47, leadTime: '7 days', status: 'active' },
      { name: 'Maintenance / Repair', delivery: 'On-site', pricing: 'Quote', providers: 128, leadTime: '24 hours', status: 'active' },
      { name: 'Spa / Wellness', delivery: 'On-site', pricing: 'Per Session', providers: 64, leadTime: '2 hours', status: 'pending' },
      { name: 'Luggage Storage', delivery: 'On-site', pricing: 'Per Day', providers: 34, leadTime: 'No lead time', status: 'active' },
    ],
    config: [
      { label: 'Default Pricing Structure', type: 'select', value: 'Flat Rate', options: ['Flat Rate', 'Hourly', 'Per Person', 'Package', 'Quote', 'Distance Based', 'Per Session', 'Per Day'] },
      { label: 'Require Provider Verification', type: 'toggle', value: true, description: 'Service providers must pass identity and business verification' },
      { label: 'Allow Instant Booking', type: 'toggle', value: false, description: 'Services can be booked without provider confirmation' },
      { label: 'Cancellation Window', type: 'select', value: '24 hours', options: ['2 hours', '4 hours', '24 hours', '48 hours', '72 hours'] },
    ],
  },
  {
    id: 'custom-attributes',
    label: 'Custom Attributes',
    singular: 'Custom Attribute',
    icon: Settings2,
    description: 'Custom fields that extend the standard attribute set. Used to capture specialized data per listing type, category, or tenant.',
    columns: [
      { key: 'name', label: 'Attribute Name' },
      { key: 'appliesTo', label: 'Applies To' },
      { key: 'dataType', label: 'Data Type' },
      { key: 'required', label: 'Required' },
      { key: 'searchable', label: 'Searchable' },
      { key: 'status', label: 'Status' },
    ],
    items: [
      { name: 'License Number', appliesTo: 'Vacation Rentals', dataType: 'text', required: true, searchable: false, status: 'active' },
      { name: 'Property Type', appliesTo: 'Vacation Rentals', dataType: 'select', required: true, searchable: true, status: 'active' },
      { name: 'Minimum Stay', appliesTo: 'Vacation Rentals', dataType: 'number', required: true, searchable: true, status: 'active' },
      { name: 'Event Capacity', appliesTo: 'Event Spaces', dataType: 'number', required: true, searchable: true, status: 'active' },
      { name: 'Alcohol License', appliesTo: 'Event Spaces', dataType: 'boolean', required: false, searchable: true, status: 'active' },
      { name: 'Age Requirement', appliesTo: 'Tickets & Events', dataType: 'number', required: false, searchable: true, status: 'active' },
      { name: 'Language Offered', appliesTo: 'Experiences', dataType: 'multiselect', required: true, searchable: true, status: 'active' },
      { name: 'Insurance Required', appliesTo: 'Services', dataType: 'boolean', required: true, searchable: false, status: 'active' },
      { name: 'Service Area Radius', appliesTo: 'Services', dataType: 'number', required: false, searchable: true, status: 'active' },
      { name: 'Cancellation Policy', appliesTo: 'All', dataType: 'select', required: true, searchable: false, status: 'active' },
      { name: 'Guest Verification', appliesTo: 'All', dataType: 'boolean', required: false, searchable: false, status: 'pending' },
      { name: 'Smart Lock Code', appliesTo: 'Vacation Rentals', dataType: 'text', required: false, searchable: false, status: 'draft' },
    ],
    config: [
      { label: 'Allow Tenant-Specific Attributes', type: 'toggle', value: true, description: 'Tenants can create attributes unique to their instance' },
      { label: 'Default Data Type', type: 'select', value: 'text', options: ['text', 'number', 'boolean', 'select', 'multiselect', 'date'] },
      { label: 'Max Attributes Per Listing Type', type: 'number', value: 50, description: 'Maximum custom attributes per listing type' },
      { label: 'Inherit from Parent', type: 'toggle', value: true, description: 'Child categories inherit parent attributes' },
    ],
  },
  {
    id: 'attribute-templates',
    label: 'Attribute Templates',
    singular: 'Attribute Template',
    icon: Layers,
    description: 'Pre-configured sets of attributes that can be applied to listing types. Templates speed up onboarding and ensure consistency.',
    columns: [
      { key: 'name', label: 'Template Name' },
      { key: 'listingType', label: 'Assigned Listing Type' },
      { key: 'attributes', label: 'Attributes' },
      { key: 'required', label: 'Required Fields' },
      { key: 'usage', label: 'Listings Using' },
      { key: 'status', label: 'Status' },
    ],
    items: [
      { name: 'Standard Property', listingType: 'Entire Home', attributes: 24, required: 12, usage: 3847, status: 'active' },
      { name: 'Room', listingType: 'Private Room', attributes: 18, required: 8, usage: 1294, status: 'active' },
      { name: 'Hotel', listingType: 'Hotel Room', attributes: 22, required: 10, usage: 1847, status: 'active' },
      { name: 'Event Space', listingType: 'Event Venue', attributes: 28, required: 15, usage: 628, status: 'active' },
      { name: 'Meeting Space', listingType: 'Meeting Room', attributes: 14, required: 6, usage: 218, status: 'active' },
      { name: 'Experience', listingType: 'Experience', attributes: 20, required: 10, usage: 1284, status: 'active' },
      { name: 'Service', listingType: 'Service', attributes: 16, required: 7, usage: 628, status: 'active' },
      { name: 'Ticket', listingType: 'Ticket', attributes: 12, required: 6, usage: 2471, status: 'active' },
      { name: 'Luxury Property', listingType: 'Entire Home', attributes: 32, required: 18, usage: 0, status: 'draft' },
      { name: 'Budget Stay', listingType: 'Private Room', attributes: 10, required: 4, usage: 0, status: 'draft' },
    ],
    config: [
      { label: 'Auto-Assign on Listing Creation', type: 'toggle', value: true, description: 'Automatically assign template based on listing type' },
      { label: 'Allow Template Override', type: 'toggle', value: true, description: 'Vendors can add optional attributes beyond the template' },
      { label: 'Lock Required Fields', type: 'toggle', value: true, description: 'Required fields from template cannot be removed by vendor' },
      { label: 'Template Versioning', type: 'toggle', value: true, description: 'Track changes to templates over time' },
    ],
  },
];

export function TaxonomyPage({ activeType, onNavigate }: { activeType: string; onNavigate: (path: string) => void }) {
  const currentType = taxonomyTypes.find((t) => t.id === activeType) ?? taxonomyTypes[0];
  const [search, setSearch] = useState('');
  const [, setSelectedItem] = useState<string | null>(null);
  const [view, setView] = useState<'list' | 'grid'>('list');

  const filteredItems = useMemo(() => {
    if (!search) return currentType.items;
    const q = search.toLowerCase();
    return currentType.items.filter((item) =>
      Object.values(item).some((v) => String(v).toLowerCase().includes(q))
    );
  }, [currentType, search]);


  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Taxonomy"
        subtitle="Manage categories, tags, amenities, features, and custom attributes that structure your marketplace"
        icon={Tag}
        breadcrumbs={[{ label: 'Marketplace' }, { label: 'Taxonomy' }, { label: currentType.label }]}
        actions={<Button variant="primary" icon={Plus}>New {currentType.singular}</Button>}
      />

      {/* Type switcher — horizontal tabs that swap in place */}
      <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide border-b border-outline-variant">
        {taxonomyTypes.map((t) => {
          const Icon = t.icon;
          const isActive = t.id === activeType;
          return (
            <button
              key={t.id}
              onClick={() => onNavigate(`/settings/taxonomy/${t.id}`)}
              className={`flex items-center gap-2 px-4 py-2.5 text-body-md text-body-md whitespace-nowrap transition-all border-b-2 -mb-px ${
                isActive
                  ? 'border-primary text-primary font-semibold bg-secondary-container/20'
                  : 'border-transparent text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'
              }`}
            >
              <Icon className="w-4 h-4" />
              {t.label}
              <span className={`text-label-sm text-label-sm px-1.5 py-0.5 rounded-full ${
                isActive ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-on-surface-variant'
              }`}>
                {t.items.length}
              </span>
            </button>
          );
        })}
      </div>

      {/* Description bar for the active type */}
      <div className="flex items-start gap-3 p-4 rounded-xl bg-secondary-container/20 border border-secondary-container/40">
        <div className="w-10 h-10 rounded-lg bg-secondary-container/60 flex items-center justify-center shrink-0">
          <currentType.icon className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1">
          <h2 className="text-title-md text-title-md text-on-surface">{currentType.label}</h2>
          <p className="text-body-sm text-body-sm text-on-surface-variant mt-0.5">{currentType.description}</p>
        </div>
        <div className="flex items-center gap-4 shrink-0">
          <div className="text-right">
            <div className="text-label-sm text-label-sm text-on-surface-variant">Total</div>
            <div className="text-headline-md text-headline-md text-on-surface tabular-nums">{currentType.items.length}</div>
          </div>
          <div className="text-right">
            <div className="text-label-sm text-label-sm text-on-surface-variant">Active</div>
            <div className="text-headline-md text-headline-md text-success tabular-nums">
              {currentType.items.filter((i) => i.status === 'active').length}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Main: item table/list */}
        <div className="lg:col-span-3 space-y-4">
          {/* Toolbar */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative flex-1 min-w-[200px] max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={`Search ${currentType.label.toLowerCase()}…`}
                className="input pl-9 h-9"
              />
            </div>
            <SegmentedControl
              value={view}
              onChange={setView}
              options={[
                { value: 'list', label: 'List' },
                { value: 'grid', label: 'Grid' },
              ]}
            />
            <Button variant="secondary" size="sm" icon={ArrowRight}>Reorder</Button>
          </div>

          {/* List view */}
          {view === 'list' && (
            <Card>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-outline-variant">
                    <tr>
                      <th className="w-10 px-3 py-3"><GripVertical className="w-4 h-4 text-outline" /></th>
                      {currentType.columns.map((col) => (
                        <th key={col.key} className="px-5 py-3 text-left text-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                          {col.label}
                        </th>
                      ))}
                      <th className="w-10"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredItems.map((item, idx) => (
                      <tr
                        key={idx}
                        className="border-b border-outline-variant/50 last:border-0 hover:bg-surface-container-low transition-colors cursor-pointer"
                        onClick={() => setSelectedItem(String(idx))}
                      >
                        <td className="px-3 py-3.5"><GripVertical className="w-4 h-4 text-outline cursor-grab" /></td>
                        {currentType.columns.map((col) => (
                          <td key={col.key} className="px-5 py-3.5 text-body-sm text-body-sm">
                            {col.key === 'status' ? (
                              <Badge tone={item[col.key] === 'active' ? 'success' : item[col.key] === 'pending' ? 'warning' : 'neutral'} dot>
                                {item[col.key]}
                              </Badge>
                            ) : col.key === 'featured' || col.key === 'filterable' || col.key === 'requiresApproval' || col.key === 'required' || col.key === 'searchable' ? (
                              item[col.key] ? (
                                <Badge tone="success">Yes</Badge>
                              ) : (
                                <span className="text-on-surface-variant">No</span>
                              )
                            ) : col.key === 'name' ? (
                              <span className="text-on-surface font-medium">{item[col.key]}</span>
                            ) : typeof item[col.key] === 'number' ? (
                              <span className="tabular-nums text-on-surface">{item[col.key].toLocaleString()}</span>
                            ) : (
                              <span className="text-on-surface-variant">{item[col.key]}</span>
                            )}
                          </td>
                        ))}
                        <td className="px-3 py-3.5">
                          <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex items-center justify-between px-5 py-3 border-t border-outline-variant">
                <span className="text-body-sm text-body-sm text-on-surface-variant">
                  {filteredItems.length} of {currentType.items.length} {currentType.label.toLowerCase()}
                </span>
                <Button variant="ghost" size="sm" icon={Plus}>Load More</Button>
              </div>
            </Card>
          )}

          {/* Grid view */}
          {view === 'grid' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredItems.map((item, idx) => (
                <Card key={idx} hover className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 rounded-lg bg-secondary-container/40 flex items-center justify-center">
                        <currentType.icon className="w-4 h-4 text-primary" />
                      </div>
                      <span className="text-body-md text-body-md text-on-surface font-medium">{item.name}</span>
                    </div>
                    <Badge tone={item.status === 'active' ? 'success' : item.status === 'pending' ? 'warning' : 'neutral'} dot>
                      {item.status}
                    </Badge>
                  </div>
                  <div className="space-y-1.5">
                    {currentType.columns.slice(1, 4).map((col) => (
                      <div key={col.key} className="flex justify-between">
                        <span className="text-body-sm text-body-sm text-on-surface-variant">{col.label}</span>
                        <span className="text-body-sm text-body-sm text-on-surface">
                          {typeof item[col.key] === 'number' ? item[col.key].toLocaleString() : String(item[col.key])}
                        </span>
                      </div>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Right: Configuration panel for this taxonomy type */}
        <div className="space-y-4">
          <Card>
            <CardHeader
              title={`${currentType.singular} Settings`}
              subtitle={`Configuration for ${currentType.label}`}
              icon={Settings2}
            />
            <CardBody className="space-y-5">
              {currentType.config.map((field) => (
                <div key={field.label}>
                  {field.type === 'toggle' ? (
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex-1">
                        <div className="text-body-sm text-body-sm text-on-surface">{field.label}</div>
                        {field.description && (
                          <div className="text-body-sm text-body-sm text-on-surface-variant mt-0.5">{field.description}</div>
                        )}
                      </div>
                      <Toggle checked={field.value} onChange={() => {}} />
                    </div>
                  ) : field.type === 'select' ? (
                    <div>
                      <label className="text-label-md text-label-md text-on-surface-variant mb-1.5 block">{field.label}</label>
                      <select className="input" defaultValue={field.value}>
                        {field.options?.map((o) => <option key={o} value={o}>{o}</option>)}
                      </select>
                      {field.description && (
                        <p className="text-body-sm text-body-sm text-on-surface-variant mt-1">{field.description}</p>
                      )}
                    </div>
                  ) : field.type === 'number' ? (
                    <div>
                      <label className="text-label-md text-label-md text-on-surface-variant mb-1.5 block">{field.label}</label>
                      <input type="number" defaultValue={field.value} className="input" />
                      {field.description && (
                        <p className="text-body-sm text-body-sm text-on-surface-variant mt-1">{field.description}</p>
                      )}
                    </div>
                  ) : (
                    <div>
                      <label className="text-label-md text-label-md text-on-surface-variant mb-1.5 block">{field.label}</label>
                      <input type="text" defaultValue={field.value} className="input" />
                    </div>
                  )}
                </div>
              ))}
              <div className="pt-3 border-t border-outline-variant/40">
                <Button variant="primary" className="w-full">Save Configuration</Button>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Quick Stats" />
            <CardBody className="space-y-3">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-body-sm text-body-sm text-on-surface-variant">Active</span>
                  <span className="text-body-sm text-body-sm text-on-surface tabular-nums">
                    {currentType.items.filter((i) => i.status === 'active').length} / {currentType.items.length}
                  </span>
                </div>
                <ProgressBar
                  value={(currentType.items.filter((i) => i.status === 'active').length / currentType.items.length) * 100}
                  tone="success"
                />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-body-sm text-body-sm text-on-surface-variant">Pending</span>
                  <span className="text-body-sm text-body-sm text-on-surface tabular-nums">
                    {currentType.items.filter((i) => i.status === 'pending').length}
                  </span>
                </div>
                <ProgressBar
                  value={(currentType.items.filter((i) => i.status === 'pending').length / currentType.items.length) * 100}
                  tone="warning"
                />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-body-sm text-body-sm text-on-surface-variant">Draft</span>
                  <span className="text-body-sm text-body-sm text-on-surface tabular-nums">
                    {currentType.items.filter((i) => i.status === 'draft').length}
                  </span>
                </div>
                <ProgressBar
                  value={(currentType.items.filter((i) => i.status === 'draft').length / currentType.items.length) * 100}
                  tone="primary"
                />
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Related" />
            <CardBody className="space-y-2">
              {taxonomyTypes
                .filter((t) => t.id !== currentType.id)
                .slice(0, 4)
                .map((t) => (
                  <button
                    key={t.id}
                    onClick={() => onNavigate(`/settings/taxonomy/${t.id}`)}
                    className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-surface-container-low transition-colors text-left"
                  >
                    <t.icon className="w-4 h-4 text-on-surface-variant" />
                    <span className="text-body-sm text-body-sm text-on-surface flex-1">{t.label}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-on-surface-variant" />
                  </button>
                ))}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
