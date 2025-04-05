import { api } from "~/trpc/react"
import { type BaseProps } from "~/constants/interfaces";
import { ChatState, useChat } from "./chat-store"

import ChatBubble from "./chat-bubble";
import Loading from "../share/loading-spinner";

const MessageViewer: React.FC<BaseProps> = ({ className }) => {
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
  
  if (isLoading) {
    return (
      <Loading className="h-full" />
    ) 
  }

  return (
    <div className={`w-full ${className}`}>
      {chatSession?.messages.map((message, index) => (
        <ChatBubble content={message.content} key={index} variant={message.sender} />
      ))}
    </div>
  )
}
export default MessageViewer;