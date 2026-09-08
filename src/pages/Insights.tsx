import Card from '@/components/ui/Card';
import { mockInsights, mockFunnelMetrics, mockResponses } from '@/lib/mockData';
import { DonutChart } from '@/components/ui/ScoreRing';
import { ResponseBadge } from '@/components/ui/Badge';

export default function Insights() {
  const m = mockFunnelMetrics;
  const conv = (a: number, b: number) => (a === 0 ? 0 : Math.round((b / a) * 100));

  return (
    <div className="space-y-4 animate-fade-in">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-primary">Insights</h1>
        <p className="text-sm text-secondary mt-1">What converts, where leads stall, and how responses break down.</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-3">
        <Card className="p-4 text-center"><p className="text-2xl font-semibold tabular-nums text-primary">{conv(m.businesses_found, m.qualified)}%</p><p className="text-xs text-secondary mt-1">Found → qualified</p></Card>
        <Card className="p-4 text-center"><p className="text-2xl font-semibold tabular-nums text-primary">{conv(m.outreach_sent, m.responses_logged)}%</p><p className="text-xs text-secondary mt-1">Sent → response</p></Card>
        <Card className="p-4 text-center"><p className="text-2xl font-semibold tabular-nums text-primary">{conv(m.responses_logged, m.clients_won)}%</p><p className="text-xs text-secondary mt-1">Response → won</p></Card>
      </div>

      <div className="grid lg:grid-cols-5 gap-4">
        <Card className="p-5 lg:col-span-3 overflow-hidden">
          <h2 className="text-sm font-semibold text-primary mb-3">Performance by category</h2>
          <div className="overflow-x-auto -mx-5 px-5">
            <table className="w-full text-sm min-w-[560px]">
              <thead>
                <tr className="text-left text-[11px] uppercase tracking-wide text-muted border-b border-subtle">
                  <th className="py-2 font-medium">Category</th>
                  <th className="py-2 font-medium text-right">Total</th>
                  <th className="py-2 font-medium text-right">Contacted</th>
                  <th className="py-2 font-medium text-right">Replied</th>
                  <th className="py-2 font-medium text-right">Won</th>
                  <th className="py-2 font-medium text-right">Conv.</th>
                </tr>
              </thead>
              <tbody>
                {[...mockInsights].sort((a, b) => b.conversion_rate - a.conversion_rate).map((c) => (
                  <tr key={c.category} className="border-b border-subtle last:border-0">
                    <td className="py-2.5 pr-3"><p className="font-medium text-primary capitalize">{c.category}</p><p className="text-[11px] text-muted">{c.common_package ?? 'No common package'}</p></td>
                    <td className="py-2.5 text-right tabular-nums text-secondary">{c.total}</td>
                    <td className="py-2.5 text-right tabular-nums text-secondary">{c.contacted}</td>
                    <td className="py-2.5 text-right tabular-nums text-secondary">{c.replied}</td>
                    <td className="py-2.5 text-right tabular-nums text-secondary">{c.converted}</td>
                    <td className="py-2.5 text-right"><span className="inline-flex min-w-12 justify-center px-2 py-0.5 rounded-full text-xs font-medium tabular-nums bg-success-50 dark:bg-success-500/10 text-success-600">{c.conversion_rate}%</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
        <Card className="p-5 lg:col-span-2">
          <h2 className="text-sm font-semibold text-primary mb-3">Response breakdown</h2>
          <div className="flex justify-center">
            <DonutChart
              size={150}
              strokeWidth={18}
              segments={[
                { value: mockResponses.filter((r) => r.classified_status === 'Converted').length || 1, color: 'var(--color-success-500)', label: 'Converted' },
                { value: mockResponses.filter((r) => r.classified_status === 'Warm Lead').length || 1, color: 'var(--color-primary-500)', label: 'Warm' },
                { value: mockResponses.filter((r) => r.classified_status === 'Needs More Info').length || 1, color: 'var(--color-accent-500)', label: 'Info' },
              ]}
              centerValue={String(mockResponses.length)}
              centerLabel="responses"
            />
          </div>
          <div className="space-y-2 mt-4">
            {mockResponses.map((r) => (
              <div key={r.id} className="p-2.5 rounded-lg bg-subtle border border-subtle">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-xs font-mono text-muted">{r.place_id}</span>
                  <ResponseBadge status={r.classified_status} />
                </div>
                <p className="text-xs text-secondary line-clamp-2">“{r.response_text}”</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
