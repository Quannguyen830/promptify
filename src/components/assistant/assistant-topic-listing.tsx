"use client";

import { type BaseProps } from "~/constants/interfaces";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { SidebarContent } from "../ui/sidebar";
import { Collapsible } from "../ui/collapsible";

import { api } from "~/trpc/react";


const AssistantTopicListing: React.FC<BaseProps> = ({ className }) => {
  const { data: topics, isLoading } = api.chat.getAllChatSessionsId.useQuery();
  
  const handleNewTopic = () => {
    console.log("feroh")
  }
  
  return (
    <div className={` ${className}`}>
      <Button className="flex p-3 w-full justify-between" onClick={handleNewTopic}>
        <span>New Topic</span>
        <Plus/> 
      </Button>

      <SidebarContent>
        <Collapsible>
        </Collapsible>
      </SidebarContent>
    </div>
  );
}
export default AssistantTopicListing;