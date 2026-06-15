import { create } from 'zustand';
import { Incident } from '../types/incident';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

interface IncidentStore {
  incidents: Incident[];
  selectedIncident: Incident | null;
  loading: boolean;
  error: string | null;
  fetchIncidents: () => Promise<void>;
  fetchIncident: (id: string) => Promise<void>;
  addIncident: (incident: Incident) => void;
  setSelectedIncident: (incident: Incident | null) => void;
}

export const useIncidentStore = create<IncidentStore>((set) => ({
  incidents: [],
  selectedIncident: null,
  loading: false,
  error: null,

  fetchIncidents: async () => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`${API_URL}/api/incidents`);
      const json = await res.json();
      if (json.success) {
        set({ incidents: json.data, loading: false });
      } else {
        set({ error: json.error, loading: false });
      }
    } catch (e) {
      set({ error: 'Failed to fetch incidents', loading: false });
    }
  },

  fetchIncident: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`${API_URL}/api/incidents/${id}`);
      const json = await res.json();
      if (json.success) {
        set({ selectedIncident: json.data, loading: false });
      } else {
        set({ error: json.error, loading: false });
      }
    } catch (e) {
      set({ error: 'Failed to fetch incident', loading: false });
    }
  },

  addIncident: (incident: Incident) =>
    set((state) => ({ incidents: [incident, ...state.incidents] })),

  setSelectedIncident: (incident) => set({ selectedIncident: incident }),
}));
