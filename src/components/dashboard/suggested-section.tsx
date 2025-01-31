import { ChevronDown, Folder as FolderIcon } from 'lucide-react'
import { Button } from "~/components/ui/button"
import { FolderCard } from "./folder-card"
import { FileCard } from "./file-card"
import { type Folder, type File, type Workspace } from '@prisma/client'
import { WorkspaceCard } from "./workspace-card"

interface SuggestedSectionProps {
  title: string
  type: "folders" | "files" | "workspaces"
  files?: Array<File>
  folders?: Array<Folder>
  workspaces?: Array<Workspace>
}

export function SuggestedSection({ title, type, files, folders = [], workspaces = [] }: SuggestedSectionProps) {
  return (
    <section className="space-y-4">
      <div className="flex items-center">
        <Button variant="ghost" className="px-2">
          <ChevronDown className="h-4 w-4 mr-2" />
          {title}
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {type === "folders"
          ? folders.map((folder) => (
            <FolderCard
              key={folder.id}
              id={folder.id}
              title={folder.name}
              subtitle={folder.name}
              icon={<FolderIcon className="h-5 w-5" />}
            />
          ))
          : type === "workspaces"
            ? workspaces.map((workspace) => (
              <WorkspaceCard
                key={workspace.id}
                id={workspace.id}
                name={workspace.name}
              // type={workspace.type}
              />
            ))
            : files?.map((file) => (
              <FileCard
                key={file.id}
                title={file.name}
                date={file.createdAt.toDateString()}
                imageUrl={"/favicon.ico"}
              />
            ))}
      </div>
    </section>
  )
}

