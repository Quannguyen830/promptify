"use client";

import Loading from "../share/loading-spinner";
import ChatSessionCard from "./chat-session-card";

import { api } from "~/trpc/react";

export function ChatSessionListing() {
  const { data: chatSessions, isLoading } = api.chat.getAllChatSessionsId.useQuery();
  
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