"use client"

import { api } from "~/trpc/react";
import ChatBubble from "./chat-bubble";
import ChatInput from "./chat-input";

import { ChatSectionState, useChatStore } from "./chat-store";
import ChatSessionCard from "./chat-session-card";

export function ChatSection() {
  const { 
    messages,
    currentChatState,
  } = useChatStore();

  const { data: chatSessions } = api.chat.getAllChatSessions.useQuery();

  return (
    <div className="flex flex-col h-full">
      <div className="h-16 p-4 border-b">
        <h2 className="font-semibold text-2xl">Assistant</h2>
      </div>

      {currentChatState === ChatSectionState.ALL_SESSIONS && (
        <div className="overflow-y-auto h-full flex flex-col gap-2 p-4">
          {chatSessions?.map((session, index) => (
            <ChatSessionCard key={index} title={session.id}>
              {session.id}
            </ChatSessionCard>
          ))}
        </div>
      )}

      {currentChatState === ChatSectionState.SELECTED_SESSION && (
        <div className="overflow-y-auto h-full flex flex-col gap-2 p-4">
          {messages.map((message, index) => (
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

