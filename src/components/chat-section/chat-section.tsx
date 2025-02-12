"use client"

import { api } from "~/trpc/react";

import ChatBubble from "./chat-bubble";
import ChatInput from "./chat-input";
import { ChatSectionState, useChatStore } from "./chat-store";
import ChatSessionCard from "./chat-session-card";
import { useEffect } from "react";

export function ChatSection() {
  const {
    currentChatSession,
    currentChatState,
    setChatSessions,
    chatSessions
  } = useChatStore();

  const { data: fetchedChatSessions } = api.chat.getAllChatSessions.useQuery();
  
  useEffect(() => {
    if (fetchedChatSessions) {
      setChatSessions(fetchedChatSessions)
    }
  }, [fetchedChatSessions, setChatSessions])

  return (
    <div className="flex flex-col h-full bg-sidebar">
      <div className="h-16 p-4 border-b">
        <h2 className="font-semibold text-2xl">Assistant</h2>
      </div>

      {currentChatState === ChatSectionState.SESSION_LISTING && (
        <div className="overflow-y-auto h-full flex flex-col gap-2 p-4 bg">
          {chatSessions?.map((session, index) => (
            <ChatSessionCard key={index} id={session.id}>
              {session.id}
            </ChatSessionCard>
          ))}
        </div>
      )}

      {currentChatState === ChatSectionState.SESSION_SELECTED && (
        <div className="overflow-y-auto h-full flex flex-col gap-2 p-4">
          {currentChatSession?.messages.map((message, index) => (
            <ChatBubble key={index} variant={message.sender}>
              {message.content}
            </ChatBubble>
          ))}
        </div>
      )}

      <ChatInput />
    </div>
  );
}

