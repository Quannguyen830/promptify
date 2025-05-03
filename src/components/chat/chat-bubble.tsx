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
      {variant.toUpperCase() === MessageSenderSchema.enum.SYSTEM ? (
        // For agent
        <div className={`markdown-body p-2 w-full ${className}`}>
          <Markdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
          >
            {content}
          </Markdown>
        </div>
      ) : (
        // For user
        <div className="flex w-full justify-end">
          <div className={`py-2 pl-2 pr-4 flex justify-end bg-black/10 w-auto gap-2 rounded-3xl ${className}`}>
            <Avatar className="h-8 w-8">
              <AvatarFallback>{firstLetter}</AvatarFallback>
            </Avatar>

            <div className="flex items-center">
              <p className="justify-center break-words whitespace-pre-wrap">
                {content}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBubble;