import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  LeadRow, OutreachDraft, ProposalDocument, ResponseRecord,
  CRMLead, Settings,
} from '@/lib/types';
import {
  mockLeads, mockDrafts, mockProposals, mockResponses,
  mockCRMLeads,
} from '@/lib/mockData';
import { DEFAULT_SETTINGS } from '@/lib/constants';

interface DataState {
  leads: LeadRow[];
  drafts: OutreachDraft[];
  proposals: ProposalDocument[];
  responses: ResponseRecord[];
  crm: Record<string, CRMLead>;
  settings: Settings;
  updatePipeline: (placeId: string, status: CRMLead['pipeline_status']) => void;
  updateInterest: (placeId: string, interest: CRMLead['interest_level']) => void;
  updateDraftStatus: (id: number, status: OutreachDraft['status']) => void;
  addProposal: (p: ProposalDocument) => void;
  addResponse: (r: ResponseRecord) => void;
  updateSettings: (s: Partial<Settings>) => void;
  touchContact: (placeId: string) => void;
  resetAll: () => void;
}

const today = () => new Date().toISOString().slice(0, 10);

export const useDataStore = create<DataState>()(
  persist(
    (set) => ({
      leads: mockLeads,
      drafts: mockDrafts,
      proposals: mockProposals,
      responses: mockResponses,
      crm: mockCRMLeads,
      settings: DEFAULT_SETTINGS,
      updatePipeline: (placeId, status) =>
        set((s) => ({
          crm: {
            ...s.crm,
            [placeId]: {
              ...(s.crm[placeId] ?? {
                place_id: placeId,
                interest_level: 'Unknown' as const,
                last_contact_date: null,
                next_follow_up_date: null,
              }),
              place_id: placeId,
              pipeline_status: status,
            },
          },
          leads: s.leads.map((l) =>
            l.place_id === placeId ? { ...l, pipeline_status: status } : l
          ),
        })),
      updateInterest: (placeId, interest) =>
        set((s) => ({
          crm: {
            ...s.crm,
            [placeId]: {
              ...(s.crm[placeId] ?? {
                place_id: placeId,
                pipeline_status: 'New' as const,
                last_contact_date: null,
                next_follow_up_date: null,
              }),
              place_id: placeId,
              interest_level: interest,
            },
          },
        })),
      updateDraftStatus: (id, status) =>
        set((s) => ({
          drafts: s.drafts.map((d) => {
            if (d.id !== id) return d;
            const now = new Date().toISOString();
            return {
              ...d,
              status,
              approved_at: status === 'Approved' || status === 'Sent' ? d.approved_at ?? now : d.approved_at,
              sent_at: status === 'Sent' ? now : d.sent_at,
            };
          }),
        })),
      addProposal: (p) => set((s) => ({ proposals: [p, ...s.proposals] })),
      addResponse: (r) => set((s) => ({ responses: [r, ...s.responses] })),
      updateSettings: (patch) => set((s) => ({ settings: { ...s.settings, ...patch } })),
      touchContact: (placeId) =>
        set((s) => {
          const next = new Date();
          next.setDate(next.getDate() + (s.settings.followup_after_days || 7));
          const prev = s.crm[placeId];
          return {
            crm: {
              ...s.crm,
              [placeId]: {
                place_id: placeId,
                pipeline_status: prev?.pipeline_status ?? 'Contacted',
                interest_level: prev?.interest_level ?? 'Unknown',
                last_contact_date: today(),
                next_follow_up_date: next.toISOString().slice(0, 10),
              },
            },
          };
        }),
      resetAll: () =>
        set({
          leads: mockLeads,
          drafts: mockDrafts,
          proposals: mockProposals,
          responses: mockResponses,
          crm: mockCRMLeads,
          settings: DEFAULT_SETTINGS,
        }),
    }),
    { name: 'acq-agent-data-v1', partialize: (s) => ({ crm: s.crm, drafts: s.drafts, proposals: s.proposals, responses: s.responses, settings: s.settings, leads: s.leads }) }
  )
);
