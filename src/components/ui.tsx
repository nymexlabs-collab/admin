import { type ReactNode, type ButtonHTMLAttributes } from 'react';
import { type LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';

/* ---------- Card ---------- */
export function Card({
  children,
  className = '',
  hover = false,
  onClick,
}: {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={`card ${hover ? 'card-hover' : ''} ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  title,
  subtitle,
  action,
  icon,
  className = '',
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  icon?: LucideIcon;
  className?: string;
}) {
  const Icon = icon;
  return (
    <div className={`flex items-start justify-between gap-3 px-5 pt-5 pb-3 ${className}`}>
      <div className="flex items-start gap-3 min-w-0">
        {Icon && (
          <div className="shrink-0 w-9 h-9 rounded-lg bg-secondary-container/50 flex items-center justify-center">
            <Icon className="w-[18px] h-[18px] text-primary" />
          </div>
        )}
        <div className="min-w-0">
          <h3 className="font-title-md text-title-md text-on-surface truncate">{title}</h3>
          {subtitle && <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5 truncate">{subtitle}</p>}
        </div>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export function CardBody({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`px-5 pb-5 ${className}`}>{children}</div>;
}

/* ---------- Badge ---------- */
export type BadgeTone = 'neutral' | 'primary' | 'success' | 'warning' | 'error' | 'info';
const badgeTones: Record<BadgeTone, string> = {
  neutral: 'bg-surface-container-high text-on-surface-variant',
  primary: 'bg-secondary-container text-on-secondary-fixed',
  success: 'bg-success-container text-success',
  warning: 'bg-warning-container text-warning',
  error: 'bg-error-container text-on-error-container',
  info: 'bg-tertiary-fixed text-on-tertiary-fixed',
};

export function Badge({
  children,
  tone = 'neutral',
  dot = false,
  className = '',
}: {
  children: ReactNode;
  tone?: BadgeTone;
  dot?: boolean;
  className?: string;
}) {
  const dotColors: Record<BadgeTone, string> = {
    neutral: 'bg-on-surface-variant',
    primary: 'bg-primary',
    success: 'bg-success',
    warning: 'bg-warning',
    error: 'bg-error',
    info: 'bg-tertiary',
  };
  return (
    <span className={`badge ${badgeTones[tone]} ${className}`}>
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColors[tone]}`} />}
      {children}
    </span>
  );
}

/* ---------- Button ---------- */
type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'icon';
  icon?: LucideIcon;
  iconRight?: LucideIcon;
};

export function Button({
  variant = 'secondary',
  size = 'md',
  icon: Icon,
  iconRight: IconRight,
  children,
  className = '',
  ...props
}: ButtonProps) {
  const variants = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    ghost: 'btn-ghost',
    danger: 'btn bg-error text-on-error px-4 py-2 hover:brightness-110 shadow-sm',
  };
  const sizes = {
    sm: 'text-label-sm px-3 py-1.5',
    md: '',
    icon: 'p-2 rounded-full',
  };
  return (
    <button className={`${variants[variant]} ${size === 'icon' ? sizes.icon : sizes[size]} ${className}`} {...props}>
      {Icon && <Icon className={size === 'icon' ? 'w-5 h-5' : 'w-4 h-4'} />}
      {size !== 'icon' && children}
      {IconRight && <IconRight className="w-4 h-4" />}
    </button>
  );
}

