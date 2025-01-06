import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Send } from 'lucide-react'
import { UserMessageBox } from "../chat-section/user-message-box"
import { AgentMessageBox } from "../chat-section/agent-message-box"

export function ChatSection() {
  return (
    <div className="flex flex-col h-full p-5">
      <h2 className="h-7 font-semibold text-2xl mb-5">Chat</h2>
      
      <div className="flex-1 overflow-auto p-3 space-y-3">
        {/* <AgentMessageBox/>
        <UserMessageBox/> */}
      </div>

      <div className="">
        <form className="flex gap-2 items-center">
          <Input
            placeholder="Type your message..."
            className="flex-1 text-sm placeholder:text-sm py-2 border-2 focus-visible:ring-0"
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

