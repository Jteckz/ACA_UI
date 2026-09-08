import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Search, Users, Mail, MoreHorizontal, Clock, BarChart3, Map as MapIcon, Settings as SettingsIcon, SunMoon, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { useAppStore } from '@/store/appStore';

export function MobileNav() {
  const pendingCount = 3;
  const highPriorityCount = 4;
  const [moreOpen, setMoreOpen] = useState(false);
  const { toggleTheme } = useAppStore();

  const items: { to: string; icon: LucideIcon; label: string; badge?: number; badgeDot?: boolean }[] = [
    { to: '/', icon: LayoutDashboard, label: 'Home' },
    { to: '/discover', icon: Search, label: 'Discover' },
    { to: '/leads', icon: Users, label: 'Leads', badge: highPriorityCount },
    { to: '/outreach', icon: Mail, label: 'Outreach', badge: pendingCount, badgeDot: true },
  ];

  return (
    <>
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-30 h-16 bg-surface border-t border-subtle flex items-center justify-around px-2"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
        aria-label="Mobile navigation"
      >
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center justify-center gap-0.5 w-14 h-12 rounded-lg transition-fast relative',
                isActive ? 'text-primary-600 dark:text-primary-400' : 'text-muted'
              )
            }
          >
            {({ isActive }) => (
              <>
                {isActive && <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-primary-500" />}
                <div className="relative">
                  <item.icon className="w-5 h-5" />
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className={cn(
                      'absolute -top-1.5 -right-2 inline-flex items-center justify-center min-w-4 h-4 px-1 text-[10px] font-medium tabular-nums rounded-full',
                      item.badgeDot ? 'bg-accent-500/10 text-accent-600 dark:text-accent-400' : 'bg-secondary-100 dark:bg-secondary-800 text-secondary-500'
                    )}>
                      {item.badge}
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-medium">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
        <button
          onClick={() => setMoreOpen(true)}
          className="flex flex-col items-center justify-center gap-0.5 w-14 h-12 text-muted"
          aria-label="More"
        >
          <MoreHorizontal className="w-5 h-5" />
          <span className="text-[10px] font-medium">More</span>
        </button>
      </nav>

      {moreOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm animate-fade-in" onClick={() => setMoreOpen(false)}>
          <div className="absolute bottom-0 left-0 right-0 bg-surface rounded-t-2xl p-4 animate-spring-up" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 16px)' }}>
            <div className="w-10 h-1 bg-secondary-300 dark:bg-secondary-700 rounded-full mx-auto mb-4" />
            <div className="grid grid-cols-3 gap-3">
              <NavLink to="/follow-ups" onClick={() => setMoreOpen(false)} className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-subtle">
                <Clock className="w-5 h-5 text-secondary" />
                <span className="text-xs text-secondary">Follow-ups</span>
              </NavLink>
              <NavLink to="/insights" onClick={() => setMoreOpen(false)} className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-subtle">
                <BarChart3 className="w-5 h-5 text-secondary" />
                <span className="text-xs text-secondary">Insights</span>
              </NavLink>
              <NavLink to="/map" onClick={() => setMoreOpen(false)} className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-subtle">
                <MapIcon className="w-5 h-5 text-secondary" />
                <span className="text-xs text-secondary">Map</span>
              </NavLink>
              <NavLink to="/settings" onClick={() => setMoreOpen(false)} className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-subtle">
                <SettingsIcon className="w-5 h-5 text-secondary" />
                <span className="text-xs text-secondary">Settings</span>
              </NavLink>
              <button onClick={() => { toggleTheme(); setMoreOpen(false); }} className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-subtle">
                <SunMoon className="w-5 h-5 text-secondary" />
                <span className="text-xs text-secondary">Theme</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
