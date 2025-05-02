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
    <Button className={`flex overflow-hidden items-start ${selectedSessionId === id && "bg-stone-200 text-accent-foreground"} ${className}`} onClick={handleClick} variant="ghost">
      <FileText/>
      <p className="w-full text-start overflow-hidden">{children}</p>
      
      {/* TODO: Implement tools */}
      <Ellipsis/>
    </Button>
  );
}
export default ChatTopicCard;