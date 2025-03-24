import { type BaseProps } from "~/constants/interfaces"

import { Sidebar, SidebarFooter, SidebarHeader } from "../ui/sidebar";
import { Button } from "../ui/button";
import { FileQuestion, FileText, Search } from "lucide-react";
import PageBreadcrumb from "../share/page-breadcrumb";

import Link from "next/link";
import AssistantTopicListing from "./assistant-topic-listing";
import { Separator } from "../ui/separator";


const AssistantSidebar: React.FC<BaseProps> = ({ className }) => {
  const navigations = [
    {
      name: "Ask",
      link: "/assistant/ask",
      icon: FileQuestion
    },
    {
      name: "Summarise",
      link: "/assistant/summarise",
      icon: FileText
    },
    {
      name: "Search",
      link: "/assistant/search",
      icon: Search
    }
  ]
  
  return (
    <Sidebar 
      side="right"
      collapsible="none"
      className={`border-none px-4 py-6 bg-stone-50 w-[292px] h-full${className}`}
    >
      <SidebarHeader className="p-0">
        <div>
          <PageBreadcrumb />
          {/* <SidebarTrigger /> */}
        </div>

        <nav className="flex flex-col">
          {navigations.map((route, index: number) => (
            <Button variant={"ghost"} className="flex gap-2 px-2 py-3 justify-start" key={index}>
              <route.icon className="h-6"/>
              <Link href={route.link} className="font-medium">{route.name}</Link>
            </Button>
          ))}
        </nav>

        <Separator/>

        <AssistantTopicListing className="pt-3" />
      </SidebarHeader>


      <SidebarFooter>

      </SidebarFooter>
    </Sidebar>
  )
}

export default AssistantSidebar;