"use client";

import Loading from "../share/loading-spinner";
import ChatSessionCard from "./chat-session-card";
import { ChatSectionState, useChatStore } from "./chat-store";

import { api } from "~/trpc/react";

export function ChatSessionListing() {
  const {
    currentChatState
  } = useChatStore();

  const { data: chatSessions, isSuccess, isLoading } = api.chat.getAllChatSessionsId.useQuery();

  
  if (isSuccess) {
    
  }
  
  if (isLoading) return (
    <Loading/>
  );

  return (
    <div className="overflow-y-auto h-full flex flex-col gap-2 p-4">
      {chatSessions?.map((session, index) => (
        <ChatSessionCard key={index} id={session.id}>
          {session.name}
        </ChatSessionCard>
      ))}
    </div>
  )
}