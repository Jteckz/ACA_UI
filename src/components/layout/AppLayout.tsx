import { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { MobileNav } from './MobileNav';

export function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-base flex">
      <Sidebar />
      <div className="flex-1 min-w-0 flex flex-col min-h-screen">
        <Header onMenuClick={() => setMobileOpen((v) => !v)} />
        {mobileOpen && (
          <div className="md:hidden border-b border-subtle bg-subtle px-4 py-3 flex flex-wrap gap-2 text-sm">
            {[
              { to: '/', label: 'Dashboard' },
              { to: '/discover', label: 'Discover' },
              { to: '/leads', label: 'Leads' },
              { to: '/map', label: 'Map' },
              { to: '/outreach', label: 'Outreach' },
              { to: '/follow-ups', label: 'Follow-ups' },
              { to: '/insights', label: 'Insights' },
              { to: '/settings', label: 'Settings' },
            ].map((l) => (
              <Link key={l.to} to={l.to} onClick={() => setMobileOpen(false)} className="px-3 py-1.5 rounded-lg bg-surface border border-subtle text-secondary">
                {l.label}
              </Link>
            ))}
          </div>
        )}
        <main className="flex-1 min-w-0 px-4 sm:px-6 py-6 max-w-7xl w-full mx-auto pb-24 md:pb-10">
          <Outlet />
        </main>
      </div>
      <MobileNav />
    </div>
  );
}
