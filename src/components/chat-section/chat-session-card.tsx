import { type ChatSessionCardProps } from "~/constants/interfaces";
import { Button } from "../ui/button";
import { ChatSectionState, useChatStore } from "./chat-store";
import { api } from "~/trpc/react";
import { useState, useEffect } from "react";

export const ChatSessionCard = ({children, title} : ChatSessionCardProps) => {
  const [sessionSelected, setSessionSelected] = useState<boolean>(false);
  const { data: selectedChatSession } = api.chat.getChatSessionById.useQuery({
    id: title
  },
  {
    enabled: sessionSelected
  });

  const {
    setChatSession,
    setChatState,
  } = useChatStore();

  useEffect(() => {
    if (selectedChatSession) {
      setChatSession(selectedChatSession);
    }
  }, [selectedChatSession, setChatSession]);

  const handleClick = () => {
    setChatState(ChatSectionState.SESSION_SELECTED);
    setSessionSelected(true);
  };
  
  return (
    <Button onClick={handleClick} variant="outline">
      {children}
    </Button>
  );
}
export default ChatSessionCard;