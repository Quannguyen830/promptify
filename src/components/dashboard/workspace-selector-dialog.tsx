import * as React from "react"
import { ScrollArea } from "~/components/ui/scroll-area"
import { Input } from "~/components/ui/input"
import { Search, Briefcase, ChevronRight } from "lucide-react"
import { Fragment, useEffect, useState } from "react"
import { api } from "~/trpc/react"
import { type Folder, type Workspace } from "@prisma/client"
import { MyDrive, type FolderHistoryItem } from "~/constants/interfaces"

interface WorkspaceSelectorProps {
  onSelect: (workspace: Workspace | Folder) => void
}

export function WorkspaceSelector({ onSelect }: WorkspaceSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [folderHistory, setFolderHistory] = useState<FolderHistoryItem[]>([MyDrive]);
  const [workspaceOrFolderList, setWorkspaceOrFolderList] = useState<Workspace[] | Folder[]>([]);
  const [allFolders, setAllFolders] = useState<Folder[]>([])
  const [rootFolders, setRootFolders] = useState<Folder[]>();
  const [childFolders, setChildFolders] = useState<Folder[]>();

  const { data: workspaces } = api.workspace.listWorkspaceByUserId.useQuery();

  useEffect(() => {
    setWorkspaceOrFolderList(workspaces ?? []);
    if (workspaces) {
      setAllFolders(workspaces.flatMap(workspace => workspace.folders));
    }
  }, [workspaces]);

  useEffect(() => {
    if (rootFolders && rootFolders.length > 0) {
      console.log("Root folders updated:", rootFolders);
      setWorkspaceOrFolderList(rootFolders);
    }
  }, [rootFolders]);

  useEffect(() => {
    if (childFolders && childFolders.length > 0) {
      setWorkspaceOrFolderList(childFolders);
    }
  }, [childFolders])

  const handleItemClick = (item: Workspace | Folder) => {
    setFolderHistory((prev) => [...prev, item])

    if (!item.hasSubfolders) {
      onSelect(item)
    }

    // This is a folder
    if ('workspaceId' in item) {
      const subfolders = allFolders.filter(folder => folder.parentFolderId === item.id);
      setChildFolders(subfolders)
    }
    // This is a workspace 
    else if ('folders' in item) {
      const folders = item.folders as Folder[];
      const filteredRootFolders = folders.filter(folder => folder.parentFolderId === null && folder.workspaceId === item.id);
      setRootFolders(filteredRootFolders);
    }

  }

  const handleBreadcrumbClick = (index: number) => {
    console.log("Breadcrumb clicked at index:", index);
    if (index === 0) {
      setWorkspaceOrFolderList(workspaces ?? []);
      setFolderHistory([MyDrive]);
    } else {
      const selectedItem = folderHistory[index];

      if (selectedItem) {
        if ('workspaceId' in selectedItem) {
          const subfolders = allFolders.filter(folder => folder.parentFolderId === selectedItem.id);
          setWorkspaceOrFolderList(subfolders);
        } else if ('folders' in selectedItem) {
          const folders = selectedItem.folders as Folder[];
          const filteredRootFolders = folders.filter(folder => folder.parentFolderId === null && folder.workspaceId === selectedItem.id);
          setWorkspaceOrFolderList(filteredRootFolders);
        }
      }
    }

    setFolderHistory(folderHistory.slice(0, index + 1));
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

