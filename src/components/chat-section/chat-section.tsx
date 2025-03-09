"use client"

import { api } from "~/trpc/react";

import { ChatSectionState, useChatStore } from "./chat-store";
import ChatSessionCard from "./chat-session-card";
import ChatBubble from "./chat-bubble";
import ChatInput from "./chat-input";
import Loading from "../share/loading-spinner";
import { Button } from "../ui/button";
import { ArrowLeft } from "lucide-react";
import { useEffect } from "react";
import { ChatSessionListing } from "./chat-session-listing";
import { MessageViewer } from "./message-viewer";
import { ChatState, useChat } from "./chat-store-2";

export function ChatSection() {
  const {
    messages,
    currentChatState,
    currentAgentMessageStream,
    chatSessions,
    isStreaming,

    setChatSessions,
    setChatState,
  } = useChatStore();

  const {
    selectedSessionId,
    chatState
  } = useChat();

  const { data: fetchedChatSessions, isFetched } = api.chat.getAllChatSessions.useQuery();

  useEffect(() => {
    if (fetchedChatSessions) {
      setChatSessions(fetchedChatSessions);
        setChatState(ChatSectionState.SESSION_LISTING);

      // if (isFetched && currentChatState !== ChatSectionState.SESSION_SELECTED) {
      // }
    }
  }, [fetchedChatSessions, isFetched, setChatSessions, setChatState, currentChatState]);
  
    
  return (
    <div className="flex flex-col h-full bg-sidebar">
      <div className="h-16 p-4 ">
        {currentChatState === ChatSectionState.SESSION_SELECTED ? (
          <Button onClick={() => setChatState(ChatSectionState.SESSION_LISTING)}>
            <ArrowLeft/>
          </Button>
        ) : (
          <div className="flex items-center gap-2">
            <h2 className="font-semibold text-2xl">Assistant</h2>
          </div>
        )}
      </div>
      
      {chatState === ChatState.SESSION_LISTING && (
        <ChatSessionListing/>
      )}

      {selectedSessionId && chatState === ChatState.SESSION_SELECTED && (
        <MessageViewer />
      )}
 

      {/* {currentChatState === ChatSectionState.IS_LOADING && (
        <Loading/>
      )} */}

      <ChatInput />
    </div>
  );
}
