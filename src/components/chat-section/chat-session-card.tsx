import { type ChatSessionCardProps } from "~/constants/interfaces";
import { Button } from "../ui/button";
import { ChatSectionState, useChatStore } from "./chat-store";
import { useState } from "react";
import { Ellipsis } from "lucide-react";

export const ChatSessionCard = ({children, id} : ChatSessionCardProps) => {
  const [sessionName, setSessionName] = useState<string>(id);
  
  const {
    setCurrentChatSession: setCurrentChatSessionId,
    setChatState,
  } = useChatStore();


  const handleClick = () => {
    setChatState(ChatSectionState.SESSION_SELECTED);
    setCurrentChatSessionId(id);
  };
  
  return (
    <Button className="flex overflow-hidden" onClick={handleClick} variant="outline">
      <p className="w-full overflow-hidden">{children}</p>
      
      {/* TODO: Implement tools */}
      <Ellipsis/>
    </Button>
  );
}
export default ChatSessionCard;