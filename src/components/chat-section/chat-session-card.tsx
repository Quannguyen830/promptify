import { type ChatSessionCardProps } from "~/constants/interfaces";
import { Button } from "../ui/button";
import { ChatSectionState, useChatStore } from "./chat-store";

export const ChatSessionCard = ({children, id} : ChatSessionCardProps) => {
  const {
    setCurrentChatSession: setCurrentChatSessionId,
    setChatState,
  } = useChatStore();


  const handleClick = () => {
    setChatState(ChatSectionState.SESSION_SELECTED);
    setCurrentChatSessionId(id);
  };
  
  return (
    <Button onClick={handleClick} variant="outline">
      {children}
    </Button>
  );
}
export default ChatSessionCard;