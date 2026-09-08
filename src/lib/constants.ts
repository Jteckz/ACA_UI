export const CATEGORIES = [
  'restaurant', 'cafe', 'fast food', 'bar', 'hotel', 'guesthouse',
  'school', 'college', 'hospital', 'clinic', 'pharmacy', 'dentist',
  'salon', 'hair salon', 'supermarket', 'grocery', 'bank',
  'real estate', 'gym', 'car repair', 'bakery', 'clothing store',
  'electronics store', 'furniture store', 'law firm', 'accountant',
] as const;

export const PIPELINE_STATUSES = [
  'New', 'Qualified', 'Proposal Sent', 'Contacted', 'Warm',
  'Future Opportunity', 'Not Interested', 'Won', 'Lost',
] as const;

export const INTEREST_LEVELS = ['Unknown', 'Low', 'Medium', 'High'] as const;

export const DRAFT_STATUSES = ['Pending Approval', 'Approved', 'Sent', 'Rejected'] as const;

export const RESPONSE_CLASSIFICATIONS = [
  'Warm Lead', 'Future Opportunity', 'Not Interested', 'Needs More Info', 'Converted',
] as const;

export const CHANNELS = ['email', 'linkedin', 'whatsapp'] as const;

export const FUNNEL_STAGES = [
  { key: 'businesses_found', label: 'Found' },
  { key: 'analyzed', label: 'Analyzed' },
  { key: 'qualified', label: 'Qualified' },
  { key: 'proposals_generated', label: 'Proposals' },
  { key: 'outreach_drafted', label: 'Drafted' },
  { key: 'outreach_approved', label: 'Approved' },
  { key: 'outreach_sent', label: 'Sent' },
  { key: 'responses_logged', label: 'Responses' },
  { key: 'interested', label: 'Interested' },
  { key: 'clients_won', label: 'Won' },
] as const;

export const PRIORITY_COLORS: Record<string, { dot: string; text: string; bg: string }> = {
  High: { dot: 'bg-danger-500', text: 'text-danger-600 dark:text-danger-500', bg: 'bg-danger-50 dark:bg-danger-500/10' },
  Medium: { dot: 'bg-accent-500', text: 'text-accent-600 dark:text-accent-400', bg: 'bg-accent-500/10' },
  Low: { dot: 'bg-secondary-400', text: 'text-secondary-500 dark:text-secondary-400', bg: 'bg-secondary-100 dark:bg-secondary-800' },
};

export const STATUS_COLORS: Record<string, { dot: string; text: string; bg: string }> = {
  'Pending Approval': { dot: 'bg-accent-500', text: 'text-accent-600 dark:text-accent-400', bg: 'bg-accent-500/10' },
  'Approved': { dot: 'bg-success-500', text: 'text-success-600 dark:text-success-500', bg: 'bg-success-50 dark:bg-success-500/10' },
  'Sent': { dot: 'bg-primary-500', text: 'text-primary-600 dark:text-primary-400', bg: 'bg-primary-50 dark:bg-primary-500/10' },
  'Rejected': { dot: 'bg-secondary-400', text: 'text-secondary-500 dark:text-secondary-400', bg: 'bg-secondary-100 dark:bg-secondary-800' },
};

export const PIPELINE_COLORS: Record<string, { dot: string; text: string; bg: string }> = {
  'New': { dot: 'bg-secondary-400', text: 'text-secondary-600 dark:text-secondary-400', bg: 'bg-secondary-100 dark:bg-secondary-800' },
  'Qualified': { dot: 'bg-primary-400', text: 'text-primary-600 dark:text-primary-400', bg: 'bg-primary-50 dark:bg-primary-500/10' },
  'Proposal Sent': { dot: 'bg-primary-500', text: 'text-primary-600 dark:text-primary-400', bg: 'bg-primary-50 dark:bg-primary-500/10' },
  'Contacted': { dot: 'bg-accent-500', text: 'text-accent-600 dark:text-accent-400', bg: 'bg-accent-500/10' },
  'Warm': { dot: 'bg-success-500', text: 'text-success-600 dark:text-success-500', bg: 'bg-success-50 dark:bg-success-500/10' },
  'Future Opportunity': { dot: 'bg-accent-400', text: 'text-accent-600 dark:text-accent-400', bg: 'bg-accent-500/10' },
  'Not Interested': { dot: 'bg-secondary-400', text: 'text-secondary-500 dark:text-secondary-400', bg: 'bg-secondary-100 dark:bg-secondary-800' },
  'Won': { dot: 'bg-success-500', text: 'text-success-600 dark:text-success-500', bg: 'bg-success-50 dark:bg-success-500/10' },
  'Lost': { dot: 'bg-danger-500', text: 'text-danger-600 dark:text-danger-500', bg: 'bg-danger-50 dark:bg-danger-500/10' },
};

export const RESPONSE_COLORS: Record<string, { dot: string; text: string; bg: string }> = {
  'Warm Lead': { dot: 'bg-success-500', text: 'text-success-600 dark:text-success-500', bg: 'bg-success-50 dark:bg-success-500/10' },
  'Converted': { dot: 'bg-success-500', text: 'text-success-600 dark:text-success-500', bg: 'bg-success-50 dark:bg-success-500/10' },
  'Needs More Info': { dot: 'bg-primary-400', text: 'text-primary-600 dark:text-primary-400', bg: 'bg-primary-50 dark:bg-primary-500/10' },
  'Future Opportunity': { dot: 'bg-accent-400', text: 'text-accent-600 dark:text-accent-400', bg: 'bg-accent-500/10' },
  'Not Interested': { dot: 'bg-secondary-400', text: 'text-secondary-500 dark:text-secondary-400', bg: 'bg-secondary-100 dark:bg-secondary-800' },
};

export const DEFAULT_SETTINGS: Settings = {
  llm_provider: 'ollama',
  ollama_host: 'http://localhost:11434',
  ollama_worker_model: 'qwen2.5:3b',
  ollama_reasoning_model: 'qwen2.5:7b',
  ollama_keep_alive: '5m',
  reasoning_model_enabled: true,
  followup_escalation_score: 90,
  database_path: './data/leads.db',
  min_qualification_score_for_proposal: 40,
  followup_after_days: 7,
  min_sample_size_for_insights: 5,
};

import type { Settings } from './types';
