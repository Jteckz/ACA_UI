import type { Settings } from './types';

export function formatDate(date: string | null): string {
  if (!date) return '—';
  const d = new Date(date);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

export function formatDateShort(date: string | null): string {
  if (!date) return '—';
  const d = new Date(date);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function formatRelative(date: string | null): string {
  if (!date) return '—';
  const d = new Date(date);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return formatDateShort(date);
}

export function formatCurrency(value: number): string {
  return '$' + value.toLocaleString('en-US');
}

export function formatCurrencyRange(min: number, max: number): string {
  return `${formatCurrency(min)} – ${formatCurrency(max)}`;
}

export function formatWeeksRange(min: number, max: number): string {
  return `${min} – ${max} weeks`;
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}

export function getPriorityColor(score: number): 'High' | 'Medium' | 'Low' {
  if (score >= 70) return 'High';
  if (score >= 40) return 'Medium';
  return 'Low';
}

export function truncate(str: string, max: number): string {
  if (str.length <= max) return str;
  return str.slice(0, max).trimEnd() + '…';
}

export function cn(...classes: (string | false | undefined | null | 0)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text);
}

export function downloadCSV(filename: string, rows: string[][]): void {
  const csv = rows.map(row =>
    row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(',')
  ).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function validateSettings(settings: Partial<Settings>): Record<string, string> {
  const errors: Record<string, string> = {};
  if (settings.ollama_host !== undefined) {
    try { new URL(settings.ollama_host); } catch { errors.ollama_host = 'Must be a valid URL'; }
  }
  if (settings.ollama_worker_model !== undefined && !settings.ollama_worker_model.trim()) {
    errors.ollama_worker_model = 'Model name cannot be empty';
  }
  if (settings.ollama_reasoning_model !== undefined && !settings.ollama_reasoning_model.trim()) {
    errors.ollama_reasoning_model = 'Model name cannot be empty';
  }
  if (settings.followup_escalation_score !== undefined && (settings.followup_escalation_score < 0 || settings.followup_escalation_score > 100)) {
    errors.followup_escalation_score = 'Score must be between 0 and 100';
  }
  if (settings.min_qualification_score_for_proposal !== undefined && (settings.min_qualification_score_for_proposal < 0 || settings.min_qualification_score_for_proposal > 100)) {
    errors.min_qualification_score_for_proposal = 'Score must be between 0 and 100';
  }
  if (settings.followup_after_days !== undefined && (settings.followup_after_days < 1 || settings.followup_after_days > 90)) {
    errors.followup_after_days = 'Must be between 1 and 90';
  }
  if (settings.min_sample_size_for_insights !== undefined && (settings.min_sample_size_for_insights < 1 || settings.min_sample_size_for_insights > 100)) {
    errors.min_sample_size_for_insights = 'Must be between 1 and 100';
  }
  return errors;
}
