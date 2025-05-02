import { type ChatSessionCardProps } from "~/constants/interfaces";
import { Button } from "../ui/button";
import { ChatState, useChat } from "./chat-store";
import { Ellipsis, FileText } from "lucide-react";


export const ChatSessionCard = ({children, className, id} : ChatSessionCardProps) => {  
  const { 
    selectedSessionId,
    setChatState,
    setSelectedSessionId
  } = useChat();
  
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
export default ChatSessionCard;