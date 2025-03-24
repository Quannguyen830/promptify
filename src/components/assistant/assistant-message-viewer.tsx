"use client";

import { useSession } from "next-auth/react";

import { type BaseProps } from "~/constants/interfaces";
import MessageViewer from "../chat-section/message-viewer";
import { useChat } from "../chat-section/chat-store";
import Loading from "../share/loading-spinner";


const AssistantMessageViewer: React.FC<BaseProps> = ({ className }) => {
  const { data, status } = useSession();
  const {
    selectedSessionId
  } = useChat();

  if (status==="loading") {
    return <Loading className="h-full"/>
  }

  return (
    <div className={`flex flex-col h-full items-center ${className}`}>
      {!selectedSessionId ? (
        <div className="flex flex-1 flex-col justify-center items-center">
          <h2 className="text-[42px] font-bold">Hi {data?.user.name ?? "user"}</h2>
          <p>Start by asking anything below.</p>
        </div>
      ) : (
        <MessageViewer className="flex flex-col h-full gap-2 items-start"/>
      )}

    </div>
  )
}
export default AssistantMessageViewer;