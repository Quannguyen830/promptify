import { MoreHorizontal } from "lucide-react";
import { TabsList, TabsTrigger } from "~/components/ui/tabs";

export function SlidingTab() {
  return (
    <div className="w-auto">
      <TabsList className="border-b w-full justify-start h-auto p-0 bg-transparent">
        <TabsTrigger
          value="workspaces"
          className="px-4 py-2 data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none bg-transparent"
        >
          Workspaces <span className="ml-1 text-xs bg-gray-200 px-1 rounded-full">1</span>
        </TabsTrigger>
        <TabsTrigger
          value="task"
          className="px-4 py-2 data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none bg-transparent"
        >
          Task
        </TabsTrigger>
        <TabsTrigger
          value="document"
          className="px-4 py-2 data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none bg-transparent"
        >
          Document
        </TabsTrigger>
        <button className="px-4 py-2 text-gray-600">
          <MoreHorizontal size={16} />
        </button>
      </TabsList>
    </div>
  )
}
