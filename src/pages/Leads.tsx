import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Download } from 'lucide-react';
import Card from '@/components/ui/Card';
import { SearchInput, FilterPills, Select } from '@/components/ui/Input';
import { PriorityBadge, PipelineBadge } from '@/components/ui/Badge';
import { ScoreRing } from '@/components/ui/ScoreRing';
import { EmptyState } from '@/components/ui/EmptyState';
import { useDataStore } from '@/store/dataStore';
import { downloadCSV } from '@/lib/utils';

export default function Leads() {
  const leads = useDataStore((s) => s.leads);
  const [q, setQ] = useState('');
  const [priority, setPriority] = useState('all');
  const [status, setStatus] = useState('all');
  const [sort, setSort] = useState('score');

  const filtered = useMemo(() => {
    let out = leads.filter((l) => {
      const hit = (l.name + ' ' + l.category + ' ' + (l.address ?? '')).toLowerCase().includes(q.toLowerCase());
      const p = priority === 'all' || l.priority === priority;
      const s = status === 'all' || l.pipeline_status === status;
      return hit && p && s;
    });
    out = [...out].sort((a, b) => (sort === 'score' ? b.lead_score - a.lead_score : a.name.localeCompare(b.name)));
    return out;
  }, [leads, q, priority, status, sort]);

  const exportCsv = () => {
    downloadCSV('leads.csv', [
      ['name', 'category', 'score', 'priority', 'pipeline', 'phone', 'website', 'address'],
      ...filtered.map((l) => [l.name, l.category, String(l.lead_score), l.priority, l.pipeline_status, l.phone ?? '', l.website ?? '', l.address ?? '']),
    ]);
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-primary">Leads</h1>
          <p className="text-sm text-secondary mt-1">{filtered.length} of {leads.length} businesses · scored by digital gaps + value.</p>
        </div>
        <button onClick={exportCsv} className="inline-flex items-center gap-1.5 h-9 px-4 text-sm font-medium bg-surface border border-strong rounded-lg text-secondary hover:bg-subtle transition-fast">
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      <Card className="p-4 space-y-3">
        <div className="grid sm:grid-cols-3 gap-3">
          <SearchInput placeholder="Search name, category, address…" value={q} onChange={(e) => setQ(e.target.value)} onClear={() => setQ('')} aria-label="Search leads" />
          <Select value={status} onChange={(e) => setStatus(e.target.value)} options={[{ value: 'all', label: 'All pipeline stages' }, { value: 'New', label: 'New' }, { value: 'Qualified', label: 'Qualified' }, { value: 'Proposal Sent', label: 'Proposal Sent' }, { value: 'Contacted', label: 'Contacted' }, { value: 'Warm', label: 'Warm' }, { value: 'Won', label: 'Won' }, { value: 'Lost', label: 'Lost' }, { value: 'Not Interested', label: 'Not Interested' }]} aria-label="Pipeline filter" />
          <Select value={sort} onChange={(e) => setSort(e.target.value)} options={[{ value: 'score', label: 'Sort: highest score' }, { value: 'name', label: 'Sort: name A–Z' }]} aria-label="Sort" />
        </div>
        <FilterPills value={priority} onChange={setPriority} options={[{ value: 'all', label: 'All priorities', count: leads.length }, { value: 'High', label: 'High', count: leads.filter((l) => l.priority === 'High').length, dotClass: 'bg-danger-500' }, { value: 'Medium', label: 'Medium', count: leads.filter((l) => l.priority === 'Medium').length, dotClass: 'bg-accent-500' }, { value: 'Low', label: 'Low', count: leads.filter((l) => l.priority === 'Low').length, dotClass: 'bg-secondary-400' }]} />
      </Card>

      {filtered.length === 0 ? (
        <EmptyState illustration="search" title="No leads match" description="Try clearing the search or choosing a different priority / pipeline filter." secondaryAction={{ label: 'Clear filters', onClick: () => { setQ(''); setPriority('all'); setStatus('all'); } }} />
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[720px]">
              <thead>
                <tr className="text-left text-[11px] uppercase tracking-wide text-muted border-b border-subtle bg-subtle/60">
                  <th className="px-4 py-2.5 font-medium">Business</th>
                  <th className="px-3 py-2.5 font-medium">Score</th>
                  <th className="px-3 py-2.5 font-medium">Priority</th>
                  <th className="px-3 py-2.5 font-medium">Top problem</th>
                  <th className="px-3 py-2.5 font-medium">Pipeline</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((l) => (
                  <tr key={l.place_id} className="border-b border-subtle last:border-0 hover:bg-subtle/60 transition-fast">
                    <td className="px-4 py-3">
                      <Link to={`/leads/${encodeURIComponent(l.place_id)}`} className="font-medium text-primary hover:text-primary-600 hover:underline">{l.name}</Link>
                      <p className="text-xs text-muted capitalize">{l.category} · {l.address ?? 'No address'}</p>
                    </td>
                    <td className="px-3 py-3"><ScoreRing score={l.lead_score} /></td>
                    <td className="px-3 py-3"><PriorityBadge priority={l.priority} /></td>
                    <td className="px-3 py-3 max-w-[260px]"><span className="text-xs text-secondary line-clamp-2">{l.problems[0] ?? '—'}</span></td>
                    <td className="px-3 py-3"><PipelineBadge status={l.pipeline_status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
