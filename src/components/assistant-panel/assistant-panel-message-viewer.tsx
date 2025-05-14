"use client"

import { api } from "~/trpc/react";
import ChatTopicCard from "../chat/chat-topic-card";
import Loading from "../share/loading-spinner";
import { ScrollArea } from "../ui/scroll-area";
import { type BaseProps } from "~/constants/interfaces";

const AssistantPanelMessageViewer = ({ className } : BaseProps) => {  
  const { data: topics, isLoading } = api.chat.getAllChatSessionsId.useQuery();
  
  
  return (
    <ScrollArea className={`w-full scroller ${className}`}>
      {isLoading ? (
        <Loading className="h-full py-4" />
      ) : (
        topics!.map((topic, index: number) => (
          <ChatTopicCard
            id={topic.id}
            key={index}
            className="w-full"
          >
            {topic.name}
          </ChatTopicCard>
        ))
      )}
    </ScrollArea>
  ) 
};
export default AssistantPanelMessageViewer;
