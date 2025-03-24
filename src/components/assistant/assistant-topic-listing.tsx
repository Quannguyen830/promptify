"use client";

import { type BaseProps } from "~/constants/interfaces";
import { Button } from "../ui/button";
import { ChevronDown, Plus } from "lucide-react";
import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel } from "../ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";

import { api } from "~/trpc/react";
import ChatSessionCard from "../chat-section/chat-session-card";
import Loading from "../share/loading-spinner";


const AssistantTopicListing: React.FC<BaseProps> = ({ className }) => {
  const { data: topics, isLoading } = api.chat.getAllChatSessionsId.useQuery();
  
  const handleNewTopic = () => {
    console.log("feroh")
  }
  
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <Button className="flex p-3 w-full justify-between rounded-lg h-12" onClick={handleNewTopic}>
        <span className="font-medium ">New Topic</span>
        <Plus className="w-10"/> 
      </Button>

      
      <Collapsible defaultOpen className="group/collapsible">
        <SidebarGroup>
          <SidebarGroupLabel asChild className="h-12 p-3">
            <CollapsibleTrigger className="hover:bg-stone-100 rounded-lg">
              <p className="text-black text-base font-medium">Recent</p>
              <ChevronDown className="ml-auto stroke-[3px] width-8 transition-transform group-data-[state=open]/collapsible:rotate-180" />
            </CollapsibleTrigger>
          </SidebarGroupLabel>

          <CollapsibleContent>
            <SidebarGroupContent>
              {isLoading ? (
                <Loading className="h-full py-4" />
              ) : (
                topics!.map((topic, index: number) => (
                  <ChatSessionCard
                    id={topic.id}
                    key={index}
                    className="w-full"
                  >
                    {topic.name}
                  </ChatSessionCard>
                ))
              )}
            </SidebarGroupContent>
          </CollapsibleContent>
        </SidebarGroup>
      </Collapsible>
    </div>
  );
}
export default AssistantTopicListing;