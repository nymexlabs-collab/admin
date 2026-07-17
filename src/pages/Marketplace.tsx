import { useState } from 'react';
import { Store, Plus, Search, Star, MapPin, MoreVertical, Upload, Download, Filter } from 'lucide-react';
import { Card, Badge, Button, StatCard, Table, THead, TH, TR, TD, SegmentedControl, PageHeader, Avatar } from '../components/ui';
import { listings } from '../data/mock';

const statusConfig: Record<string, { tone: 'success' | 'warning' | 'error' | 'neutral'; label: string }> = {
  active: { tone: 'success', label: 'Active' },
  pending: { tone: 'warning', label: 'Pending' },
  suspended: { tone: 'error', label: 'Suspended' },
  draft: { tone: 'neutral', label: 'Draft' },
};

export function ListingsPage() {
  const [status, setStatus] = useState<'all' | 'active' | 'pending' | 'suspended' | 'draft'>('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const filtered = listings.filter((l) => {
    if (status !== 'all' && l.status !== status) return false;
    if (search && !l.title.toLowerCase().includes(search.toLowerCase()) && !l.vendor.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Listings"
        subtitle="Manage marketplace listings, inventory, and approvals"
        icon={Store}
        breadcrumbs={[{ label: 'Marketplace' }, { label: 'Compliance' }, { label: 'Listings' }]}
        actions={
          <>
            <Button variant="secondary" icon={Upload}>Bulk Upload</Button>
            <Button variant="secondary" icon={Download}>Export</Button>
            <Button variant="primary" icon={Plus}>New Listing</Button>
          </>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Listings" value={listings.length} icon={Store} />
        <StatCard label="Active" value={listings.filter(l => l.status === 'active').length} icon={Store} delta="68% of total" deltaDirection="up" />
        <StatCard label="Pending Review" value={listings.filter(l => l.status === 'pending').length} icon={Filter} delta="Needs action" deltaDirection="flat" />
        <StatCard label="Avg Rating" value="4.6" icon={Star} delta="+0.2" deltaDirection="up" />
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search listings…" className="input pl-9 h-9" />
        </div>
        <SegmentedControl
          value={status}
          onChange={setStatus}
          options={[
            { value: 'all', label: 'All' },
            { value: 'active', label: 'Active' },
            { value: 'pending', label: 'Pending' },
            { value: 'suspended', label: 'Suspended' },
            { value: 'draft', label: 'Draft' },
          ]}
        />
        {selected.size > 0 && (
          <div className="flex items-center gap-2 ml-auto">
            <span className="font-body-sm text-body-sm text-on-surface-variant">{selected.size} selected</span>
            <Button variant="secondary" size="sm">Bulk Approve</Button>
            <Button variant="ghost" size="sm" onClick={() => setSelected(new Set())}>Clear</Button>
          </div>
        )}
      </div>

      {/* Table */}
      <Card>
        <Table>
          <THead>
            <TR>
              <TH className="w-10"><input type="checkbox" className="rounded border-outline" /></TH>
              <TH>Listing</TH>
              <TH>Vendor</TH>
              <TH>Location</TH>
              <TH>Price</TH>
              <TH>Status</TH>
              <TH>Rating</TH>
              <TH>Bookings</TH>
              <TH>Category</TH>
              <TH></TH>
            </TR>
          </THead>
          <tbody>
            {filtered.map((l) => (
              <TR key={l.id}>
                <TD>
                  <input
                    type="checkbox"
                    checked={selected.has(l.id)}
                    onChange={() => toggleSelect(l.id)}
                    className="rounded border-outline"
                  />
                </TD>
                <TD>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-secondary-container/40 flex items-center justify-center shrink-0">
                      <Store className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <div className="font-body-md text-body-md text-on-surface">{l.title}</div>
                      <div className="font-body-sm text-body-sm text-on-surface-variant">{l.id}</div>
                    </div>
                  </div>
                </TD>
                <TD><span className="font-body-sm text-body-sm text-on-surface">{l.vendor}</span></TD>
                <TD>
                  <span className="inline-flex items-center gap-1 font-body-sm text-body-sm text-on-surface-variant">
                    <MapPin className="w-3.5 h-3.5" />{l.city}
                  </span>
                </TD>
                <TD><span className="font-body-md text-body-md text-on-surface tabular-nums">${l.price}</span></TD>
                <TD><Badge tone={statusConfig[l.status].tone} dot>{statusConfig[l.status].label}</Badge></TD>
                <TD>
                  <span className="inline-flex items-center gap-1 font-body-sm text-body-sm text-on-surface tabular-nums">
                    <Star className="w-3.5 h-3.5 text-warning fill-warning" />{l.rating}
                  </span>
                </TD>
                <TD><span className="font-body-sm text-body-sm text-on-surface-variant tabular-nums">{l.bookings}</span></TD>
                <TD><Badge tone="neutral">{l.category}</Badge></TD>
                <TD><Button variant="ghost" size="icon"><MoreVertical className="w-4 h-4" /></Button></TD>
              </TR>
            ))}
          </tbody>
        </Table>
      </Card>
    </div>
  );
}

/* ---------- Orders ---------- */
import { orders } from '../data/mock';
import { ShoppingCart } from 'lucide-react';

const orderStatusConfig: Record<string, { tone: 'success' | 'warning' | 'error' | 'neutral' | 'info'; label: string }> = {
  completed: { tone: 'success', label: 'Completed' },
  processing: { tone: 'info', label: 'Processing' },
  pending: { tone: 'warning', label: 'Pending' },
  refunded: { tone: 'neutral', label: 'Refunded' },
  cancelled: { tone: 'error', label: 'Cancelled' },
};

export function OrdersPage() {
  const [search, setSearch] = useState('');

  const filtered = orders.filter((o) =>
    !search || o.id.toLowerCase().includes(search.toLowerCase()) || o.customer.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Orders"
        subtitle="Commerce orders across the marketplace"
        icon={ShoppingCart}
        breadcrumbs={[{ label: 'Commerce' }, { label: 'Orders' }]}
        actions={<Button variant="primary" icon={Download}>Export</Button>}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Orders" value={orders.length} icon={ShoppingCart} />
        <StatCard label="Completed" value={orders.filter(o => o.status === 'completed').length} icon={ShoppingCart} delta="72%" deltaDirection="up" />
        <StatCard label="Pending" value={orders.filter(o => o.status === 'pending').length} icon={ShoppingCart} />
        <StatCard label="Refunded" value={orders.filter(o => o.status === 'refunded').length} icon={ShoppingCart} delta="$2.4K" deltaDirection="down" />
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search orders…" className="input pl-9 h-9" />
        </div>
      </div>

      <Card>
        <Table>
          <THead>
            <TR>
              <TH>Order ID</TH>
              <TH>Customer</TH>
              <TH>Vendor</TH>
              <TH>Date</TH>
              <TH>Items</TH>
              <TH>Total</TH>
              <TH>Status</TH>
              <TH></TH>
            </TR>
          </THead>
          <tbody>
            {filtered.map((o) => (
              <TR key={o.id}>
                <TD><code className="font-body-sm text-body-sm text-on-surface">{o.id}</code></TD>
                <TD><span className="font-body-sm text-body-sm text-on-surface">{o.customer}</span></TD>
                <TD><span className="font-body-sm text-body-sm text-on-surface-variant">{o.vendor}</span></TD>
                <TD><span className="font-body-sm text-body-sm text-on-surface-variant tabular-nums">{o.date}</span></TD>
                <TD><span className="font-body-sm text-body-sm text-on-surface tabular-nums">{o.items}</span></TD>
                <TD><span className="font-body-md text-body-md text-on-surface tabular-nums">${o.total}</span></TD>
                <TD><Badge tone={orderStatusConfig[o.status].tone} dot>{orderStatusConfig[o.status].label}</Badge></TD>
                <TD><Button variant="ghost" size="icon"><MoreVertical className="w-4 h-4" /></Button></TD>
              </TR>
            ))}
          </tbody>
        </Table>
      </Card>
    </div>
  );
}

/* ---------- Users ---------- */
import { users } from '../data/mock';
import { Users as UsersIcon, ShieldCheck, ShieldAlert } from 'lucide-react';

const userRoleConfig: Record<string, { tone: 'primary' | 'info' | 'neutral' | 'warning'; label: string }> = {
  admin: { tone: 'primary', label: 'Admin' },
  vendor: { tone: 'info', label: 'Vendor' },
  customer: { tone: 'neutral', label: 'Customer' },
  support: { tone: 'warning', label: 'Support' },
};

const userStatusConfig: Record<string, { tone: 'success' | 'warning' | 'error'; label: string }> = {
  active: { tone: 'success', label: 'Active' },
  suspended: { tone: 'error', label: 'Suspended' },
  pending: { tone: 'warning', label: 'Pending' },
};

export function UsersPage() {
  const [role, setRole] = useState<'all' | 'admin' | 'vendor' | 'customer' | 'support'>('all');
  const [search, setSearch] = useState('');

  const filtered = users.filter((u) => {
    if (role !== 'all' && u.role !== role) return false;
    if (search && !u.name.toLowerCase().includes(search.toLowerCase()) && !u.email.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Users"
        subtitle="All platform users — customers, vendors, admins, and support staff"
        icon={UsersIcon}
        breadcrumbs={[{ label: 'Marketplace' }, { label: 'Users' }]}
        actions={<Button variant="primary" icon={Plus}>Add User</Button>}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Users" value={users.length} icon={UsersIcon} />
        <StatCard label="Vendors" value={users.filter(u => u.role === 'vendor').length} icon={Store} />
        <StatCard label="Verified" value={users.filter(u => u.verified).length} icon={ShieldCheck} delta="70%" deltaDirection="up" />
        <StatCard label="Suspended" value={users.filter(u => u.status === 'suspended').length} icon={ShieldAlert} />
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search users…" className="input pl-9 h-9" />
        </div>
        <SegmentedControl
          value={role}
          onChange={setRole}
          options={[
            { value: 'all', label: 'All' },
            { value: 'admin', label: 'Admins' },
            { value: 'vendor', label: 'Vendors' },
            { value: 'customer', label: 'Customers' },
            { value: 'support', label: 'Support' },
          ]}
        />
      </div>

      <Card>
        <Table>
          <THead>
            <TR>
              <TH>User</TH>
              <TH>Email</TH>
              <TH>Role</TH>
              <TH>Status</TH>
              <TH>Verified</TH>
              <TH>Joined</TH>
              <TH>Orders</TH>
              <TH></TH>
            </TR>
          </THead>
          <tbody>
            {filtered.map((u) => (
              <TR key={u.id}>
                <TD>
                  <div className="flex items-center gap-3">
                    <Avatar name={u.name} size="sm" />
                    <div>
                      <div className="font-body-md text-body-md text-on-surface">{u.name}</div>
                      <div className="font-body-sm text-body-sm text-on-surface-variant">{u.id}</div>
                    </div>
                  </div>
                </TD>
                <TD><span className="font-body-sm text-body-sm text-on-surface-variant">{u.email}</span></TD>
                <TD><Badge tone={userRoleConfig[u.role].tone}>{userRoleConfig[u.role].label}</Badge></TD>
                <TD><Badge tone={userStatusConfig[u.status].tone} dot>{userStatusConfig[u.status].label}</Badge></TD>
                <TD>
                  {u.verified ? (
                    <ShieldCheck className="w-4 h-4 text-success" />
                  ) : (
                    <ShieldAlert className="w-4 h-4 text-on-surface-variant" />
                  )}
                </TD>
                <TD><span className="font-body-sm text-body-sm text-on-surface-variant tabular-nums">{u.joined}</span></TD>
                <TD><span className="font-body-sm text-body-sm text-on-surface tabular-nums">{u.orders}</span></TD>
                <TD><Button variant="ghost" size="icon"><MoreVertical className="w-4 h-4" /></Button></TD>
              </TR>
            ))}
          </tbody>
        </Table>
      </Card>
    </div>
  );
}
