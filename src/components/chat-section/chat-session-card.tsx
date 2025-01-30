import { type ChatSessionCardProps } from "~/constants/interfaces";
import { Button } from "../ui/button";
import { useChatStore } from "./chat-store";
import { api } from "~/trpc/react";
import { useState } from "react";

export const ChatSessionCard = ({children, title} : ChatSessionCardProps) => {
  const [sessionSelected, setSessionSelected] = useState<boolean>(false);
  const { data: selectedChatSession } = api.chat.getChatSessionById.useQuery({
    id: title
  },
  {
    enabled: sessionSelected
  }
);
  const {
    setChatSession
  } = useChatStore();

  const handleClick = () => {
    setSessionSelected(true);

    console.log()

    if (selectedChatSession) setChatSession(selectedChatSession);
  };
  
  return (
    <Button onClick={handleClick} variant="outline">
      {children}
    </Button>
  );
}
export default ChatSessionCard;