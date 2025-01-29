import { type ChatSessionCardProps } from "~/constants/interfaces";
import { Button } from "../ui/button";
import { useChatStore } from "./chat-store";

export const ChatSessionCard = ({children, title} : ChatSessionCardProps) => {
  const {
    setChatSession
  } = useChatStore();

  const handleClick = () => {
    setChatSession(title);
  };
  
  return (
    <Button onClick={handleClick} variant="outline">
      {children}
    </Button>
  );
}
export default ChatSessionCard;