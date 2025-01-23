"use client"

import ChatInput from "./chat-input"

import { useChatStore } from "./chat-store"
import { ChatBubble, ChatBubbleAvatar, ChatBubbleMessage } from "../ui/chat/chat-bubble"

export function ChatSection() {
  const { 
    userMessages,
    agentMessages,
  } = useChatStore()


  return (
    <div className="flex flex-col h-full">
      <div className="h-16 p-4 border-b">
        <h2 className="font-semibold text-2xl">Assistant</h2>
      </div>
      
      <div className="overflow-y-auto h-full flex flex-col gap-2 p-4 bg-red-200">
        {userMessages.map((message, index) => (
          <ChatBubble key={index}>
            <ChatBubbleAvatar />
            <ChatBubbleMessage>{message}</ChatBubbleMessage>
          </ChatBubble>
        ))}

        {agentMessages.map((message, index) => (
          <ChatBubble key={index} variant='sent'>
            <ChatBubbleAvatar />
            <ChatBubbleMessage>{message}</ChatBubbleMessage>
          </ChatBubble>
        ))}
      </div>

      <ChatInput/>
    </div>
  )
}

