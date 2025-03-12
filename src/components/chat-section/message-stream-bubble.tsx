import ChatBubble from "./chat-bubble";
import { useChat } from "./chat-store"

export function MessageStreamViewer() {
  const {
    streamingMessage
  } = useChat();

  return (
    <ChatBubble variant="AGENT">
      {streamingMessage}
    </ChatBubble>
  )
}