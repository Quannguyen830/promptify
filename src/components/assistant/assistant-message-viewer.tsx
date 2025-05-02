"use client";

import { useSession } from "next-auth/react";
import { ChatState, useChatStore } from "../chat/chat-store";

import { type BaseProps } from "~/constants/interfaces";
import Loading from "../share/loading-spinner";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { useEffect, useRef } from "react";
import { api } from "~/trpc/react";
import ChatBubble from "../chat/chat-bubble";



const AssistantMessageViewer: React.FC<BaseProps> = ({ className }) => {
  const { data, status } = useSession();
  const bottomRef = useRef<HTMLDivElement>(null);
  const {
    chatState,
    selectedSessionId
  } = useChatStore();

  const { data: chatSession, isLoading } = api.chat.getChatSessionById.useQuery(
    {
      id: selectedSessionId!
    },
    {
      enabled: chatState === ChatState.SESSION_SELECTED
    }
  )

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ 
      behavior: "smooth",
    });
  }, [chatSession?.messages]);
  
  if (isLoading) {
    return (
      <Loading className="h-full" />
    ) 
  }
  
  return (
    <ScrollArea className={`flex flex-col overflow-y-auto pr-1 h-full items-center ${className}`}>
      {!selectedSessionId ? (
        <div className="flex flex-1 flex-col justify-center items-center">
          <h2 className="text-[42px] font-bold">Hi {data?.user.name ?? "user"}</h2>
          <p>Start by asking anything below.</p>
        </div>
      ) : (
        <div className="flex flex-col h-full gap-2 items-start w-full pt-1 ">
          {chatSession?.messages.map((message, index) => (
            <ChatBubble content={message.content} key={index} variant={message.sender} />
          ))}
          
          <div ref={bottomRef} className=""/>
        </div>
      )}
    </ScrollArea>
  )
}
export default AssistantMessageViewer;