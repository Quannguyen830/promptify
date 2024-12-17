import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Send } from 'lucide-react'

export function ChatSection() {
  return (
    <div className="flex flex-col h-full border-l">
      <div className="border-b p-4">
        <h2 className="font-semibold">Chat</h2>
      </div>
      <div className="flex-1 overflow-auto h-[calc(100vh-11rem)] p-4 space-y-4">
        <div className="bg-muted/50 rounded-lg p-3 max-w-[80%]">
          <p className="text-sm">Hello! How can I help you today?</p>
        </div>
        <div className="bg-primary/10 rounded-lg p-3 ml-auto max-w-[80%]">
          <p className="text-sm">I need help with the project setup.</p>
        </div>
      </div>
      <div className="border-t p-4">
        <form className="flex gap-2">
          <Input
            placeholder="Type your message..."
            className="flex-1"
          />
          <Button size="icon">
            <Send className="h-4 w-4" />
            <span className="sr-only">Send message</span>
          </Button>
        </form>
      </div>
    </div>
  )
}

