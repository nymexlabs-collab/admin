import { type LucideIcon, Construction, ArrowRight } from 'lucide-react';
import { Card, CardBody, Button, PageHeader } from '../components/ui';

export function PlaceholderPage({
  title,
  subtitle,
  icon,
  breadcrumbs,
  onNavigate,
}: {
  title: string;
  subtitle?: string;
  icon: LucideIcon;
  breadcrumbs?: { label: string }[];
  onNavigate?: (path: string) => void;
}) {
  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title={title} subtitle={subtitle} icon={icon} breadcrumbs={breadcrumbs} />
      <Card>
        <CardBody className="py-16">
          <div className="flex flex-col items-center text-center max-w-md mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-secondary-container/40 flex items-center justify-center mb-5">
              <Construction className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-headline-md text-headline-md text-on-surface mb-2">Module scaffolded</h2>
            <p className="text-body-md text-body-md text-on-surface-variant mb-6">
              The <span className="text-on-surface font-semibold">{title}</span> module is wired into navigation and routing.
              The full feature set is part of the next build phase.
            </p>
            <div className="flex gap-2">
              <Button variant="secondary" icon={ArrowRight} onClick={() => onNavigate?.('/dashboard')}>
                Back to Dashboard
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
