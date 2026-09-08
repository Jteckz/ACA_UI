import { useState } from 'react';
import { RotateCcw, Save } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Input, Select, Toggle } from '@/components/ui/Input';
import { useToast } from '@/components/ui/Toast';
import { useDataStore } from '@/store/dataStore';
import { DEFAULT_SETTINGS } from '@/lib/constants';
import { validateSettings, formatBytes } from '@/lib/utils';
import { mockModelStatus } from '@/lib/mockData';

export default function Settings() {
  const settings = useDataStore((s) => s.settings);
  const updateSettings = useDataStore((s) => s.updateSettings);
  const resetAll = useDataStore((s) => s.resetAll);
  const { toast } = useToast();
  const [form, setForm] = useState(settings);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (k: keyof typeof form, v: never) => setForm((f) => ({ ...f, [k]: v }));

  const save = () => {
    const errs = validateSettings(form);
    setErrors(errs);
    if (Object.keys(errs).length) {
      toast({ type: 'error', title: 'Fix validation errors', description: Object.values(errs)[0] });
      return;
    }
    updateSettings(form);
    toast({ type: 'success', title: 'Settings saved' });
  };

  return (
    <div className="space-y-4 animate-fade-in max-w-3xl">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-primary">Settings</h1>
        <p className="text-sm text-secondary mt-1">LLM provider, scoring thresholds, and pipeline automation. Stored locally in this demo.</p>
      </div>

      <Card className="p-5 space-y-4">
        <h2 className="text-sm font-semibold text-primary">LLM provider</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          <Select label="Provider" value={form.llm_provider} onChange={(e) => set('llm_provider', e.target.value as never)} options={[{ value: 'ollama', label: 'Ollama (local)' }, { value: 'groq', label: 'Groq (cloud)' }]} />
          <Input label="Ollama host" value={form.ollama_host} onChange={(e) => set('ollama_host', e.target.value as never)} error={errors.ollama_host} />
          <Input label="Worker model" value={form.ollama_worker_model} onChange={(e) => set('ollama_worker_model', e.target.value as never)} error={errors.ollama_worker_model} helpText="Fast model for scoring + drafting" />
          <Input label="Reasoning model" value={form.ollama_reasoning_model} onChange={(e) => set('ollama_reasoning_model', e.target.value as never)} error={errors.ollama_reasoning_model} helpText="Larger model for proposals" />
        </div>
        <Toggle checked={form.reasoning_model_enabled} onChange={(v) => set('reasoning_model_enabled', v as never)} label="Enable reasoning model" description="Use the larger model for proposals and insights (slower, higher quality)." />
      </Card>

      <Card className="p-5 space-y-4">
        <h2 className="text-sm font-semibold text-primary">Pipeline automation</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          <Input label="Min score for proposal" type="number" value={String(form.min_qualification_score_for_proposal)} onChange={(e) => set('min_qualification_score_for_proposal', Number(e.target.value) as never)} error={errors.min_qualification_score_for_proposal} />
          <Input label="Follow up after (days)" type="number" value={String(form.followup_after_days)} onChange={(e) => set('followup_after_days', Number(e.target.value) as never)} error={errors.followup_after_days} />
          <Input label="Follow-up escalation score" type="number" value={String(form.followup_escalation_score)} onChange={(e) => set('followup_escalation_score', Number(e.target.value) as never)} error={errors.followup_escalation_score} />
          <Input label="Min sample for insights" type="number" value={String(form.min_sample_size_for_insights)} onChange={(e) => set('min_sample_size_for_insights', Number(e.target.value) as never)} error={errors.min_sample_size_for_insights} />
        </div>
        <Input label="Database path" value={form.database_path} onChange={(e) => set('database_path', e.target.value as never)} helpText="Used by the Python agent backend; the web demo persists to localStorage." />
      </Card>

      <Card className="p-5">
        <h2 className="text-sm font-semibold text-primary mb-3">Loaded models</h2>
        <div className="space-y-2">
          {mockModelStatus.map((m) => (
            <div key={m.name} className="flex items-center justify-between text-sm p-2.5 rounded-lg bg-subtle border border-subtle">
              <span className="font-mono text-primary">{m.name}</span>
              <span className="text-xs text-muted tabular-nums">{formatBytes(m.size_vram)} VRAM</span>
            </div>
          ))}
        </div>
      </Card>

      <div className="flex gap-2">
        <Button variant="primary" icon={<Save className="w-4 h-4" />} onClick={save}>Save settings</Button>
        <Button variant="secondary" icon={<RotateCcw className="w-4 h-4" />} onClick={() => { setForm(DEFAULT_SETTINGS); updateSettings(DEFAULT_SETTINGS); resetAll(); toast({ type: 'info', title: 'Reset to defaults' }); }}>Reset demo data</Button>
      </div>
    </div>
  );
}
