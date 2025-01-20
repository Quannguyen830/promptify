"use client"

import { Button } from "~/components/ui/button"
import { Input } from "../ui/input"
import { Send } from 'lucide-react'

import ChatMessageList from "./chat-message-list"

import { type SubmitHandler, useForm } from "react-hook-form"
import { useChatStore } from "./chat-store"
import { ChatBubble, ChatBubbleAvatar, ChatBubbleMessage } from "../ui/chat/chat-bubble"

export interface ChatSectionFormProps {
  userMessage: string
}

export function ChatSection() {
  const {
    register,
    handleSubmit
  } = useForm<ChatSectionFormProps>()
  const { userMessages, addUserMessage } = useChatStore()


  const onSubmit: SubmitHandler<ChatSectionFormProps> = (data) => { 
    addUserMessage(data.userMessage)
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


        {/* <ChatBubble>
          <ChatBubbleAvatar />
          <ChatBubbleMessage>Chat</ChatBubbleMessage>
        </ChatBubble>

        <ChatBubble variant='sent'>
          <ChatBubbleAvatar />
          <ChatBubbleMessage>User Lorem ipsum dolor sit amet consectetur adipisicing elit. Et sit, non dolore earum numquam accusantium pariatur hic quia temporibus sequi eligendi, iste dolorum nam ut incidunt. Exercitationem vitae placeat ipsum.</ChatBubbleMessage>
        </ChatBubble>

        <ChatBubble>
          <ChatBubbleAvatar/>
          <ChatBubbleMessage isLoading={true}>Loading</ChatBubbleMessage>
        </ChatBubble> */}
      </ChatMessageList>

      <form onSubmit={handleSubmit(onSubmit)} className="flex gap-2 ">
        {/* <ChatInput/> */}

        <Input {...register("userMessage")} type="text" className="ring-1 ring-black w-full"/>
        <Button type="submit" size="icon" className="h-8 w-8">
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  )
}