/* ---------- StatCard ---------- */
export function StatCard({
  label,
  value,
  unit,
  delta,
  deltaDirection = 'up',
  icon: Icon,
  sparkline,
  className = '',
}: {
  label: string;
  value: string | number;
  unit?: string;
  delta?: string;
  deltaDirection?: 'up' | 'down' | 'flat';
  icon?: LucideIcon;
  sparkline?: number[];
  className?: string;
}) {
  const DeltaIcon = deltaDirection === 'up' ? TrendingUp : deltaDirection === 'down' ? TrendingDown : Minus;
  const deltaColor =
    deltaDirection === 'up'
      ? 'text-success'
      : deltaDirection === 'down'
        ? 'text-error'
        : 'text-on-surface-variant';
  return (
    <Card className={`p-5 ${className}`}>
      <div className="flex items-start justify-between mb-3">
        <span className="text-label-md text-label-md text-on-surface-variant">{label}</span>
        {Icon && (
          <div className="w-8 h-8 rounded-lg bg-secondary-container/40 flex items-center justify-center">
            <Icon className="w-4 h-4 text-primary" />
          </div>
        )}
      </div>
      <div className="flex items-baseline gap-1.5">
        <span className="font-headline-lg text-headline-lg text-on-surface tabular-nums">{value}</span>
        {unit && <span className="font-body-sm text-body-sm text-on-surface-variant">{unit}</span>}
      </div>
      {(delta || sparkline) && (
        <div className="flex items-center justify-between mt-3">
          {delta && (
            <span className={`inline-flex items-center gap-1 text-label-md text-label-md ${deltaColor}`}>
              <DeltaIcon className="w-3.5 h-3.5" />
              {delta}
            </span>
          )}
          {sparkline && <Sparkline data={sparkline} className="h-8 w-24" />}
        </div>
      )}
    </Card>
  );
}

