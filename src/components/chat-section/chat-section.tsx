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

      {currentChatState === ChatSectionState.SESSION_LISTING && (
        <div className="overflow-y-auto h-full flex flex-col gap-2 p-4">
          {chatSessions?.map((session, index) => (
            <ChatSessionCard key={index} id={session.id}>
              {session.name}
            </ChatSessionCard>
          ))}
        </div>
      )}

      {currentChatState === ChatSectionState.SESSION_SELECTED && (
        <div className="overflow-y-auto h-full flex flex-col gap-2 p-4">
          {messages.map((message, index) => (
            <ChatBubble key={index} variant={message.sender}>
              {message.content}
            </ChatBubble>
          ))}
          {isStreaming && (
            <ChatBubble variant="AGENT">
              {currentAgentMessageStream}
            </ChatBubble>
          )}
        </div>
      )}
 

      {currentChatState === ChatSectionState.IS_LOADING && (
        <Loading/>
      )}

      <ChatInput />
    </div>
  );
}
