import { create } from "zustand";
import { type ChatProvider, ChatProviderSchema } from "~/constants/types";

export enum ChatState {
  SESSION_LISTING,
  SESSION_SELECTED
}

interface ContextFile {
  id: string;
  name: string;
}

const FALL_BACK_CHAT_MODEL="gemini-2.5-flash-preview-04-17"

interface ChatStore {
  chatState: ChatState;
  setChatState: (newState: ChatState) => void;

  selectedSessionId: string | null;
  setSelectedSessionId: (session: string) => void;

  chatProvider: ChatProvider;
  setChatProvider: (provider: ChatProvider) => void;

  contextFileIds: ContextFile[];
  addContextFileId: (file: ContextFile) => void;
  removeContextFileId: (fileId: string) => void;
  resetContextFileIds: () => void;
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

  chatProvider: ChatProviderSchema.Enum[FALL_BACK_CHAT_MODEL],
  setChatProvider(provider) {
    set(() => ({ chatProvider: provider }))
  },

  contextFileIds: [],
  addContextFileId: (newFile) =>
    set((state) => ({
      contextFileIds: state.contextFileIds.some((file) => file.id === newFile.id)
        ? state.contextFileIds
        : [...state.contextFileIds, newFile],
    })),
  removeContextFileId: (fileId: string) =>
    set((state) => ({
      contextFileIds: state.contextFileIds.filter((file) => file.id !== fileId),
    })),
  resetContextFileIds: () => set({ contextFileIds: [] }),

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


