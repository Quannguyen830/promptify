"use client";

import { type ChatSessionCardProps } from "~/constants/interfaces";
import { Button } from "../ui/button";
import { ChatState, useChat } from "./chat-store";
import { Ellipsis, FileText } from "lucide-react";


export const ChatSessionCard = ({children, className, id} : ChatSessionCardProps) => {  
  const { 
    setChatState,
    setSelectedSessionId
  } = useChat();
  
  const handleClick = () => { 
    setChatState(ChatState.SESSION_SELECTED);
    setSelectedSessionId(id);
  }

  return (
    <Button className={`flex overflow-hidden ${className}`} onClick={handleClick} variant="ghost">
      <FileText/>
      <p className="w-full overflow-hidden">{children}</p>
      
      {/* TODO: Implement tools */}
      <Ellipsis/>
    </Button>
  );
}
export default ChatSessionCard;