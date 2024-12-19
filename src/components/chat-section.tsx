import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Send } from 'lucide-react'
import { PrimaryChat } from "./chat-section/primary-chat"
import { SecondaryChat } from "./chat-section/secondary-chat"

export function ChatSection() {
  return (
    <div className="flex flex-col h-[calc(100vh-64px)] border-l">
      <div className="border-b-[2px] p-3">
        <h2 className="font-semibold text-2xl">Chat</h2>
      </div>
      <div className="flex-1 overflow-auto p-4 space-y-4">
        <PrimaryChat />
        <SecondaryChat />
      </div>
      <div className="p-4">
        <form className="flex gap-2 items-center">
          <Input
            placeholder="Type your message..."
            className="flex-1 text-lg placeholder:text-lg py-5 border-[3px]"
          />
          <Button size="icon" className="">
            <Send className="h-6 w-6" />
            <span className="sr-only">Send message</span>
          </Button>
        </form>
      </div>
    </div>
  )
}

