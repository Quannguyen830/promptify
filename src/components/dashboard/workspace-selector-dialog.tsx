import * as React from "react"
import { ScrollArea } from "~/components/ui/scroll-area"
import { Input } from "~/components/ui/input"
import { Search, Briefcase, ChevronRight } from "lucide-react"
import { useState } from "react"
import { api } from "~/trpc/react"
import { useSession } from "next-auth/react"
import { type Workspace } from "@prisma/client"

interface WorkspaceSelectorProps {
  onSelect: (workspace: Workspace) => void
}

export function WorkspaceSelector({ onSelect }: WorkspaceSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: session } = useSession();

  const workspaces = api.workspace.listWorkspaceByUserId
    .useQuery({ userId: session?.user.id ?? "" }).data ?? [];

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search workspaces"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-8"
        />
      </div>
      <ScrollArea className="h-[200px] border rounded-md">
        <div className="p-4 space-y-2">
          {workspaces.map((workspace) => (
            <button
              key={workspace.id}
              onClick={() => onSelect(workspace)}
              className="w-full flex items-center gap-2 p-2 rounded-md hover:bg-accent text-left"
            >
              <Briefcase className="h-4 w-4" />
              <span className="flex-1">{workspace.name}</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}

