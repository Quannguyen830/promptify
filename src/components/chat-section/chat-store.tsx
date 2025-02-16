import { create } from "zustand";
import { 
  type ClientChatSession,
  type ClientMessage
} from "~/constants/types";

export enum ChatSectionState {
  SESSION_LISTING, // default state: displaying all existing sessions
  NEW_SESSION, // when user chat directly without opening existing chat session
  SESSION_SELECTED // when user select an existing chat session
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
  currentChatState: ChatSectionState.SESSION_LISTING,
  setChatState: (state: ChatSectionState) => set(() => ({
    currentChatState: state
  })),
  
  messages: [],
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
