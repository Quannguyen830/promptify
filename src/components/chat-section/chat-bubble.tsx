"use client"

import { type BaseProps } from "~/constants/interfaces";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { useSession } from "next-auth/react";
import { MessageSenderSchema } from "~/constants/types";

import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import Markdown from "react-markdown";

interface ChatBubbleProps extends BaseProps {
  variant: string
  content: string
}

const ChatBubble = ({ className, content, variant }: ChatBubbleProps) => {
  const { data: session } = useSession();
  const firstLetter = session?.user?.email?.[0]?.toUpperCase() ?? '';

  const USER_BUBBLE_STYLE = "p-2 pl-0 flex flex-row items-center gap-2 rounded-lg";
  const AGENT_BUBBLE_STYLE = "p-2 w-full border-2 bg-black/10 rounded-lg";

  return (
    <>
      {variant === MessageSenderSchema.enum.SYSTEM ? (
        <div className={`markdown-body max-w-[100vh-548px] ${AGENT_BUBBLE_STYLE} ${className}`}>
          <Markdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
          >
            {content}
          </Markdown>
        </div>
      ) : (
        <div className={`${USER_BUBBLE_STYLE} ${className}`}>
          <Avatar className="h-8 w-8">
            <AvatarFallback>{firstLetter}</AvatarFallback>
          </Avatar>
          
          <p>{content}</p>
        </div>
      )}
    </>
  );
};

export default ChatBubble;