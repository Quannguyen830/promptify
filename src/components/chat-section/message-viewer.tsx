import { api } from "~/trpc/react"
import { type BaseProps } from "~/constants/interfaces";
import { ChatState, useChat } from "../chat/chat-store"

import ChatBubble from "../chat/chat-bubble";
import Loading from "../share/loading-spinner";
import { useEffect, useRef } from "react";

const MessageViewer: React.FC<BaseProps> = ({ className }) => {
  const bottomRef = useRef<HTMLDivElement>(null);
  const {
    chatState,
    selectedSessionId
  } = useChat();

  const { data: chatSession, isLoading } = api.chat.getChatSessionById.useQuery(
    {
      id: selectedSessionId!
    },
    {
      enabled: chatState === ChatState.SESSION_SELECTED
    }
  )

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatSession?.messages]);
  
  if (isLoading) {
    return (
      <Loading className="h-full" />
    ) 
  }

  return (
    <div className={`flex items-center w-full pt-1 ${className}`}>
      {chatSession?.messages.map((message, index) => (
        <ChatBubble content={message.content} key={index} variant={message.sender} />
      ))}
      
      <div ref={bottomRef}/>
    </div>
  )
}
export default MessageViewer;