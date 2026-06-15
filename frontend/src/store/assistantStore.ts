import { create } from 'zustand';
import { AssistantMessage } from '../types/assistant';

interface AssistantStore {
  messages: AssistantMessage[];
  loading: boolean;
  currentIncidentId: string | null;
  addMessage: (message: AssistantMessage) => void;
  setLoading: (loading: boolean) => void;
  setCurrentIncidentId: (id: string | null) => void;
  clearMessages: () => void;
}

export const useAssistantStore = create<AssistantStore>((set) => ({
  messages: [],
  loading: false,
  currentIncidentId: null,
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
  setLoading: (loading) => set({ loading }),
  setCurrentIncidentId: (id) => set({ currentIncidentId: id }),
  clearMessages: () => set({ messages: [] }),
}));
