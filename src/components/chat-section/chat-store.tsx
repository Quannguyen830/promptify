import { create } from "zustand";
import { 
  type ClientChatSession,
  type ClientMessage
} from "~/constants/types";

export enum ChatSectionState {
  ALL_SESSIONS, // default state: displaying all existing sessions
  NEW_SESSION, // when user chat directly without opening existing chat session
  SELECTED_SESSION // when user select an existing chat session
}


export interface ChatStoreState {
  currentChatState: ChatSectionState;

  messages: ClientMessage[];
  addMessage: (message: ClientMessage) => void;
  
  currentChatSession: ClientChatSession | null;
  setChatSession: (session: ClientChatSession) => void;
  
}

export const useChatStore = create<ChatStoreState>((set) => ({
  currentChatState: ChatSectionState.ALL_SESSIONS,
  
  messages: [],
  addMessage: (message) => set((state) => ({
    messages: [
      ...state.messages,
      message
    ]
  })),

  currentChatSession: null,
  setChatSession: (session: ClientChatSession) => set(() => ({
    currentChatState: ChatSectionState.SELECTED_SESSION,
    messages: session.messages,
    currentChatSession: session,
  }))
}));
