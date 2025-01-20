import { create } from "zustand";

interface ChatStoreState {
  userMessages: string[];
  addUserMessage: (message: string) => void;

  agentMessages: string[];
  addAgentMessage: (message: string) => void;
}

export const useChatStore = create<ChatStoreState>((set) => ({
  userMessages: [],
  addUserMessage: (message: string) => set((state) => ({ userMessages: [...state.userMessages, message] })),

  agentMessages: [],
  addAgentMessage: (message: string) => set((state) => ({ agentMessages: [...state.agentMessages, message] }))
}));
