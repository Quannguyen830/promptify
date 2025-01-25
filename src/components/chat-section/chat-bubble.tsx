"use client"

import { type BaseProps } from "~/constants/interfaces";
import { MessageType } from "./chat-store";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { useSession } from "next-auth/react";

interface ChatBubbleProps extends BaseProps {
  variant: MessageType
}

const ChatBubble = ({ className, children, variant }: ChatBubbleProps) => {
  const { data: session } = useSession();
  const firstLetter = session?.user?.email?.[0]?.toUpperCase() ?? '';

  const USER_BUBBLE_STYLE = "p-2 pl-0 flex flex-row items-center gap-2 rounded-lg";
  const AGENT_BUBBLE_STYLE = "p-2 border-2 bg-black/10 rounded-lg";

  return (
    <>
      {variant === MessageType.AGENT ? (
        <div className={`${AGENT_BUBBLE_STYLE} ${className}`}>
          <p>{children}</p>
        </div>
      ) : (
        <div className={`${USER_BUBBLE_STYLE} ${className}`}>
          <Avatar className="h-8 w-8">
            <AvatarFallback>{firstLetter}</AvatarFallback>
          </Avatar>
          
          <p>{children}</p>
        </div>
      )}
    </>
  );
};

export default ChatBubble;