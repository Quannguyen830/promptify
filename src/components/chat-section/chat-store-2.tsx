import { create } from "zustand";

export enum ChatState {
  SESSION_LISTING,
  SESSION_SELECTED
}

interface ChatStore2 {
  chatState: ChatState;
  setChatState: (newState: ChatState) => void;

  selectedSessionId: string | null;
  setSelectedSessionId: (session: string) => void;

  isStreaming: boolean;
  setIsStreaming: (value: boolean) => void;

  streamingMessage: string;
  setStreamingMessage: (message: string) => void;
}

export const useChat = create<ChatStore2>((set) => ({
  chatState: ChatState.SESSION_LISTING,
  setChatState: (newState) => {
    set(() => ({ chatState: newState }));
  },

  selectedSessionId: null,
  setSelectedSessionId: (id) => {
    set(() => ({ selectedSessionId: id }));
  },

  isStreaming: false,
  setIsStreaming(value) {
    set(() => ({ isStreaming: value }))
  },

  streamingMessage: "",
  setStreamingMessage: (message) => {
      set(() => ({ streamingMessage: message }))
  },
}))