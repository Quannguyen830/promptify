import { create } from "zustand";

export enum ChatState {
  SESSION_LISTING,
  SESSION_SELECTED
}

interface ChatStore {
  chatState: ChatState;
  setChatState: (newState: ChatState) => void;

  selectedSessionId: string | null;
  setSelectedSessionId: (session: string) => void;

  isStreaming: boolean;
  setIsStreaming: (value: boolean) => void;

  streamingMessage: string;
  setStreamingMessage: (message: string) => void;
}
export const useChat = create<ChatStore>((set) => ({
  chatState: ChatState.SESSION_LISTING,
  setChatState: (newState) => {
    if (newState === ChatState.SESSION_LISTING) {
      set(() => ({ selectedSessionId: null }));
    }
    set(() => ({ chatState: newState }));
  },

  selectedSessionId: null,
  setSelectedSessionId: (id) => {
    set(() => ({ selectedSessionId: id }));
  },

  isStreaming: false,
  setIsStreaming(value) {
    set(() => ({ 
      isStreaming: value,
      streamingMessage: ""
    }))
  },

  streamingMessage: "",
  setStreamingMessage: (message) => {
    set(() => ({ streamingMessage: message }))
  },
  resetStreamingMessage: () => {
    set(() => ({ streamingMessage: "" }))
  }
}))


export interface ChatProvider {
  isOpen: boolean;
  toggleOpen: () => void;
}
export const useChatProvider = create<ChatProvider>((set) => ({
  isOpen: false,
  toggleOpen: () => {
    set((state) => ({ isOpen: !state.isOpen }))
  }
}))
