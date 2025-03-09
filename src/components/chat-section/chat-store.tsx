import { create } from "zustand";
import { 
  type ClientChatSession,
  type ClientMessage
} from "~/constants/types";

export enum ChatSectionState {
  SESSION_LISTING, // default state: displaying all existing sessions
  SESSION_SELECTED, // when user select an existing chat session
  IS_LOADING,
}


// CHAT STORE - Handle chat section states
export interface ChatStore {
  currentUserMessage: string;
  setCurrentUserMessage: (message: string) => void;

  // Display the msg being streamed
  currentAgentMessageStream: string;
  setCurrentAgentMessageStream: (message: string) => void;

  isStreaming: boolean;
  setIsStreaming: (state: boolean) => void;

  // Reset the stream message
  resetAgentMessageStream: () => void;

  currentChatState: ChatSectionState;
  setChatState: (state: ChatSectionState) => void;
  
  newChatSessionId: string | null;
  currentChatSession: ClientChatSession | null;
  setCurrentChatSession: (id: string, isNewSession: boolean) => void;
  
  messages: ClientMessage[];
  addMessage: (message: ClientMessage) => void;

  chatSessions: ClientChatSession[];
  setChatSessions: (sessions: ClientChatSession[]) => void;
}
export const useChatStore = create<ChatStore>((set) => ({
  currentUserMessage: "",
  setCurrentUserMessage(message: string) {
    set(() => ({ currentUserMessage: message }))
  },

  currentAgentMessageStream: "",
  setCurrentAgentMessageStream(message: string) {
    set(() => ({ currentAgentMessageStream: message }))
  },
  resetAgentMessageStream() {
    set(() => ({ currentAgentMessageStream: "" }))
  },

  isStreaming: false,
  setIsStreaming(state: boolean) {
    set(() => ({ isStreaming: state }))
  },

  currentChatState: ChatSectionState.IS_LOADING,
  setChatState(state: ChatSectionState) {
    if (state === ChatSectionState.SESSION_LISTING) {
      set(() => ({ currentChatSession: null }));
    }
    set(() => ({ currentChatState: state }));
  },
  
  messages: [],
  addMessage: (message) => {
    set((state) => {
      if (!state.currentChatSession) return state;
      return {
        currentChatSession: {
          ...state.currentChatSession,
          messages: [...state.currentChatSession.messages, message]
        },
        chatSessions: state.chatSessions.map(session => {
          if (session.id === state.currentChatSession?.id) {
            return {
              ...session,
              messages: [...session.messages, message]
            };
          }
          return session;
        }),
        messages: {
          ...state.messages,
          message
        }
      };
    });
  },

  newChatSessionId: null,
  currentChatSession: null,
  setCurrentChatSession: (id: string, isNewSession: boolean) => {
    if (isNewSession) {
      set(() => ({ newChatSessionId: id }));
    } else {
      set((state) => ({
        currentChatSession: state.chatSessions.find(session => session.id === id),
        messages: state.chatSessions.find(session => session.id === id)?.messages ?? []
      }));
    }
  },

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
