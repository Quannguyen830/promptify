import ChatInput from "./chat-input";
import { Button } from "../ui/button";
import { ArrowLeft } from "lucide-react";
import { ChatSessionListing } from "./chat-session-listing";
import { ChatState, useChat } from "./chat-store";
import MessageViewer from "./message-viewer";

export function ChatSection() {
  const {
    selectedSessionId,
    chatState,

    setChatState
  } = useChat();
    
  return (
    <div className="flex flex-col h-full bg-sidebar">
      <div className="h-16 p-4 ">
        {chatState === ChatState.SESSION_SELECTED ? (
          <Button onClick={() => setChatState(ChatState.SESSION_LISTING)}>
            <ArrowLeft/>
          </Button>
        ) : (
          <div className="flex items-center gap-2">
            <h2 className="font-semibold text-2xl">Assistant</h2>
          </div>
        )}
      </div>
      
      <div className="flex-1">
        {chatState === ChatState.SESSION_LISTING && (
          <ChatSessionListing/>
        )}

        {selectedSessionId && chatState === ChatState.SESSION_SELECTED && (
          <MessageViewer className="overflow-y-auto h-full flex-1 flex flex-col gap-2 p-4" />
        )}
      </div>

      <ChatInput />
    </div>
  );
}
