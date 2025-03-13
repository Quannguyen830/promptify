"use client";

import { type ChatSessionCardProps } from "~/constants/interfaces";
import { Button } from "../ui/button";
import { ChatState, useChat } from "./chat-store";
import { Ellipsis } from "lucide-react";

export const ChatSessionCard = ({children, id} : ChatSessionCardProps) => {  
  const { 
    setChatState,
    setSelectedSessionId
  } = useChat();
  
  const handleClick = () => { 
    console.log("SESSION SELECTED: " + id);

    setChatState(ChatState.SESSION_SELECTED);
    setSelectedSessionId(id);
  }

  return (
    <Button className="flex overflow-hidden" onClick={handleClick} variant="outline">
      <p className="w-full overflow-hidden">{children}</p>
      
      {/* TODO: Implement tools */}
      <Ellipsis/>
    </Button>
  );
}
export default ChatSessionCard;