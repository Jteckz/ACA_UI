import { cn } from '@/lib/utils';

interface BadgeProps {
  dotClass?: string;
  textClass?: string;
  bgClass?: string;
  label: string;
  pulsing?: boolean;
  icon?: React.ReactNode;
  size?: 'sm' | 'md';
}

export function Badge({ dotClass, textClass, bgClass, label, pulsing, icon, size = 'sm' }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-medium',
        size === 'sm' ? 'h-[22px] px-1.5 text-xs' : 'h-6 px-2 text-xs',
        bgClass,
        textClass
      )}
    >
      {dotClass && (
        <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', dotClass, pulsing && 'animate-pulse-dot')} />
      )}
      {icon}
      {label}
    </span>
  );
}

export function PriorityBadge({ priority, size = 'sm' }: { priority: string; size?: 'sm' | 'md' }) {
  const colors: Record<string, { dot: string; text: string; bg: string }> = {
    High: { dot: 'bg-danger-500', text: 'text-danger-600 dark:text-danger-500', bg: 'bg-danger-50 dark:bg-danger-500/10' },
    Medium: { dot: 'bg-accent-500', text: 'text-accent-600 dark:text-accent-400', bg: 'bg-accent-500/10' },
    Low: { dot: 'bg-secondary-400', text: 'text-secondary-500 dark:text-secondary-400', bg: 'bg-secondary-100 dark:bg-secondary-800' },
  };
  const c = colors[priority] || colors.Low;
  return <Badge dotClass={c.dot} textClass={c.text} bgClass={c.bg} label={priority} size={size} aria-label={`${priority} priority`} />;
}

export function StatusBadge({ status, size = 'sm' }: { status: string; size?: 'sm' | 'md' }) {
  const colors: Record<string, { dot: string; text: string; bg: string }> = {
    'Pending Approval': { dot: 'bg-accent-500', text: 'text-accent-600 dark:text-accent-400', bg: 'bg-accent-500/10' },
    'Approved': { dot: 'bg-success-500', text: 'text-success-600 dark:text-success-500', bg: 'bg-success-50 dark:bg-success-500/10' },
    'Sent': { dot: 'bg-primary-500', text: 'text-primary-600 dark:text-primary-400', bg: 'bg-primary-50 dark:bg-primary-500/10' },
    'Rejected': { dot: 'bg-secondary-400', text: 'text-secondary-500 dark:text-secondary-400', bg: 'bg-secondary-100 dark:bg-secondary-800' },
  };
  const c = colors[status] || colors['Pending Approval'];
  return <Badge dotClass={c.dot} textClass={c.text} bgClass={c.bg} label={status} pulsing={status === 'Pending Approval'} size={size} />;
}

export function PipelineBadge({ status, size = 'sm' }: { status: string; size?: 'sm' | 'md' }) {
  const colors: Record<string, { dot: string; text: string; bg: string }> = {
    'New': { dot: 'bg-secondary-400', text: 'text-secondary-600 dark:text-secondary-400', bg: 'bg-secondary-100 dark:bg-secondary-800' },
    'Qualified': { dot: 'bg-primary-400', text: 'text-primary-600 dark:text-primary-400', bg: 'bg-primary-50 dark:bg-primary-500/10' },
    'Proposal Sent': { dot: 'bg-primary-500', text: 'text-primary-600 dark:text-primary-400', bg: 'bg-primary-50 dark:bg-primary-500/10' },
    'Contacted': { dot: 'bg-accent-500', text: 'text-accent-600 dark:text-accent-400', bg: 'bg-accent-500/10' },
    'Warm': { dot: 'bg-success-500', text: 'text-success-600 dark:text-success-500', bg: 'bg-success-50 dark:bg-success-500/10' },
    'Future Opportunity': { dot: 'bg-accent-400', text: 'text-accent-600 dark:text-accent-400', bg: 'bg-accent-500/10' },
    'Not Interested': { dot: 'bg-secondary-400', text: 'text-secondary-500 dark:text-secondary-400', bg: 'bg-secondary-100 dark:bg-secondary-800' },
    'Won': { dot: 'bg-success-500', text: 'text-success-600 dark:text-success-500', bg: 'bg-success-50 dark:bg-success-500/10' },
    'Lost': { dot: 'bg-danger-500', text: 'text-danger-600 dark:text-danger-500', bg: 'bg-danger-50 dark:bg-danger-500/10' },
  };
  const c = colors[status] || colors['New'];
  return <Badge dotClass={c.dot} textClass={c.text} bgClass={c.bg} label={status} size={size} />;
}

export function ResponseBadge({ status, size = 'sm' }: { status: string; size?: 'sm' | 'md' }) {
  const colors: Record<string, { dot: string; text: string; bg: string }> = {
    'Warm Lead': { dot: 'bg-success-500', text: 'text-success-600 dark:text-success-500', bg: 'bg-success-50 dark:bg-success-500/10' },
    'Converted': { dot: 'bg-success-500', text: 'text-success-600 dark:text-success-500', bg: 'bg-success-50 dark:bg-success-500/10' },
    'Needs More Info': { dot: 'bg-primary-400', text: 'text-primary-600 dark:text-primary-400', bg: 'bg-primary-50 dark:bg-primary-500/10' },
    'Future Opportunity': { dot: 'bg-accent-400', text: 'text-accent-600 dark:text-accent-400', bg: 'bg-accent-500/10' },
    'Not Interested': { dot: 'bg-secondary-400', text: 'text-secondary-500 dark:text-secondary-400', bg: 'bg-secondary-100 dark:bg-secondary-800' },
  };
  const c = colors[status] || colors['Not Interested'];
  return <Badge dotClass={c.dot} textClass={c.text} bgClass={c.bg} label={status} size={size} />;
}
