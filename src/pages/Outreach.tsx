import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, Send, X, Eye } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { FilterPills, Select } from '@/components/ui/Input';
import { StatusBadge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/components/ui/Toast';
import { useDataStore } from '@/store/dataStore';
import type { OutreachDraft } from '@/lib/types';

export default function Outreach() {
  const drafts = useDataStore((s) => s.drafts);
  const updateDraftStatus = useDataStore((s) => s.updateDraftStatus);
  const touchContact = useDataStore((s) => s.touchContact);
  const { toast } = useToast();
  const [channel, setChannel] = useState('all');
  const [status, setStatus] = useState('all');
  const [viewing, setViewing] = useState<OutreachDraft | null>(null);

  const filtered = useMemo(
    () => drafts.filter((d) => (channel === 'all' || d.channel === channel) && (status === 'all' || d.status === status)),
    [drafts, channel, status]
  );

  const act = (d: OutreachDraft, next: OutreachDraft['status']) => {
    updateDraftStatus(d.id, next);
    if (next === 'Sent') touchContact(d.place_id);
    toast({ type: next === 'Rejected' ? 'warning' : 'success', title: `Draft ${next.toLowerCase()}`, description: `${d.business_name} · ${d.channel}` });
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-primary">Outreach</h1>
        <p className="text-sm text-secondary mt-1">Review AI-drafted messages, approve, personalize, then send. Sending logs the contact for follow-ups.</p>
      </div>

      <Card className="p-4 flex flex-wrap gap-3 items-center">
        <FilterPills value={channel} onChange={setChannel} options={[{ value: 'all', label: 'All channels' }, { value: 'email', label: 'Email' }, { value: 'linkedin', label: 'LinkedIn' }, { value: 'whatsapp', label: 'WhatsApp' }]} />
        <div className="w-52 ml-auto"><Select value={status} onChange={(e) => setStatus(e.target.value)} options={[{ value: 'all', label: 'All statuses' }, { value: 'Pending Approval', label: 'Pending' }, { value: 'Approved', label: 'Approved' }, { value: 'Sent', label: 'Sent' }, { value: 'Rejected', label: 'Rejected' }]} aria-label="Status filter" /></div>
      </Card>

      {filtered.length === 0 ? (
        <EmptyState illustration="message" title="No drafts" description="No outreach matches this filter. Approve flows will appear here after discovery." />
      ) : (
        <div className="grid lg:grid-cols-2 gap-3">
          {filtered.map((d) => (
            <Card key={d.id} className="p-4">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono uppercase px-2 py-0.5 rounded-full bg-muted text-secondary">{d.channel}</span>
                  <StatusBadge status={d.status} />
                </div>
                <Link to={`/leads/${encodeURIComponent(d.place_id)}`} className="text-xs text-primary-600 dark:text-primary-400 hover:underline">{d.business_name}</Link>
              </div>
              <p className="text-sm font-semibold text-primary mt-2">{d.subject ?? '(no subject — LinkedIn/WhatsApp)'}</p>
              <p className="text-xs text-accent-600 dark:text-accent-400 italic mt-1">“{d.personalization_hook}”</p>
              <p className="text-[13px] text-secondary mt-2 line-clamp-3 whitespace-pre-line">{d.body}</p>
              <div className="flex flex-wrap gap-2 mt-3">
                <Button variant="secondary" size="sm" icon={<Eye className="w-3.5 h-3.5" />} onClick={() => setViewing(d)}>View</Button>
                {d.status === 'Pending Approval' && (
                  <>
                    <Button variant="primary" size="sm" icon={<Check className="w-3.5 h-3.5" />} onClick={() => act(d, 'Approved')}>Approve</Button>
                    <Button variant="secondary" size="sm" icon={<X className="w-3.5 h-3.5" />} onClick={() => act(d, 'Rejected')}>Reject</Button>
                  </>
                )}
                {(d.status === 'Approved' || d.status === 'Pending Approval') && (
                  <Button variant="secondary" size="sm" icon={<Send className="w-3.5 h-3.5" />} onClick={() => act(d, 'Sent')}>Mark sent</Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal open={!!viewing} onClose={() => setViewing(null)} title={viewing ? `${viewing.business_name} · ${viewing.channel}` : ''} description={viewing?.subject ?? undefined} footer={viewing ? (<><Button variant="secondary" size="sm" onClick={() => setViewing(null)}>Close</Button>{viewing.status !== 'Sent' && viewing.status !== 'Rejected' && <Button variant="primary" size="sm" onClick={() => { act(viewing, 'Approved'); setViewing(null); }}>Approve</Button>}</>) : undefined}>
        {viewing && <div className="py-2 text-sm text-secondary whitespace-pre-line">{viewing.body}</div>}
      </Modal>
    </div>
  );
}
