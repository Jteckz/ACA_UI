import { useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Globe, Phone, MapPin, Star, Copy, Check, FileText } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { PriorityBadge, PipelineBadge, StatusBadge } from '@/components/ui/Badge';
import { ScoreRing, ScoreBar } from '@/components/ui/ScoreRing';
import { Select } from '@/components/ui/Input';
import { EmptyState } from '@/components/ui/EmptyState';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/components/ui/Toast';
import { useDataStore } from '@/store/dataStore';
import { mockLeadDetails } from '@/lib/mockData';
import { PIPELINE_STATUSES } from '@/lib/constants';
import { copyToClipboard, formatCurrencyRange, formatWeeksRange, formatDate } from '@/lib/utils';

export default function LeadDetail() {
  const { id } = useParams();
  const placeId = id ? decodeURIComponent(id) : '';
  const leads = useDataStore((s) => s.leads);
  const crm = useDataStore((s) => s.crm);
  const proposals = useDataStore((s) => s.proposals);
  const drafts = useDataStore((s) => s.drafts);
  const updatePipeline = useDataStore((s) => s.updatePipeline);
  const addProposal = useDataStore((s) => s.addProposal);
  const touchContact = useDataStore((s) => s.touchContact);
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [proposalOpen, setProposalOpen] = useState(false);

  const lead = leads.find((l) => l.place_id === placeId);
  const detail = mockLeadDetails[placeId];
  const crmRec = crm[placeId];
  const myProposals = useMemo(() => proposals.filter((p) => p.place_id === placeId), [proposals, placeId]);
  const myDrafts = useMemo(() => drafts.filter((d) => d.place_id === placeId), [drafts, placeId]);

  if (!lead) {
    return <EmptyState illustration="search" title="Lead not found" description="This business is not in the current dataset." primaryAction={{ label: 'Back to leads', onClick: () => window.history.back() }} />;
  }

  const copySummary = async () => {
    await copyToClipboard(`${lead.name} (${lead.category}) — score ${lead.lead_score} [${lead.priority}]\nProblems: ${lead.problems.join('; ')}\nSolutions: ${lead.solutions.join('; ')}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
    toast({ type: 'success', title: 'Summary copied' });
  };

  const generateProposal = () => {
    const nextId = Math.max(0, ...proposals.map((p) => p.id)) + 1;
    addProposal({
      id: nextId,
      place_id: placeId,
      business_name: lead.name,
      package_name: `${lead.category[0]?.toUpperCase()}${lead.category.slice(1)} Digital Platform`,
      executive_summary: `${lead.name} shows clear digital gaps (${lead.problems.slice(0, 2).join('; ')}). This package delivers ${lead.solutions.slice(0, 2).join(' + ')} to unlock revenue and efficiency.`,
      identified_challenges: lead.problems,
      features: [...lead.solutions, 'Mobile-friendly website', 'Analytics dashboard'],
      tech_stack: { frontend: 'React', backend: 'FastAPI', database: 'PostgreSQL', hosting: 'DigitalOcean', reasoning: 'Proven, cost-effective stack for the region.' },
      cost_min: 1800 + (lead.lead_score * 20),
      cost_max: 3200 + (lead.lead_score * 40),
      weeks_min: 4,
      weeks_max: 7,
      expected_benefits: ['More inbound inquiries', 'Lower manual overhead', 'Professional online presence'],
      status: 'Draft',
      pdf_path: null,
      created_at: new Date().toISOString(),
    });
    updatePipeline(placeId, 'Proposal Sent');
    setProposalOpen(false);
    toast({ type: 'success', title: 'Proposal generated', description: `Draft proposal created for ${lead.name}.` });
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <Link to="/leads" className="inline-flex items-center gap-1.5 text-sm text-secondary hover:text-primary transition-fast"><ArrowLeft className="w-4 h-4" /> All leads</Link>

      <Card className="p-5">
        <div className="flex flex-wrap gap-4 items-start">
          <ScoreRing score={lead.lead_score} size={64} />
          <div className="flex-1 min-w-[220px]">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-lg font-semibold text-primary">{lead.name}</h1>
              <PriorityBadge priority={lead.priority} />
              <PipelineBadge status={crmRec?.pipeline_status ?? lead.pipeline_status} />
            </div>
            <p className="text-sm text-muted capitalize mt-0.5">{lead.category} · discovered {formatDate(lead.discovered_at)}</p>
            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-[13px] text-secondary">
              {lead.website && <span className="inline-flex items-center gap-1"><Globe className="w-3.5 h-3.5 text-muted" />{lead.website}</span>}
              {lead.phone && <span className="inline-flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-muted" />{lead.phone}</span>}
              {lead.address && <span className="inline-flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-muted" />{lead.address}</span>}
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" size="sm" icon={copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />} onClick={copySummary}>Copy</Button>
            <Button variant="secondary" size="sm" onClick={() => { touchContact(placeId); toast({ type: 'success', title: 'Marked as contacted' }); }}>Log contact</Button>
            <Button variant="primary" size="sm" icon={<FileText className="w-3.5 h-3.5" />} onClick={() => setProposalOpen(true)}>New proposal</Button>
          </div>
        </div>
        <div className="grid sm:grid-cols-3 gap-3 mt-4">
          <Select label="Pipeline stage" value={crmRec?.pipeline_status ?? lead.pipeline_status} onChange={(e) => { updatePipeline(placeId, e.target.value as never); toast({ type: 'info', title: `Moved to ${e.target.value}` }); }} options={PIPELINE_STATUSES.map((s) => ({ value: s, label: s }))} />
          <div className="text-[13px] text-secondary self-end pb-2">Potential value: <strong className="text-primary">{lead.potential_value}</strong> · Qual score: <strong className="text-primary tabular-nums">{lead.total_qualification_score}</strong></div>
          <div className="text-[13px] text-secondary self-end pb-2">Interest: <strong className="text-primary">{crmRec?.interest_level ?? 'Unknown'}</strong>{crmRec?.next_follow_up_date ? ` · Follow up ${crmRec.next_follow_up_date}` : ''}</div>
        </div>
      </Card>

      <div className="grid lg:grid-cols-2 gap-4">
        <Card className="p-5">
          <h2 className="text-sm font-semibold text-primary mb-3">Problems → Solutions</h2>
          <div className="space-y-2">
            {lead.problems.map((p, i) => (
              <div key={p} className="text-[13px] p-2.5 rounded-lg bg-subtle border border-subtle">
                <p className="text-danger-600 dark:text-danger-500 font-medium">✕ {p}</p>
                {lead.solutions[i] && <p className="text-success-600 dark:text-success-500 mt-1">→ {lead.solutions[i]}</p>}
              </div>
            ))}
          </div>
          {detail && (
            <div className="mt-4">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-muted mb-2">Why this score</h3>
              <ul className="text-[13px] text-secondary space-y-1">{detail.score_reasons.map((r) => <li key={r}>• {r}</li>)}</ul>
            </div>
          )}
        </Card>

        <Card className="p-5">
          <h2 className="text-sm font-semibold text-primary mb-3">Qualification breakdown</h2>
          {detail ? (
            <div className="space-y-3">
              <ScoreBar label="Business activity" score={detail.qualification.business_activity_score} max={30} />
              <ScoreBar label="Digital presence" score={detail.qualification.digital_presence_score + 20} max={40} />
              <ScoreBar label="Ability to pay" score={detail.qualification.ability_to_pay_score} max={30} />
              <ScoreBar label="Solution need" score={detail.qualification.solution_need_score} max={40} />
              <div className="pt-2 border-t border-subtle space-y-1">
                {detail.qualification.reasoning.map((r) => <p key={r} className="text-xs text-secondary">• {r}</p>)}
              </div>
              <div className="grid grid-cols-2 gap-3 text-[13px]">
                <div className="p-2.5 rounded-lg bg-subtle"><p className="text-muted text-xs">Reachability</p><p className="font-semibold text-primary tabular-nums">{detail.research.reachability.reachability_score}/100</p><p className="text-xs text-secondary">{detail.research.reachability.email_found ?? 'No email found'}</p></div>
                <div className="p-2.5 rounded-lg bg-subtle"><p className="text-muted text-xs">Social</p><p className="font-semibold text-primary">{detail.research.social.platforms_found.join(', ') || 'None found'}</p><p className="text-xs text-secondary">Missing: {detail.research.social.platforms_missing.slice(0, 2).join(', ')}</p></div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted">Detailed research not yet available for this lead — discovery data only.</p>
          )}
          {detail?.business.rating && (
            <p className="text-xs text-secondary mt-3 inline-flex items-center gap-1"><Star className="w-3.5 h-3.5 text-accent-500" /> {detail.business.rating} ({detail.business.rating_count} reviews)</p>
          )}
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <Card className="p-5">
          <h2 className="text-sm font-semibold text-primary mb-3">Proposals ({myProposals.length})</h2>
          {myProposals.length === 0 ? <p className="text-sm text-muted">No proposals yet.</p> : (
            <div className="space-y-3">
              {myProposals.map((p) => (
                <div key={p.id} className="p-3 rounded-xl border border-subtle bg-subtle/50">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <p className="font-medium text-primary text-sm">{p.package_name}</p>
                    <StatusBadge status={p.status} />
                  </div>
                  <p className="text-xs text-secondary mt-1 line-clamp-2">{p.executive_summary}</p>
                  <p className="text-xs tabular-nums text-secondary mt-1.5">{formatCurrencyRange(p.cost_min, p.cost_max)} · {formatWeeksRange(p.weeks_min, p.weeks_max)} · {p.tech_stack.frontend}/{p.tech_stack.backend}</p>
                </div>
              ))}
            </div>
          )}
        </Card>
        <Card className="p-5">
          <h2 className="text-sm font-semibold text-primary mb-3">Outreach ({myDrafts.length})</h2>
          {myDrafts.length === 0 ? <p className="text-sm text-muted">No outreach drafts yet.</p> : (
            <div className="space-y-3">
              {myDrafts.map((d) => (
                <div key={d.id} className="p-3 rounded-xl border border-subtle bg-subtle/50">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-mono uppercase text-muted">{d.channel}</span>
                    <StatusBadge status={d.status} />
                  </div>
                  <p className="text-sm font-medium text-primary mt-1">{d.subject ?? '(no subject)'}</p>
                  <p className="text-xs text-secondary italic mt-0.5">“{d.personalization_hook}”</p>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <Modal open={proposalOpen} onClose={() => setProposalOpen(false)} title={`New proposal — ${lead.name}`} description="Auto-drafted from detected problems and solutions." footer={<><Button variant="secondary" size="sm" onClick={() => setProposalOpen(false)}>Cancel</Button><Button variant="primary" size="sm" onClick={generateProposal}>Generate</Button></>}>
        <ul className="text-sm text-secondary space-y-1.5 py-2">
          {lead.problems.map((p) => <li key={p}>• {p}</li>)}
        </ul>
      </Modal>
    </div>
  );
}
