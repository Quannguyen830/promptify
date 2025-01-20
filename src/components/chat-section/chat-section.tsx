"use client"

import { Button } from "~/components/ui/button"
import { Input } from "../ui/input"
import { Send } from 'lucide-react'

import ChatMessageList from "./chat-message-list"

import { type SubmitHandler, useForm } from "react-hook-form"
import { useChatStore } from "./chat-store"
import { ChatBubble, ChatBubbleAvatar, ChatBubbleMessage } from "../ui/chat/chat-bubble"
import { getResponse } from "~/server/services/gemini-service"

export interface ChatSectionFormProps {
  userMessage: string
}

export function ChatSection() {
  const {
    register,
    handleSubmit
  } = useForm<ChatSectionFormProps>()
  const { 
    userMessages,
    addUserMessage,
    agentMessages,
    addAgentMessage
  } = useChatStore()


  const onSubmit: SubmitHandler<ChatSectionFormProps> = async (data) => { 
    addUserMessage(data.userMessage);

    // send msg to model
    const response = await getResponse(data.userMessage);

    addAgentMessage(response);
  }

  return (
    <div className="flex flex-col h-full p-5">
      {/* Tab header */}
      <h2 className="h-7 font-semibold text-2xl mb-5">Chat</h2>
      
      {/* TODO: group this to a component */}
      <ChatMessageList className="overflow-y-auto h-full">
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
      </ChatMessageList>

      <form onSubmit={handleSubmit(onSubmit)} className="flex gap-2 ">
        <Input {...register("userMessage")} type="text" className="ring-1 ring-black w-full"/>

        <Button type="submit" size="icon" className="h-8 w-8">
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  )
}

