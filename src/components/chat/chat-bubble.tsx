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

  return (
    <>
      {variant === MessageSenderSchema.enum.SYSTEM ? (
        // For agent
        <div className={`markdown-body break-all p-2 bg-black/10 rounded-lg max-w-4xl ${className}`}>
          <Markdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
          >
            {content}
          </Markdown>
        </div>
      ) : (
        // For user
        <div className={`ring-1 p-2 pl-0 flex flex-row w-full max-w-4xl gap-2 rounded-lg ${className}`}>
          <Avatar className="h-8 w-8">
            <AvatarFallback>{firstLetter}</AvatarFallback>
          </Avatar>
          
          <p className="max-w-[848px] break-words whitespace-pre-wrap">{content}</p>
        </div>
      )}
    </>
  );
};

export default ChatBubble;