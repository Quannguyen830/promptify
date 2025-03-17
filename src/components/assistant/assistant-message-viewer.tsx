"use client";

import { useSession } from "next-auth/react";

import { type BaseProps } from "~/constants/interfaces";
import Loading from "../share/loading-spinner";
import MessageViewer from "../chat-section/message-viewer";
import { useChat } from "../chat-section/chat-store";


const AssistantMessageViewer: React.FC<BaseProps> = ({ className }) => {
  const { data, status } = useSession();
  const {
    selectedSessionId
  } = useChat();

  if (status==="loading") {
    return <Loading/>
  }

  return (
    <div className={`flex flex-col h-full justify-center items-center ${className}`}>
      {!selectedSessionId ? (
        <div>
          <h2 className="text-[42px] font-bold">Hi {data?.user.name ?? "user"}</h2>
          <p>Start by asking anything below.</p>
        </div>
      ) : (
        <MessageViewer />
      )}

    </div>
  )
}
export default AssistantMessageViewer;