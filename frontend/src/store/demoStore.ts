import { create } from 'zustand';
import { DemoResult, DemoStep } from '../api/demo';
import { Incident } from '../types/incident';

type DemoStatus = 'idle' | 'running' | 'complete' | 'error';

interface DemoStore {
  status: DemoStatus;
  currentStep: number;
  completedSteps: DemoStep[];
  totalSteps: number;
  result: DemoResult | null;
  incident: Incident | null;
  error: string | null;
  setStatus: (status: DemoStatus) => void;
  setCurrentStep: (step: number) => void;
  addCompletedStep: (step: DemoStep) => void;
  setResult: (result: DemoResult) => void;
  setError: (error: string) => void;
  reset: () => void;
}

export const useDemoStore = create<DemoStore>((set) => ({
  status: 'idle',
  currentStep: 0,
  completedSteps: [],
  totalSteps: 8,
  result: null,
  incident: null,
  error: null,

  setStatus: (status) => set({ status }),
  setCurrentStep: (step) => set({ currentStep: step }),
  addCompletedStep: (step) =>
    set((state) => ({ completedSteps: [...state.completedSteps, step] })),
  setResult: (result) => set({ result, incident: result.incident, status: 'complete' }),
  setError: (error) => set({ error, status: 'error' }),
  reset: () => set({
    status: 'idle',
    currentStep: 0,
    completedSteps: [],
    result: null,
    incident: null,
    error: null,
  }),
}));
