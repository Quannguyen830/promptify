"use client"

import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Send } from 'lucide-react'
import { UserMessageBox } from "./user-message-box"
import { AgentMessageBox } from "./agent-message-box"
import { ChatBubble, ChatBubbleAvatar, ChatBubbleMessage } from "../ui/chat/chat-bubble"
import { ChatInput } from "../ui/chat/chat-input"
import ChatMessageList from "./chat-message-list"

export function ChatSection() {
  return (
    <div className="flex flex-col h-full p-5">
      {/* Tab header */}
      <h2 className="h-7 font-semibold text-2xl mb-5">Chat</h2>
      
      <ChatMessageList className="overflow-y-auto h-full">
        <ChatBubble>
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
        </ChatBubble>
      </ChatMessageList>

      <div className="">
        <form className="flex gap-2 ">
          <ChatInput/>
          <Button size="icon" className="h-8 w-8">
            <Send className="h-4 w-4" />
            <span className="sr-only">Send message</span>
          </Button>
        </form>
      </div>
    </div>
  )
}

