import { create } from "zustand";
import { 
  type ClientChatSession,
  type ClientMessage
} from "~/constants/types";

export enum ChatSectionState {
  SESSION_LISTING, // default state: displaying all existing sessions
  SESSION_SELECTED, // when user select an existing chat session
  IS_LOADING
}

// CHAT STORE - Handle chat section states
export interface ChatStore {
  currentChatState: ChatSectionState;
  setChatState: (state: ChatSectionState) => void;

  
  currentChatSession: ClientChatSession | null;
  addMessage: (message: ClientMessage) => void; // Add message to current chat session
  setCurrentChatSession: (id: string) => void;

  chatSessions: ClientChatSession[];
  setChatSessions: (sessions: ClientChatSession[]) => void;
}
export const useChatStore = create<ChatStore>((set) => ({
  currentChatState: ChatSectionState.IS_LOADING,
  setChatState(state: ChatSectionState) {
    if (state === ChatSectionState.SESSION_LISTING) {
      set(() => ({ currentChatSession: null }));
    }
    set(() => ({ currentChatState: state }));
  },
  
  addMessage: (message) => {
    set((state) => {
      if (!state.currentChatSession) return state;
      return {
        currentChatSession: {
          ...state.currentChatSession,
          messages: [...state.currentChatSession.messages, message]
        }
      };
    });
  },

  currentChatSession: null,
  setCurrentChatSession: (id: string) => set((state) => ({
    currentChatSession: state.chatSessions.find(session => session.id === id)
  })),

  chatSessions: [],
  setChatSessions(sessions) {
    set(() => ({
      chatSessions: sessions
    }));
  },
}));


// CHAT PROVIDER - For chat section toggle
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
