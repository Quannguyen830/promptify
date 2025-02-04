import * as React from "react"
import { ScrollArea } from "~/components/ui/scroll-area"
import { Input } from "~/components/ui/input"
import { Search, Briefcase, ChevronRight } from "lucide-react"
import { Fragment, useEffect, useState } from "react"
import { api } from "~/trpc/react"
import { useSession } from "next-auth/react"
import { type Folder, type Workspace } from "@prisma/client"
import { MyDrive, type FolderHistoryItem } from "~/constants/interfaces"

interface WorkspaceSelectorProps {
  onSelect: (workspace: Workspace | Folder) => void
}

export function WorkspaceSelector({ onSelect }: WorkspaceSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: session } = useSession();
  const [folderHistory, setFolderHistory] = useState<FolderHistoryItem[]>([MyDrive]);
  const [workspaceOrFolderList, setWorkspaceOrFolderList] = useState<Workspace[] | Folder[]>([]);
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);


  const { data: workspaces } = api.workspace.listWorkspaceByUserId.useQuery({
    userId: session?.user.id ?? ""
  });

  const { data: folders } = api.folder.listFolderByWorkspaceId.useQuery(
    { workspaceId: currentFolderId! },
    { enabled: !!currentFolderId }
  );

  useEffect(() => {
    setWorkspaceOrFolderList(workspaces ?? []);
  }, [workspaces]);

  useEffect(() => {
    if (folders && folders.length > 0) {
      console.log(folders)
      setWorkspaceOrFolderList(folders);
    }
  }, [folders]);

  const handleItemClick = (item: Workspace | Folder) => {
    setFolderHistory((prev) => [...prev, item])

    if (!item.hasSubfolders) {
      onSelect(item)
    }

    // This is a folder
    if ('workspaceId' in item) {
      setCurrentFolderId(item.id); // Set the current folder ID
    }
    // This is a workspace 
    else {
      setCurrentFolderId(item.id); // Set the current workspace ID
    }

  }

  const handleBreadcrumbClick = (index: number) => {
    if (index == 0) {
      setWorkspaceOrFolderList(workspaces ?? []);
      setFolderHistory([MyDrive])
    }

    setFolderHistory(folderHistory.slice(0, index + 1));
    const selected = folderHistory[index];

    if (selected) {
      if ('workspaceId' in selected) {
        setCurrentFolderId(selected.id); // Set the current folder ID
      } else {
        setCurrentFolderId(null); // Reset to root
      }
    }
  };

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
      {folderHistory.length > 0 && (
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          {folderHistory.map((item, index) => (
            <Fragment key={item.id}>
              {index > 0 && <ChevronRight className="h-4 w-4" />}
              <button
                onClick={() => handleBreadcrumbClick(index)}
                className="hover:text-primary transition-colors"
              >
                {item.name}
              </button>
            </Fragment>
          ))}
        </div>
      )}
      <ScrollArea className="h-[200px] border rounded-md">
        <div className="p-4 space-y-2">
          {workspaceOrFolderList.map((item) => (
            <button
              key={item.id}
              onClick={() => handleItemClick(item)}
              className="w-full flex items-center gap-2 p-2 rounded-md hover:bg-accent text-left"
            >
              <Briefcase className="h-4 w-4" />
              <span className="flex-1">{item.name}</span>
              {item.hasSubfolders && <ChevronRight className="h-4 w-4" />}
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}

