import { create } from "zustand";
import { type ChatProvider, ChatProviderSchema } from "~/constants/types";

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

  chatProvider: ChatProvider;
  setChatProvider: (provider: ChatProvider) => void;
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

  chatProvider: ChatProviderSchema.Enum["gemini-2.0-flash"],
  setChatProvider(provider) {
    set(() => ({ chatProvider: provider }))
  },
}))


interface ChatSectionProvider {
  isOpen: boolean;
  toggleOpen: () => void;
}
export const useChatSectionProvider = create<ChatSectionProvider>((set) => ({
  isOpen: false,
  toggleOpen: () => {
    set((state) => ({ isOpen: !state.isOpen }))
  }
}))
