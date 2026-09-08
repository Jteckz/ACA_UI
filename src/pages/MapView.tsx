import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '@/components/ui/Card';
import { FilterPills } from '@/components/ui/Input';
import { PriorityBadge } from '@/components/ui/Badge';
import { useDataStore } from '@/store/dataStore';

export default function MapView() {
  const leads = useDataStore((s) => s.leads);
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState<string | null>(null);

  const geo = useMemo(() => leads.filter((l) => l.latitude != null && l.longitude != null), [leads]);
  const filtered = filter === 'all' ? geo : geo.filter((l) => l.priority === filter);

  const lats = filtered.map((l) => l.latitude as number);
  const lngs = filtered.map((l) => l.longitude as number);
  const minLat = Math.min(...lats, -7), maxLat = Math.max(...lats, -2);
  const minLng = Math.min(...lngs, 32.5), maxLng = Math.max(...lngs, 39.5);
  const px = (lat: number, lng: number) => ({
    x: 8 + ((lng - minLng) / Math.max(0.001, maxLng - minLng)) * 84,
    y: 8 + (1 - (lat - minLat) / Math.max(0.001, maxLat - minLat)) * 84,
  });

  const sel = filtered.find((l) => l.place_id === selected);

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-primary">Map</h1>
          <p className="text-sm text-secondary mt-1">{filtered.length} geocoded leads · Tanzania focus.</p>
        </div>
        <FilterPills value={filter} onChange={setFilter} options={[{ value: 'all', label: 'All' }, { value: 'High', label: 'High', dotClass: 'bg-danger-500' }, { value: 'Medium', label: 'Medium', dotClass: 'bg-accent-500' }, { value: 'Low', label: 'Low', dotClass: 'bg-secondary-400' }]} />
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="p-4 lg:col-span-2">
          <div className="relative w-full aspect-[4/3] rounded-xl bg-subtle border border-subtle overflow-hidden" role="img" aria-label="Lead locations map">
            <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full">
              {[20, 40, 60, 80].map((g) => (
                <g key={g} stroke="var(--color-border)" strokeWidth="0.3" strokeDasharray="1.5 1.5">
                  <line x1={g} y1="0" x2={g} y2="100" />
                  <line x1="0" y1={g} x2="100" y2={g} />
                </g>
              ))}
              {filtered.map((l) => {
                const p = px(l.latitude as number, l.longitude as number);
                const isSel = l.place_id === selected;
                const fill = l.priority === 'High' ? 'var(--color-danger-500)' : l.priority === 'Medium' ? 'var(--color-accent-500)' : 'var(--color-secondary-400)';
                return (
                  <g key={l.place_id} onClick={() => setSelected(l.place_id)} className="cursor-pointer">
                    {isSel && <circle cx={p.x} cy={p.y} r="5" fill={fill} opacity="0.2" />}
                    <circle cx={p.x} cy={p.y} r={isSel ? '2.6' : '1.9'} fill={fill} stroke="white" strokeWidth="0.5" />
                    <title>{l.name}</title>
                  </g>
                );
              })}
            </svg>
            <div className="absolute left-3 bottom-3 text-[11px] px-2 py-1 rounded-md bg-surface/90 border border-subtle text-muted">Dar es Salaam cluster · Mwanza · Arusha</div>
          </div>
          {sel ? (
            <div className="mt-3 p-3 rounded-xl border border-selected bg-primary-50 dark:bg-primary-500/5 flex items-center justify-between gap-2 flex-wrap">
              <div>
                <p className="font-medium text-primary text-sm">{sel.name} <PriorityBadge priority={sel.priority} /></p>
                <p className="text-xs text-secondary">{sel.address} · {sel.latitude?.toFixed(4)}, {sel.longitude?.toFixed(4)}</p>
              </div>
              <Link to={`/leads/${encodeURIComponent(sel.place_id)}`} className="text-xs font-medium text-primary-600 dark:text-primary-400 hover:underline">Open lead →</Link>
            </div>
          ) : (
            <p className="text-xs text-muted mt-3">Click a dot to preview a lead.</p>
          )}
        </Card>
        <Card className="p-2 overflow-hidden self-start">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted px-3 pt-3 pb-1">Locations</p>
          <div className="max-h-[480px] overflow-y-auto">
            {filtered.map((l) => (
              <button key={l.place_id} onClick={() => setSelected(l.place_id)} className={`w-full text-left px-3 py-2.5 hover:bg-subtle transition-fast border-l-2 ${selected === l.place_id ? 'border-primary-500 bg-primary-50 dark:bg-primary-500/5' : 'border-transparent'}`}>
                <p className="text-sm font-medium text-primary truncate">{l.name}</p>
                <p className="text-xs text-muted truncate">{l.address}</p>
              </button>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
