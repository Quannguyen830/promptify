"use client";

import { type BaseProps } from "~/constants/interfaces";
import { Button } from "../ui/button";
import { ChevronDown, Plus } from "lucide-react";
import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel } from "../ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";

import { api } from "~/trpc/react";
import ChatTopicCard from "../chat/chat-topic-card";
import Loading from "../share/loading-spinner";
import { ChatState, useChatStore } from "../chat/chat-store";


const AssistantTopicListing: React.FC<BaseProps> = ({ className }) => {
  const utils = api.useUtils();
  const {
    setChatState,
    setSelectedSessionId,
  } = useChatStore();
  
  const { data: topics, isLoading } = api.chat.getAllChatSessionsId.useQuery();
  const createSession = api.chat.createChatSessionWithoutInitMessage.useMutation({
    onMutate() {
      setChatState(ChatState.SESSION_SELECTED);

      utils.chat.getAllChatSessionsId.setData(
        undefined, 
        (sessions) => [
          ...sessions ?? [],
          {
            id: crypto.randomUUID(),
            name: "Untitled",
          }
        ]
      )
    },
    onSettled(data) {
      if (data) setSelectedSessionId(data.id);

      void utils.chat.getAllChatSessionsId.invalidate();
    }
  });
   
  const handleCreateSession =  async () => {
    await createSession.mutateAsync();
  }
  
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <Button className="flex p-3 w-full justify-between rounded-lg h-12" onClick={handleCreateSession}>
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
            <SidebarGroupContent className="overflow-y-auto h-80">
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
            </SidebarGroupContent>
          </CollapsibleContent>
        </SidebarGroup>
      </Collapsible>
    </div>
  );
}
export default AssistantTopicListing;