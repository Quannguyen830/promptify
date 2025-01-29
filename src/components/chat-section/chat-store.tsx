import { create } from "zustand";

export enum MessageType {
  USER,
  AGENT
}
export enum ChatSectionState {
  ALL_SESSIONS,
  NEW_SESSION,
  SELECTED_SESSION
}

export interface ChatMessage {
  message: string;
  type: MessageType;
}

export interface ChatStoreState {
  messages: ChatMessage[];

  currentChatState: ChatSectionState;

  currentChatSessionId: string;
  setChatSession: (sessionId: string) => void;

  addMessage: (message: string, type: MessageType) => void;
}

export const useChatStore = create<ChatStoreState>((set) => ({
  currentChatState: ChatSectionState.ALL_SESSIONS,
  currentChatSessionId: "",
  messages: [],

  setChatSession: (sessionId) => set(() => ({ currentChatState: ChatSectionState.SELECTED_SESSION, currentChatSessionId: sessionId })),
  addMessage: (message, type) => set((state) => ({ messages: [...state.messages, { message, type }] }))
}));
