import { Link } from 'react-router-dom';
import { Users, FileText, Mail, Trophy, ArrowRight, Clock, Sparkles } from 'lucide-react';
import Card from '@/components/ui/Card';
import { PriorityBadge, PipelineBadge } from '@/components/ui/Badge';
import { ScoreRing, DonutChart } from '@/components/ui/ScoreRing';
import { mockFunnelMetrics, mockDashboardLeads, mockFollowUps, mockInsights } from '@/lib/mockData';
import { FUNNEL_STAGES } from '@/lib/constants';
import { formatCurrencyRange, formatWeeksRange } from '@/lib/utils';
import { useDataStore } from '@/store/dataStore';

export default function Dashboard() {
  const leads = useDataStore((s) => s.leads);
  const drafts = useDataStore((s) => s.drafts);
  const pending = drafts.filter((d) => d.status === 'Pending Approval').length;
  const m = mockFunnelMetrics;

  const kpis = [
    { icon: Users, label: 'Businesses found', value: m.businesses_found, sub: `${m.analyzed} analyzed`, color: 'text-primary-500' },
    { icon: Sparkles, label: 'Qualified', value: m.qualified, sub: `${leads.filter((l) => l.priority === 'High').length} high priority`, color: 'text-accent-500' },
    { icon: FileText, label: 'Proposals', value: m.proposals_generated, sub: `${m.outreach_drafted} drafts`, color: 'text-primary-600 dark:text-primary-400' },
    { icon: Mail, label: 'Sent / Responses', value: `${m.outreach_sent}/${m.responses_logged}`, sub: `${m.interested} interested`, color: 'text-success-500' },
    { icon: Trophy, label: 'Clients won', value: m.clients_won, sub: `${Math.round((m.clients_won / Math.max(1, m.outreach_sent)) * 100)}% close rate`, color: 'text-success-600' },
  ];

  const max = Math.max(...FUNNEL_STAGES.map((s) => m[s.key as keyof typeof m] as number));

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-primary">Dashboard</h1>
          <p className="text-sm text-secondary mt-1">Acquisition pipeline at a glance — find, qualify, propose, outreach, win.</p>
        </div>
        <div className="flex gap-2">
          <Link to="/discover" className="inline-flex items-center gap-1.5 h-9 px-4 text-sm font-medium bg-primary-600 dark:bg-primary-500 text-white rounded-lg hover:bg-primary-500 transition-smooth">
            New discovery
          </Link>
          <Link to="/outreach" className="inline-flex items-center gap-1.5 h-9 px-4 text-sm font-medium bg-surface border border-strong rounded-lg text-secondary hover:bg-subtle transition-fast">
            Review drafts {pending > 0 && <span className="min-w-5 h-5 px-1.5 text-xs rounded-full bg-accent-500/10 text-accent-600 inline-flex items-center justify-center">{pending}</span>}
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {kpis.map((k) => (
          <Card key={k.label} className="p-4">
            <k.icon className={`w-4 h-4 ${k.color}`} />
            <p className="text-2xl font-semibold tabular-nums text-primary mt-2">{k.value}</p>
            <p className="text-xs font-medium text-secondary mt-0.5">{k.label}</p>
            <p className="text-[11px] text-muted mt-0.5">{k.sub}</p>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-primary">Funnel</h2>
            <Link to="/insights" className="text-xs text-primary-600 dark:text-primary-400 hover:underline inline-flex items-center gap-1">Insights <ArrowRight className="w-3 h-3" /></Link>
          </div>
          <div className="space-y-2">
            {FUNNEL_STAGES.map((s) => {
              const v = m[s.key as keyof typeof m] as number;
              const pct = Math.max(3, Math.round((v / max) * 100));
              return (
                <div key={s.key} className="flex items-center gap-3">
                  <span className="w-20 text-xs text-muted shrink-0">{s.label}</span>
                  <div className="flex-1 h-6 bg-muted rounded-md overflow-hidden">
                    <div className="h-full rounded-md bg-primary-500/80 dark:bg-primary-500/70 flex items-center justify-end pr-2 transition-smooth" style={{ width: `${pct}%` }}>
                      <span className="text-[11px] font-semibold text-white tabular-nums">{v}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card className="p-5 flex flex-col items-center justify-center">
          <h2 className="text-sm font-semibold text-primary self-start mb-3">Pipeline mix</h2>
          <DonutChart
            size={140}
            strokeWidth={16}
            segments={[
              { value: leads.filter((l) => l.priority === 'High').length, color: 'var(--color-danger-500)', label: 'High' },
              { value: leads.filter((l) => l.priority === 'Medium').length, color: 'var(--color-accent-500)', label: 'Med' },
              { value: leads.filter((l) => l.priority === 'Low').length, color: 'var(--color-border-strong)', label: 'Low' },
            ]}
            centerValue={String(leads.length)}
            centerLabel="leads"
          />
          <div className="flex gap-4 mt-4 text-xs text-secondary">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-danger-500" />High</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-accent-500" />Medium</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-secondary-400" />Low</span>
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 overflow-hidden">
          <div className="flex items-center justify-between px-5 pt-4 pb-2">
            <h2 className="text-sm font-semibold text-primary">Top ranked leads</h2>
            <Link to="/leads" className="text-xs text-primary-600 dark:text-primary-400 hover:underline inline-flex items-center gap-1">All leads <ArrowRight className="w-3 h-3" /></Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[11px] uppercase tracking-wide text-muted border-y border-subtle bg-subtle/60">
                  <th className="px-5 py-2 font-medium">Business</th>
                  <th className="px-3 py-2 font-medium">Score</th>
                  <th className="px-3 py-2 font-medium">Priority</th>
                  <th className="px-3 py-2 font-medium hidden sm:table-cell">Proposal</th>
                  <th className="px-3 py-2 font-medium hidden md:table-cell">Pipeline</th>
                </tr>
              </thead>
              <tbody>
                {mockDashboardLeads.slice(0, 7).map((l) => (
                  <tr key={l.name} className="border-b border-subtle last:border-0 hover:bg-subtle/60 transition-fast">
                    <td className="px-5 py-2.5">
                      <p className="font-medium text-primary leading-tight">{l.name}</p>
                      <p className="text-xs text-muted">{l.category}</p>
                    </td>
                    <td className="px-3 py-2.5"><ScoreRing score={l.total_score ?? 0} /></td>
                    <td className="px-3 py-2.5">{l.qual_priority && <PriorityBadge priority={l.qual_priority} />}</td>
                    <td className="px-3 py-2.5 hidden sm:table-cell">
                      {l.cost_min && l.cost_max ? (
                        <span className="text-xs text-secondary tabular-nums">{formatCurrencyRange(l.cost_min, l.cost_max)} · {l.weeks_min && l.weeks_max ? formatWeeksRange(l.weeks_min, l.weeks_max) : ''}</span>
                      ) : (
                        <span className="text-xs text-muted">Not started</span>
                      )}
                    </td>
                    <td className="px-3 py-2.5 hidden md:table-cell">{l.pipeline_status && <PipelineBadge status={l.pipeline_status} />}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <div className="space-y-4">
          <Card className="p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-primary flex items-center gap-1.5"><Clock className="w-4 h-4 text-muted" /> Due follow-ups</h2>
              <Link to="/follow-ups" className="text-xs text-primary-600 dark:text-primary-400 hover:underline">View all</Link>
            </div>
            <div className="space-y-2.5">
              {mockFollowUps.map((f) => (
                <div key={f.place_id} className="flex items-center justify-between gap-2 text-sm">
                  <div className="min-w-0">
                    <p className="font-medium text-primary truncate">{f.name}</p>
                    <p className="text-xs text-muted">{f.days_since_contact}d since contact · due {f.next_follow_up_date}</p>
                  </div>
                  <Link to={`/leads/${encodeURIComponent(f.place_id)}`} className="text-xs font-medium text-primary-600 dark:text-primary-400 hover:underline shrink-0">Open</Link>
                </div>
              ))}
            </div>
          </Card>
          <Card className="p-5">
            <h2 className="text-sm font-semibold text-primary mb-3">Best converting categories</h2>
            <div className="space-y-2.5">
              {[...mockInsights].sort((a, b) => b.conversion_rate - a.conversion_rate).slice(0, 4).map((c) => (
                <div key={c.category}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-secondary capitalize">{c.category}</span>
                    <span className="tabular-nums font-medium text-primary">{c.conversion_rate}%</span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-success-500 rounded-full" style={{ width: `${Math.min(100, c.conversion_rate * 4)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
