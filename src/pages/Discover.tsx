import { useMemo, useState } from 'react';
import { Search, MapPin, Radar } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Input, Select, FilterPills } from '@/components/ui/Input';
import { PriorityBadge } from '@/components/ui/Badge';
import { ScoreRing } from '@/components/ui/ScoreRing';
import { EmptyState } from '@/components/ui/EmptyState';
import { CATEGORIES } from '@/lib/constants';
import { mockDiscoveryReports } from '@/lib/mockData';
import { useToast } from '@/components/ui/Toast';

export default function Discover() {
  const { toast } = useToast();
  const [location, setLocation] = useState('Dar es Salaam, Tanzania');
  const [category, setCategory] = useState('restaurant');
  const [limit, setLimit] = useState('10');
  const [phase, setPhase] = useState<string>('');
  const [progress, setProgress] = useState(0);
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState<typeof mockDiscoveryReports | null>(null);
  const [currentBiz, setCurrentBiz] = useState('');

  const filteredPreview = useMemo(() => {
    if (!results) return [];
    if (category === 'all') return results;
    return results.filter((r) => r.category === category).concat(results.filter((r) => r.category !== category)).slice(0, Number(limit));
  }, [results, category, limit]);

  const run = () => {
    if (!location.trim()) {
      toast({ type: 'error', title: 'Location required', description: 'Enter a city / area to scan.' });
      return;
    }
    setRunning(true);
    setResults(null);
    setProgress(0);
    const phases = ['Searching OpenStreetMap…', 'Resolving websites…', 'Analyzing digital presence…', 'Scoring leads…', 'Drafting proposals…'];
    let step = 0;
    setPhase(phases[0]);
    setCurrentBiz('Preparing scan');
    const names = mockDiscoveryReports.map((r) => r.business_name);
    const timer = setInterval(() => {
      step += 1;
      const pct = Math.min(100, Math.round((step / 20) * 100));
      setProgress(pct);
      setPhase(phases[Math.min(phases.length - 1, Math.floor(step / 4))]);
      setCurrentBiz(names[step % names.length]);
      if (step >= 20) {
        clearInterval(timer);
        setRunning(false);
        setPhase('');
        const n = Number(limit) || 10;
        const pool = category === 'all' ? mockDiscoveryReports : mockDiscoveryReports.filter((r) => r.category === category);
        const out = (pool.length ? pool : mockDiscoveryReports).slice(0, n);
        // pad by cycling if fewer than requested
        const filled = Array.from({ length: Math.min(n, 10) }, (_, i) => (pool.length ? pool : mockDiscoveryReports)[i % (pool.length || mockDiscoveryReports.length)]);
        setResults(category === 'all' ? mockDiscoveryReports.slice(0, n) : filled.length ? filled : out);
        toast({ type: 'success', title: 'Discovery complete', description: `${out.length || n} businesses analyzed in ${location}.` });
      }
    }, 220);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-primary">Discover</h1>
        <p className="text-sm text-secondary mt-1">Scan a city for businesses by category, analyze their digital gaps, and auto-score them.</p>
      </div>

      <Card className="p-5">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <Input label="Location" value={location} onChange={(e) => setLocation(e.target.value)} icon={<MapPin className="w-4 h-4" />} placeholder="City, Country" />
          <Select label="Category" value={category} onChange={(e) => setCategory(e.target.value)} options={[{ value: 'all', label: 'All categories' }, ...CATEGORIES.map((c) => ({ value: c, label: c }))]} />
          <Select label="Max results" value={limit} onChange={(e) => setLimit(e.target.value)} options={[{ value: '5', label: '5 businesses' }, { value: '10', label: '10 businesses' }, { value: '20', label: '20 businesses' }]} />
          <div className="flex items-end">
            <Button variant="primary" onClick={run} loading={running} icon={!running ? <Radar className="w-4 h-4" /> : undefined} className="w-full">
              {running ? 'Scanning…' : 'Run discovery'}
            </Button>
          </div>
        </div>
        {running && (
          <div className="mt-4 p-4 rounded-xl bg-subtle border border-subtle">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-secondary font-medium">{phase}</span>
              <span className="tabular-nums text-muted">{progress}%</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-primary-500 rounded-full transition-smooth" style={{ width: `${progress}%` }} />
            </div>
            <p className="text-xs text-muted mt-2 flex items-center gap-1.5"><Search className="w-3 h-3" /> {currentBiz}</p>
          </div>
        )}
      </Card>

      {!results && !running && (
        <EmptyState illustration="radar" title="No scan yet" description="Run a discovery scan to find businesses, detect missing websites, booking, ordering and more." primaryAction={{ label: 'Run sample scan', onClick: run }} />
      )}

      {results && (
        <div className="space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h2 className="text-sm font-semibold text-primary">{filteredPreview.length} reports · {location}</h2>
            <FilterPills value={category} onChange={setCategory} options={[{ value: 'all', label: 'All' }, ...CATEGORIES.slice(0, 8).map((c) => ({ value: c, label: c }))]} />
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            {filteredPreview.map((r) => (
              <Card key={r.business_name} variant="interactive" className="p-4 flex gap-3">
                <ScoreRing score={r.lead_score} size={44} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-medium text-primary truncate">{r.business_name}</p>
                    <PriorityBadge priority={r.priority} />
                  </div>
                  <p className="text-xs text-muted capitalize mt-0.5">{r.category} · value: {r.potential_value}</p>
                  <div className="mt-2 space-y-1">
                    {r.problems.slice(0, 2).map((p) => <p key={p} className="text-xs text-secondary">• {p}</p>)}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {r.solutions.slice(0, 2).map((s) => <span key={s} className="text-[11px] px-2 py-0.5 rounded-full bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400">{s}</span>)}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