/* ---------- Sparkline (pure SVG, no deps) ---------- */
export function Sparkline({ data, className = '' }: { data: number[]; className?: string }) {
  if (data.length < 2) return null;
  const w = 96;
  const h = 32;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const pts = data.map((d, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((d - min) / range) * (h - 4) - 2;
    return `${x},${y}`;
  });
  const areaPts = `0,${h} ${pts.join(' ')} ${w},${h}`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className={className} preserveAspectRatio="none">
      <defs>
        <linearGradient id={`sl-${data.join('')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#051da1" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#051da1" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={areaPts} fill={`url(#sl-${data.join('')})`} />
      <polyline
        points={pts.join(' ')}
        fill="none"
        stroke="#051da1"
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ---------- BarChart (vertical bars, pure SVG) ---------- */
export function BarChart({
  data,
  height = 160,
  className = '',
}: {
  data: { label: string; value: number; highlight?: boolean }[];
  height?: number;
  className?: string;
}) {
  const max = Math.max(...data.map((d) => d.value)) || 1;
  return (
    <div className={`flex items-end gap-2 ${className}`} style={{ height }}>
      {data.map((d, i) => {
        const h = (d.value / max) * (height - 28);
        return (
          <div key={i} className="flex-1 flex flex-col items-center gap-2 min-w-0 group">
            <div className="w-full flex-1 flex items-end relative">
              <div
                className={`w-full rounded-t-md transition-all duration-300 group-hover:opacity-80 ${
                  d.highlight ? 'bg-primary' : 'bg-secondary-container'
                }`}
                style={{ height: Math.max(h, 2) }}
              />
            </div>
            <span className="text-label-sm text-label-sm text-on-surface-variant truncate w-full text-center">
              {d.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

/* ---------- ProgressBar ---------- */
export function ProgressBar({
  value,
  max = 100,
  tone = 'primary',
  className = '',
}: {
  value: number;
  max?: number;
  tone?: 'primary' | 'success' | 'warning' | 'error';
  className?: string;
}) {
  const pct = Math.min((value / max) * 100, 100);
  const tones = {
    primary: 'bg-primary',
    success: 'bg-success',
    warning: 'bg-warning',
    error: 'bg-error',
  };
  return (
    <div className={`h-1.5 w-full bg-surface-container-high rounded-full overflow-hidden ${className}`}>
      <div
        className={`h-full ${tones[tone]} rounded-full transition-all duration-500`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

/* ---------- Avatar ---------- */
export function Avatar({
  name,
  src,
  size = 'md',
  className = '',
}: {
  name: string;
  src?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  const sizes = { sm: 'w-7 h-7 text-[10px]', md: 'w-9 h-9 text-xs', lg: 'w-12 h-12 text-sm' };
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
  if (src) {
    return <img src={src} alt={name} className={`${sizes[size]} rounded-full object-cover ${className}`} />;
  }
  return (
    <div
      className={`${sizes[size]} rounded-full bg-secondary-container text-on-secondary-fixed font-semibold flex items-center justify-center ${className}`}
    >
      {initials}
    </div>
  );
}

/* ---------- SegmentedControl ---------- */
export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  className = '',
}: {
  options: { value: T; label: string; icon?: LucideIcon }[];
  value: T;
  onChange: (v: T) => void;
  className?: string;
}) {
  return (
    <div className={`inline-flex p-0.5 bg-surface-container-high rounded-lg ${className}`}>
      {options.map((o) => {
        const Icon = o.icon;
        return (
          <button
            key={o.value}
            onClick={() => onChange(o.value)}
            className={`px-3 py-1.5 rounded-md text-label-md text-label-md transition-all flex items-center gap-1.5 ${
              value === o.value ? 'bg-surface-container-lowest text-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            {Icon && <Icon className="w-3.5 h-3.5" />}
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

/* ---------- Table primitives ---------- */
export function Table({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className="overflow-x-auto">
      <table className={`w-full ${className}`}>{children}</table>
    </div>
  );
}
export function THead({ children }: { children: ReactNode }) {
  return <thead className="border-b border-outline-variant">{children}</thead>;
}
export function TH({ children = null, className = '' }: { children?: ReactNode; className?: string }) {
  return <th className={`table-header ${className}`}>{children}</th>;
}
export function TR({
  children,
  onClick,
  className = '',
}: {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <tr
      onClick={onClick}
      className={`border-b border-outline-variant/50 last:border-0 transition-colors ${
        onClick ? 'cursor-pointer hover:bg-surface-container-low' : ''
      } ${className}`}
    >
      {children}
    </tr>
  );
}
export function TD({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <td className={`table-cell ${className}`}>{children}</td>;
}

/* ---------- Toggle ---------- */
export function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label?: string;
}) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className="inline-flex items-center gap-2"
      role="switch"
      aria-checked={checked}
    >
      <span
        className={`relative w-9 h-5 rounded-full transition-colors duration-200 ${
          checked ? 'bg-primary' : 'bg-surface-container-highest border border-outline-variant'
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${
            checked ? 'translate-x-4' : ''
          }`}
        />
      </span>
      {label && <span className="text-label-md text-label-md text-on-surface">{label}</span>}
    </button>
  );
}

/* ---------- EmptyState ---------- */
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center mb-4">
        <Icon className="w-6 h-6 text-on-surface-variant" />
      </div>
      <h3 className="font-title-md text-title-md text-on-surface mb-1">{title}</h3>
      {description && <p className="font-body-sm text-body-sm text-on-surface-variant max-w-sm">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

/* ---------- PageHeader ---------- */
export function PageHeader({
  title,
  subtitle,
  breadcrumbs,
  actions,
  icon,
}: {
  title: string;
  subtitle?: string;
  breadcrumbs?: { label: string; href?: string }[];
  actions?: ReactNode;
  icon?: LucideIcon;
}) {
  const Icon = icon;
  return (
    <div className="mb-6 animate-fade-in">
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="flex items-center gap-1.5 mb-2 text-label-sm text-label-sm text-on-surface-variant">
          {breadcrumbs.map((b, i) => (
            <span key={i} className="flex items-center gap-1.5">
              {i > 0 && <span className="text-outline">/</span>}
              <span className={i === breadcrumbs.length - 1 ? 'text-on-surface' : ''}>{b.label}</span>
            </span>
          ))}
        </nav>
      )}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          {Icon && (
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <Icon className="w-5 h-5 text-primary" />
            </div>
          )}
          <div>
            <h1 className="font-headline-lg text-headline-lg text-on-surface">{title}</h1>
            {subtitle && <p className="font-body-md text-body-md text-on-surface-variant mt-0.5">{subtitle}</p>}
          </div>
        </div>
        {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
      </div>
    </div>
  );
}
