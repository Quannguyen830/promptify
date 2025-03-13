import { api } from "~/trpc/react"
import { ChatState, useChat } from "./chat-store"
import ChatBubble from "./chat-bubble";
import Loading from "../share/loading-spinner";
import { MessageStreamViewer } from "./message-stream-bubble";

export function MessageViewer() {
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
    <div className="overflow-y-auto h-full flex-1 flex flex-col gap-2 p-4">
      {chatSession?.messages.map((message, index) => (
        <ChatBubble key={index} variant={message.sender}>
          {message.content}
        </ChatBubble>
      ))}
      
      {isStreaming && <MessageStreamViewer />}
    </div>
  )
}