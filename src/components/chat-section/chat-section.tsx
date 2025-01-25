"use client"

import ChatBubble from "./chat-bubble"
import ChatInput from "./chat-input"

import { useChatStore } from "./chat-store"

export function ChatSection() {
  const { 
    messages
  } = useChatStore()


  return (
    <div className="flex flex-col h-full">
      <div className="h-16 p-4 border-b">
        <h2 className="font-semibold text-2xl">Assistant</h2>
      </div>
      
      <div className="overflow-y-auto h-full flex flex-col gap-2 p-4">
        {messages.map((message, index) => (
          <ChatBubble key={index} variant={message.type}>
            {message.message}
          </ChatBubble>
        ))}
      </div>

      <ChatInput/>
    </div>
  )
}

