"use client"

import ChatInput from "./chat-input"

import { MessageType, useChatStore } from "./chat-store"
import { ChatBubble, ChatBubbleAvatar, ChatBubbleMessage } from "../ui/chat/chat-bubble"

export function ChatSection() {
  const { 
    messages
  } = useChatStore()


  return (
    <div className="flex flex-col h-full">
      <div className="h-16 p-4 border-b">
        <h2 className="font-semibold text-2xl">Assistant</h2>
      </div>
      
      <div className="overflow-y-auto h-full flex flex-col gap-2 p-4 bg-red-200">
        {messages.map((message, index) => (
          <ChatBubble key={index} variant={message.type === MessageType.AGENT ? "received" : "sent"}>
            <ChatBubbleAvatar />
            <ChatBubbleMessage>{message.message}</ChatBubbleMessage>
          </ChatBubble>
        ))}
      </div>

      <ChatInput/>
    </div>
  )
}

