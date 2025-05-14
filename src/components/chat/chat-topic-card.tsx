import { type ChatTopicCardProps } from "~/constants/interfaces";
import { Button } from "../ui/button";
import { ChatState, useChatStore } from "./chat-store";
import { Ellipsis, FileText } from "lucide-react";


export const ChatTopicCard = ({children, className, id} : ChatTopicCardProps) => {  
  const { 
    selectedSessionId,
    setChatState,
    setSelectedSessionId
  } = useChatStore();
  
  const handleClick = () => { 
    setChatState(ChatState.SESSION_SELECTED);
    setSelectedSessionId(id);
  }

  return (
    <Button 
      className={`flex justify-start bg-red-400 items-start gap-2 p-2 text-left ${selectedSessionId === id ? "bg-stone-200 text-accent-foreground" : ""} ${className}`} 
      onClick={handleClick} 
      variant="ghost"
    >
      <FileText className="flex-shrink-0" />
      <p className="flex-1 overflow-hidden text-ellipsis">
        {children}
      </p>
      <Ellipsis className="flex-shrink-0" />
    </Button>
  );
}
export default ChatTopicCard;