import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Send } from 'lucide-react'
import { PrimaryChat } from "../chat-section/primary-chat"
import { SecondaryChat } from "../chat-section/secondary-chat"

export function ChatSection() {
  return (
    <div className="flex flex-col h-full">
      <div className="border-b h-10 flex items-center px-2">
        <h2 className="font-semibold text-lg">Chat</h2>
      </div>
      <div className="flex-1 overflow-auto p-3 space-y-3">
        <PrimaryChat />
        <SecondaryChat />
      </div>
      <div className="p-3">
        <form className="flex gap-2 items-center">
          <Input
            placeholder="Type your message..."
            className="flex-1 text-sm placeholder:text-sm py-2 border-2"
          />
          <Button size="icon" className="h-8 w-8">
            <Send className="h-4 w-4" />
            <span className="sr-only">Send message</span>
          </Button>
        </form>
      </div>
    </div>
  )
}

