import { create } from "zustand";
import { 
  ChatSession,
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

  messages: ClientMessage[];
  addMessage: (message: ClientMessage) => void;
  
  currentChatSession: ClientChatSession | null;
  setChatSession: (session: ClientChatSession) => void; 

  chatSessions: ChatSession[];
}
export const useChatStore = create<ChatStore>((set) => ({
  currentChatState: ChatSectionState.SESSION_LISTING,
  setChatState: (state: ChatSectionState) => set(() => ({
    currentChatState: state
  })),
  
  messages: [],
  addMessage: (message) => {
    set((state) => ({
      messages: [...state.messages, message]
    }));
  },

  currentChatSession: null,
  setChatSession: (session: ClientChatSession) => set(() => ({
    // currentChatState: ChatSectionState.SESSION_SELECTED,
    messages: session.messages,
    currentChatSession: session,
  })),

  chatSessions: []
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
