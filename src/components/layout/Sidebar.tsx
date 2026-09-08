import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Search, Users, Mail, Clock, BarChart3, Map, Settings,
  GitBranch, type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store/appStore';

interface NavItemProps {
  to: string;
  icon: LucideIcon;
  label: string;
  badge?: number;
  badgeDot?: boolean;
  collapsed?: boolean;
}

function NavItem({ to, icon: Icon, label, badge, badgeDot, collapsed }: NavItemProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-2.5 h-9 px-2.5 rounded-lg text-sm font-medium transition-fast relative group',
          isActive
            ? 'bg-muted text-primary font-semibold'
            : 'text-secondary hover:bg-subtle hover:text-primary'
        )
      }
    >
      {({ isActive }) => (
        <>
          {isActive && <span className="absolute left-0 top-1.5 bottom-1.5 w-0.5 rounded-full bg-primary-500" />}
          <Icon className={cn('w-4 h-4 shrink-0', isActive && 'text-primary-500')} />
          {!collapsed && <span className="flex-1 truncate">{label}</span>}
          {!collapsed && badge !== undefined && badge > 0 && (
            <span className={cn(
              'inline-flex items-center justify-center min-w-5 h-5 px-1.5 text-xs font-medium tabular-nums rounded-full',
              badgeDot ? 'bg-accent-500/10 text-accent-600 dark:text-accent-400' : 'bg-secondary-100 dark:bg-secondary-800 text-secondary-500'
            )}>
              {badgeDot && <span className="w-1.5 h-1.5 rounded-full bg-accent-500 animate-pulse-dot mr-1" />}
              {badge}
            </span>
          )}
        </>
      )}
    </NavLink>
  );
}

function NavSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-0.5">
      <p className="text-[11px] font-medium uppercase tracking-wide text-muted px-2.5 mb-1">{label}</p>
      {children}
    </div>
  );
}

export function Sidebar() {
  const collapsed = useAppStore((s) => s.sidebarCollapsed);
  const pendingCount = 3;
  const highPriorityCount = 4;
  const dueCount = 3;

  return (
    <aside
      className={cn(
        'hidden md:flex flex-col bg-subtle border-r border-subtle shrink-0 transition-smooth',
        collapsed ? 'w-16' : 'w-60'
      )}
      aria-label="Main navigation"
    >
      <div className={cn('flex items-center h-14 px-3 border-b border-subtle', collapsed && 'justify-center')}>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-primary-600 dark:bg-primary-500 flex items-center justify-center shrink-0">
            <GitBranch className="w-4 h-4 text-white" />
          </div>
          {!collapsed && <span className="text-sm font-semibold tracking-tight text-primary">Acq Agent</span>}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-3 px-2 space-y-4">
        <NavSection label="Workspace">
          <NavItem to="/" icon={LayoutDashboard} label="Dashboard" collapsed={collapsed} />
          <NavItem to="/discover" icon={Search} label="Discover" collapsed={collapsed} />
          <NavItem to="/leads" icon={Users} label="Leads" badge={highPriorityCount} collapsed={collapsed} />
          <NavItem to="/map" icon={Map} label="Map" collapsed={collapsed} />
        </NavSection>
        <NavSection label="Pipeline">
          <NavItem to="/outreach" icon={Mail} label="Outreach" badge={pendingCount} badgeDot collapsed={collapsed} />
          <NavItem to="/follow-ups" icon={Clock} label="Follow-ups" badge={dueCount} collapsed={collapsed} />
          <NavItem to="/insights" icon={BarChart3} label="Insights" collapsed={collapsed} />
        </NavSection>
      </div>

      <div className="border-t border-subtle p-2">
        <NavItem to="/settings" icon={Settings} label="Settings" collapsed={collapsed} />
        {!collapsed && (
          <div className="flex items-center gap-2 px-2.5 py-2 mt-1">
            <span className="w-2 h-2 rounded-full bg-success-500" />
            <span className="text-xs text-muted">Ollama connected</span>
          </div>
        )}
      </div>
    </aside>
  );
}
