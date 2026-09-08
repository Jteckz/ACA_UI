export interface Business {
  place_id: string;
  name: string;
  category: string;
  website: string | null;
  phone: string | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  rating: number | null;
  rating_count: number | null;
  social_links: string[];
  source: string;
  discovered_at: string;
}

export interface WebsiteFindings {
  has_website: boolean;
  reachable: boolean;
  is_mobile_friendly: boolean | null;
  has_ssl: boolean | null;
  title: string | null;
  signals_found: string[];
  signals_missing: string[];
  social_links: string[];
  notes: string[];
}

export interface SocialFindings {
  platforms_found: string[];
  platforms_missing: string[];
  notes: string[];
}

export interface ReachabilityInfo {
  email_found: string | null;
  contactable_channels: string[];
  reachability_score: number;
}

export interface ResearchBundle {
  website: WebsiteFindings;
  social: SocialFindings;
  reachability: ReachabilityInfo;
}

export interface QualificationScore {
  business_activity_score: number;
  digital_presence_score: number;
  ability_to_pay_score: number;
  solution_need_score: number;
  total_score: number;
  priority: 'Low' | 'Medium' | 'High';
  reasoning: string[];
}

export interface ProposalDocument {
  id: number;
  place_id: string;
  business_name: string;
  package_name: string;
  executive_summary: string;
  identified_challenges: string[];
  features: string[];
  tech_stack: {
    frontend: string;
    backend: string;
    database: string;
    hosting: string;
    reasoning: string;
  };
  cost_min: number;
  cost_max: number;
  weeks_min: number;
  weeks_max: number;
  expected_benefits: string[];
  status: string;
  pdf_path: string | null;
  created_at: string;
}

export interface OutreachDraft {
  id: number;
  place_id: string;
  business_name: string;
  channel: 'email' | 'linkedin' | 'whatsapp';
  subject: string | null;
  personalization_hook: string;
  body: string;
  status: 'Pending Approval' | 'Approved' | 'Sent' | 'Rejected';
  created_at: string;
  approved_at: string | null;
  sent_at: string | null;
}

export interface ResponseRecord {
  id: number;
  place_id: string;
  outreach_draft_id: number;
  response_text: string;
  classified_status: 'Warm Lead' | 'Future Opportunity' | 'Not Interested' | 'Needs More Info' | 'Converted';
  analyzed_at: string | null;
}

export interface CRMLead {
  place_id: string;
  pipeline_status: 'New' | 'Qualified' | 'Proposal Sent' | 'Contacted' | 'Warm' | 'Future Opportunity' | 'Not Interested' | 'Won' | 'Lost';
  interest_level: 'Unknown' | 'Low' | 'Medium' | 'High';
  last_contact_date: string | null;
  next_follow_up_date: string | null;
}

export interface LeadRow {
  place_id: string;
  name: string;
  category: string;
  website: string | null;
  phone: string | null;
  address: string | null;
  lead_score: number;
  priority: 'Low' | 'Medium' | 'High';
  problems: string[];
  solutions: string[];
  potential_value: 'Low' | 'Medium' | 'High' | 'Unknown';
  total_qualification_score: number;
  pipeline_status: string;
  discovered_at: string;
  latitude: number | null;
  longitude: number | null;
}

export interface LeadDetail {
  business: Business;
  research: ResearchBundle;
  problems: string[];
  solutions: string[];
  potential_value: string;
  lead_score: number;
  priority: 'Low' | 'Medium' | 'High';
  score_reasons: string[];
  qualification: QualificationScore;
}

export interface FunnelMetrics {
  businesses_found: number;
  analyzed: number;
  qualified: number;
  proposals_generated: number;
  outreach_drafted: number;
  outreach_approved: number;
  outreach_sent: number;
  responses_logged: number;
  interested: number;
  clients_won: number;
}

export interface DashboardLeadRow {
  name: string;
  category: string;
  total_score: number | null;
  qual_priority: string | null;
  proposal_status: string | null;
  cost_min: number | null;
  cost_max: number | null;
  weeks_min: number | null;
  weeks_max: number | null;
  package_name: string | null;
  pipeline_status: string | null;
  interest_level: string | null;
  last_contact_date: string | null;
  rank_score: number | null;
}

export interface FollowUpLead {
  place_id: string;
  name: string;
  category: string;
  last_contact_date: string;
  next_follow_up_date: string;
  days_since_contact: number;
}

export interface CategoryInsight {
  category: string;
  total: number;
  contacted: number;
  replied: number;
  converted: number;
  conversion_rate: number;
  common_package: string | null;
}

export interface Settings {
  llm_provider: 'ollama' | 'groq';
  ollama_host: string;
  ollama_worker_model: string;
  ollama_reasoning_model: string;
  ollama_keep_alive: string;
  reasoning_model_enabled: boolean;
  followup_escalation_score: number;
  database_path: string;
  min_qualification_score_for_proposal: number;
  followup_after_days: number;
  min_sample_size_for_insights: number;
}

export interface ModelStatus {
  name: string;
  size: number;
  size_vram: number;
  expires_at: string | null;
}

export interface DiscoveryResult {
  status: string;
  businesses_found: number;
  reports_generated: number;
  proposals_generated: number;
  reports: DiscoveryReport[];
}

export interface DiscoveryReport {
  business_name: string;
  category: string;
  lead_score: number;
  priority: 'Low' | 'Medium' | 'High';
  problems: string[];
  solutions: string[];
  potential_value: string;
}

export interface JobStatus {
  job_id: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: {
    current: number;
    total: number;
    current_business: string;
    phase: string;
  };
  partial_results: DiscoveryReport[];
}
