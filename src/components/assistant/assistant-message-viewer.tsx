"use client";

import { useSession } from "next-auth/react";
import { useChat } from "../chat/chat-store";

import { type BaseProps } from "~/constants/interfaces";
import Loading from "../share/loading-spinner";
import MessageViewer from "../chat-section/message-viewer";
import { ScrollArea } from "@radix-ui/react-scroll-area";



const AssistantMessageViewer: React.FC<BaseProps> = ({ className }) => {
  const { data, status } = useSession();
  const {
    selectedSessionId
  } = useChat();

  if (status==="loading") {
    return <Loading className="h-full"/>
  }

  return (
    <ScrollArea className={`flex flex-col overflow-y-auto pr-1 h-full items-center ${className}`}>
      {!selectedSessionId ? (
        <div className="flex flex-1 flex-col justify-center items-center">
          <h2 className="text-[42px] font-bold">Hi {data?.user.name ?? "user"}</h2>
          <p>Start by asking anything below.</p>
        </div>
      ) : (
        <MessageViewer className="flex flex-col h-full gap-2 items-start w-full"/>
      )}
    </ScrollArea>
  )
}
export default AssistantMessageViewer;