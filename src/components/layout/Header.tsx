import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, Sun, Moon, Menu, X } from 'lucide-react';
import { useAppStore } from '@/store/appStore';

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { theme, toggleTheme } = useAppStore();
  const navigate = useNavigate();
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [bellOpen, setBellOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const bellRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setPaletteOpen(true);
      }
      if (e.key === 'Escape') setPaletteOpen(false);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  useEffect(() => {
    if (paletteOpen) inputRef.current?.focus();
  }, [paletteOpen]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (bellRef.current && !bellRef.current.contains(e.target as Node)) setBellOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const commands = [
    { label: 'Go to Dashboard', action: () => navigate('/') },
    { label: 'Go to Discover', action: () => navigate('/discover') },
    { label: 'Go to Leads', action: () => navigate('/leads') },
    { label: 'Go to Outreach', action: () => navigate('/outreach') },
    { label: 'Go to Follow-ups', action: () => navigate('/follow-ups') },
    { label: 'Go to Insights', action: () => navigate('/insights') },
    { label: 'Go to Map', action: () => navigate('/map') },
    { label: 'Go to Settings', action: () => navigate('/settings') },
    { label: 'Toggle theme', action: toggleTheme },
  ];

  const filtered = commands.filter((c) => c.label.toLowerCase().includes(search.toLowerCase()));

  const notifications = [
    { text: '5 drafts await review', action: () => navigate('/outreach') },
    { text: '3 leads due for follow-up', action: () => navigate('/follow-ups') },
    { text: '2 high-priority leads without proposals', action: () => navigate('/leads') },
  ];

  return (
    <>
      <header className="sticky top-0 z-30 h-14 flex items-center gap-3 px-4 bg-base/80 backdrop-blur-md border-b border-subtle">
        <button onClick={onMenuClick} className="md:hidden text-secondary hover:text-primary transition-fast p-1" aria-label="Menu">
          <Menu className="w-5 h-5" />
        </button>

        <button
          onClick={() => setPaletteOpen(true)}
          className="flex items-center gap-2 h-9 px-3 bg-subtle border border-subtle rounded-lg text-sm text-muted hover:border-strong hover:bg-surface transition-fast flex-1 max-w-xs"
        >
          <Search className="w-4 h-4" />
          <span className="flex-1 text-left">Search or command…</span>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono text-muted bg-surface border border-subtle rounded">⌘K</kbd>
        </button>

        <div className="flex items-center gap-1 ml-auto">
          <button onClick={toggleTheme} className="p-2 text-secondary hover:text-primary hover:bg-muted rounded-lg transition-fast" aria-label="Toggle theme">
            {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>
          <div className="relative" ref={bellRef}>
            <button
              onClick={() => setBellOpen(!bellOpen)}
              className="p-2 text-secondary hover:text-primary hover:bg-muted rounded-lg transition-fast relative"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-accent-500" />
            </button>
            {bellOpen && (
              <div className="absolute right-0 top-full mt-1 w-72 bg-surface border border-subtle rounded-xl shadow-popover animate-spring-in z-50">
                <div className="p-3 border-b border-subtle">
                  <p className="text-sm font-semibold text-primary">Notifications</p>
                </div>
                <div className="py-1">
                  {notifications.map((n, i) => (
                    <button
                      key={i}
                      onClick={() => { n.action(); setBellOpen(false); }}
                      className="w-full text-left px-3 py-2 text-[13px] text-secondary hover:bg-subtle hover:text-primary transition-fast flex items-center gap-2"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-accent-500 shrink-0" />
                      {n.text}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-500/20 flex items-center justify-center text-xs font-semibold text-primary-600 dark:text-primary-400">
            OP
          </div>
        </div>
      </header>

      {paletteOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4 bg-black/50 dark:bg-black/70 backdrop-blur-sm animate-fade-in"
          onClick={(e) => e.target === e.currentTarget && setPaletteOpen(false)}
        >
          <div className="w-full max-w-lg bg-surface rounded-2xl shadow-modal animate-spring-in overflow-hidden">
            <div className="flex items-center gap-2 px-4 h-12 border-b border-subtle">
              <Search className="w-4 h-4 text-muted" />
              <input
                ref={inputRef}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search or command…"
                className="flex-1 bg-transparent text-sm text-primary placeholder:text-muted outline-none"
                role="combobox"
                aria-expanded="true"
              />
              <button onClick={() => setPaletteOpen(false)} className="text-muted hover:text-primary transition-fast">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="max-h-80 overflow-y-auto py-1">
              {filtered.length === 0 ? (
                <div className="px-4 py-8 text-center">
                  <p className="text-sm text-muted">No results for "{search}"</p>
                </div>
              ) : (
                filtered.map((cmd) => (
                  <button
                    key={cmd.label}
                    onClick={() => { cmd.action(); setPaletteOpen(false); setSearch(''); }}
                    className="w-full text-left px-4 py-2 text-sm text-secondary hover:bg-subtle hover:text-primary transition-fast flex items-center gap-2"
                    role="option"
                  >
                    <Search className="w-3.5 h-3.5 text-muted" />
                    {cmd.label}
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
