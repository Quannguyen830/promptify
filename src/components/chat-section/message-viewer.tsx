import { api } from "~/trpc/react"
import { ChatState, useChat } from "./chat-store"
import ChatBubble from "./chat-bubble";
import Loading from "../share/loading-spinner";
import { MessageStreamViewer } from "./message-stream-bubble";
import { type BaseProps } from "~/constants/interfaces";

const MessageViewer: React.FC<BaseProps> = ({ className }) => {
  const {
    chatState,
    isStreaming,
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
    return <Loading />
  }

  return (
    <div className={`${className}`}>
      {chatSession?.messages.map((message, index) => (
        <ChatBubble key={index} variant={message.sender}>
          {message.content}
        </ChatBubble>
      ))}
      
      {isStreaming && <MessageStreamViewer />}
    </div>
  )
}
export default MessageViewer;