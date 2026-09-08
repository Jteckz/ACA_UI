import { type ReactNode } from 'react';

interface EmptyStateProps {
  illustration?: 'funnel' | 'radar' | 'map' | 'bars' | 'check' | 'document' | 'message' | 'inbox' | 'alert' | 'search' | 'server';
  title: string;
  description: string;
  primaryAction?: { label: string; onClick: () => void; icon?: ReactNode };
  secondaryAction?: { label: string; onClick: () => void };
  tertiaryAction?: { label: string; onClick: () => void };
  children?: ReactNode;
}

const illustrations = {
  funnel: (
    <svg width="96" height="96" viewBox="0 0 96 96" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-primary-400 dark:text-primary-500">
      <path d="M20 20h56l-20 28v28l-16 8v-36L20 20z" strokeLinejoin="round" />
      <path d="M28 30h40" strokeOpacity="0.3" />
      <path d="M34 40h28" strokeOpacity="0.2" />
    </svg>
  ),
  radar: (
    <svg width="96" height="96" viewBox="0 0 96 96" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-primary-400 dark:text-primary-500">
      <circle cx="48" cy="48" r="36" strokeOpacity="0.15" />
      <circle cx="48" cy="48" r="24" strokeOpacity="0.2" />
      <circle cx="48" cy="48" r="12" strokeOpacity="0.3" />
      <path d="M48 48L78 30" />
      <circle cx="48" cy="48" r="3" fill="currentColor" stroke="none" />
    </svg>
  ),
  map: (
    <svg width="96" height="96" viewBox="0 0 96 96" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-primary-400 dark:text-primary-500">
      <path d="M24 24L40 18l16 6 16-6v48l-16 6-16-6-16 6V24z" strokeLinejoin="round" strokeDasharray="4 4" />
      <circle cx="48" cy="42" r="4" fill="currentColor" stroke="none" />
      <circle cx="32" cy="56" r="3" fill="currentColor" stroke="none" strokeOpacity="0.5" />
      <circle cx="64" cy="60" r="3" fill="currentColor" stroke="none" strokeOpacity="0.5" />
    </svg>
  ),
  bars: (
    <svg width="96" height="96" viewBox="0 0 96 96" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-primary-400 dark:text-primary-500">
      <rect x="20" y="48" width="12" height="28" rx="2" strokeOpacity="0.3" />
      <rect x="42" y="36" width="12" height="40" rx="2" strokeOpacity="0.5" />
      <rect x="64" y="24" width="12" height="52" rx="2" />
    </svg>
  ),
  check: (
    <svg width="96" height="96" viewBox="0 0 96 96" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-success-500">
      <circle cx="48" cy="48" r="32" strokeOpacity="0.2" />
      <circle cx="48" cy="48" r="24" strokeOpacity="0.4" />
      <path d="M36 48l8 8 16-16" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  document: (
    <svg width="96" height="96" viewBox="0 0 96 96" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-primary-400 dark:text-primary-500">
      <path d="M28 20h28l12 12v44H28V20z" strokeLinejoin="round" />
      <path d="M56 20v12h12" strokeLinejoin="round" />
      <path d="M36 44h24M36 54h24M36 64h16" strokeOpacity="0.4" />
    </svg>
  ),
  message: (
    <svg width="96" height="96" viewBox="0 0 96 96" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-primary-400 dark:text-primary-500">
      <path d="M20 28h56v32H40l-12 10v-10H20V28z" strokeLinejoin="round" />
      <path d="M32 40h32M32 48h20" strokeOpacity="0.4" />
    </svg>
  ),
  inbox: (
    <svg width="96" height="96" viewBox="0 0 96 96" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-primary-400 dark:text-primary-500">
      <path d="M20 36l8-16h40l8 16v28H20V36z" strokeLinejoin="round" />
      <path d="M20 44h20l4 8h8l4-8h20" strokeLinejoin="round" strokeOpacity="0.5" />
    </svg>
  ),
  alert: (
    <svg width="96" height="96" viewBox="0 0 96 96" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-secondary-400">
      <circle cx="48" cy="48" r="32" strokeOpacity="0.3" />
      <path d="M48 28v24M48 60v4" strokeLinecap="round" />
    </svg>
  ),
  search: (
    <svg width="96" height="96" viewBox="0 0 96 96" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-primary-400 dark:text-primary-500">
      <circle cx="40" cy="40" r="20" />
      <path d="M56 56l16 16" strokeLinecap="round" />
    </svg>
  ),
  server: (
    <svg width="96" height="96" viewBox="0 0 96 96" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-primary-400 dark:text-primary-500">
      <rect x="24" y="24" width="48" height="20" rx="4" strokeOpacity="0.5" />
      <rect x="24" y="52" width="48" height="20" rx="4" />
      <circle cx="32" cy="34" r="2" fill="currentColor" stroke="none" />
      <circle cx="32" cy="62" r="2" fill="currentColor" stroke="none" />
    </svg>
  ),
};

export function EmptyState({ illustration = 'inbox', title, description, primaryAction, secondaryAction, tertiaryAction, children }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-4 animate-fade-in">
      <div className="mb-4" aria-hidden="true">{illustrations[illustration]}</div>
      <h3 className="text-[15px] font-semibold text-primary mb-1.5">{title}</h3>
      <p className="text-[13px] text-secondary max-w-sm mb-5">{description}</p>
      {children}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {primaryAction && (
          <button
            onClick={primaryAction.onClick}
            className="inline-flex items-center gap-1.5 h-9 px-4 text-sm font-medium bg-primary-600 dark:bg-primary-500 text-white rounded-lg shadow-xs hover:bg-primary-500 active:scale-[0.97] transition-smooth"
          >
            {primaryAction.icon}
            {primaryAction.label}
          </button>
        )}
        {secondaryAction && (
          <button
            onClick={secondaryAction.onClick}
            className="inline-flex items-center h-9 px-4 text-sm font-medium text-secondary bg-surface border border-strong rounded-lg hover:bg-subtle transition-fast"
          >
            {secondaryAction.label}
          </button>
        )}
        {tertiaryAction && (
          <button onClick={tertiaryAction.onClick} className="text-xs text-muted hover:text-primary transition-fast underline underline-offset-3">
            {tertiaryAction.label}
          </button>
        )}
      </div>
    </div>
  );
}
