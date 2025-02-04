import { create } from "zustand";
import { 
  type ClientChatSession,
  type ClientMessage
} from "~/constants/types";
import { getResponse } from "~/server/services/gemini-service";

export enum ChatSectionState {
  ALL_SESSIONS, // default state: displaying all existing sessions
  NEW_SESSION, // when user chat directly without opening existing chat session
  SELECTED_SESSION // when user select an existing chat session
}

export interface ChatStoreState {
  currentChatState: ChatSectionState;

  messages: ClientMessage[];
  addMessage: (message: ClientMessage) => void;
  addAgentResponse: (message: ClientMessage) => Promise<string>;
  
  currentChatSession: ClientChatSession | null;
  setChatSession: (session: ClientChatSession) => void; 
}

export const useChatStore = create<ChatStoreState>((set) => ({
  currentChatState: ChatSectionState.ALL_SESSIONS,
  
  messages: [],
  addMessage: (message) => {
    set((state) => ({
      messages: [...state.messages, message]
    }));
  },
  addAgentResponse: async (message) => {
    const reply = await getResponse(message.content);
    console.log("REPLY", reply)

    set((state) => ({
      messages: [...state.messages, { content: reply, sender: "AGENT"}]
    }));
    return reply;
  },

  currentChatSession: null,
  setChatSession: (session: ClientChatSession) => set(() => ({
    currentChatState: ChatSectionState.SELECTED_SESSION,
    messages: session.messages,
    currentChatSession: session,
  }))
}));
