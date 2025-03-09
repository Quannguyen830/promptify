import ChatBubble from "./chat-bubble";
import { useChat } from "./chat-store-2"

export function MessageStreamViewer() {
  const {
    isStreaming,
    streamingMessage
  } = useChat();

  return (
    <>
      {isStreaming && (
        <ChatBubble variant="AGENT">
          {streamingMessage}
        </ChatBubble>
      )}
    </>
  )
}