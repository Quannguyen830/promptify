import { create } from "zustand";

export enum MessageType {
  USER,
  AGENT
}

interface ChatMessage {
  message: string;
  type: MessageType
}

interface ChatStoreState {
  messages: ChatMessage[];
  addMessage: (message: string, type: MessageType) => void;
}

export const useChatStore = create<ChatStoreState>((set) => ({
  messages: [],
  addMessage: (message, type) => set((state) => ({ messages: [...state.messages, { message, type }] }))
}));
