import { create } from 'zustand';
import { Severity } from '../types/incident';

export interface LiveAlert {
  id: string;
  message: string;
  severity: Severity;
  detector: string;
  timestamp: string;
  entity?: string;
}

interface AlertStore {
  alerts: LiveAlert[];
  addAlert: (alert: LiveAlert) => void;
  clearAlerts: () => void;
}

export const useAlertStore = create<AlertStore>((set) => ({
  alerts: [],
  addAlert: (alert) =>
    set((state) => ({
      alerts: [alert, ...state.alerts].slice(0, 50),
    })),
  clearAlerts: () => set({ alerts: [] }),
}));
