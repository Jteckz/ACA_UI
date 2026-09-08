import { Link } from 'react-router-dom';
import { CalendarClock, PhoneCall } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { useToast } from '@/components/ui/Toast';
import { mockFollowUps } from '@/lib/mockData';
import { useDataStore } from '@/store/dataStore';

export default function FollowUps() {
  const { toast } = useToast();
  const touchContact = useDataStore((s) => s.touchContact);

  if (mockFollowUps.length === 0) {
    return (
      <div className="space-y-4 animate-fade-in">
        <h1 className="text-xl font-semibold text-primary">Follow-ups</h1>
        <EmptyState illustration="check" title="All caught up" description="No leads are due for follow-up right now." />
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fade-in">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-primary">Follow-ups</h1>
        <p className="text-sm text-secondary mt-1">{mockFollowUps.length} leads due — ordered by days since last contact.</p>
      </div>
      <div className="space-y-3">
        {[...mockFollowUps].sort((a, b) => b.days_since_contact - a.days_since_contact).map((f) => (
          <Card key={f.place_id} className="p-4 flex flex-wrap items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${f.days_since_contact >= 10 ? 'bg-danger-50 dark:bg-danger-500/10 text-danger-600' : 'bg-accent-500/10 text-accent-600'}`}>
              <CalendarClock className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-[200px]">
              <Link to={`/leads/${encodeURIComponent(f.place_id)}`} className="font-medium text-primary hover:underline">{f.name}</Link>
              <p className="text-xs text-muted capitalize">{f.category} · last contact {f.last_contact_date} ({f.days_since_contact}d ago) · due {f.next_follow_up_date}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" onClick={() => { touchContact(f.place_id); toast({ type: 'success', title: 'Snoozed 7 days', description: f.name }); }}>Snooze</Button>
              <Button variant="primary" size="sm" icon={<PhoneCall className="w-3.5 h-3.5" />} onClick={() => { touchContact(f.place_id); toast({ type: 'success', title: 'Contact logged', description: f.name }); }}>Log contact</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
