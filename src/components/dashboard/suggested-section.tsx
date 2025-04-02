import { Folder as FolderIcon, AlertTriangle } from 'lucide-react'
import { Button } from "~/components/ui/button"
import { FolderCard } from "./folder-card"
import { FileCard } from "./file-card"
import { type Folder, type File, type Workspace } from '@prisma/client'
import { WorkspaceCard } from "./workspace-card"
import { cn } from '~/lib/utils'

interface SuggestedSectionProps {
  title: string
  type: "folders" | "files" | "workspaces"
  files?: Array<File>
  folders?: Array<Folder>
  workspaces?: Array<Workspace>
}

export function SuggestedSection({ title, type, files = [], folders = [], workspaces = [] }: SuggestedSectionProps) {

  return (
    <section className="space-y-4 mt-3">
      <div className="flex items-center">
        <Button
          variant="ghost"
          className="px-2"
        >
          <h3 className='text-lg'>
            {title}
          </h3>
        </Button>
      </div>
      <div className={cn(
        "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 transition-all duration-300 ease-in-out origin-top",
      )}>
        {type === "workspaces" ? (
          workspaces.length > 0 ? (
            workspaces.map((workspace) => (
              <WorkspaceCard
                key={workspace.id}
                id={workspace.id}
                name={workspace.name}
                date={workspace.createdAt.toDateString()}
              />
            ))
          ) : (
            <div className="flex items-center justify-center text-gray-500 col-span-1 md:col-span-2 lg:col-span-4">
              <AlertTriangle className="h-5 w-5 mr-2" />
              <span>No workspaces available. Please create a workspace to continue</span>
            </div>
          )
        ) : type === "folders" ? (
          folders.length > 0 ? (
            folders.map((folder) => (
              <FolderCard
                key={folder.id}
                id={folder.id}
                title={folder.name}
                subtitle={folder.workspaceName}
                icon={<FolderIcon className="h-6 w-6" />}
              />
            ))
          ) : (
            <div className="flex items-center justify-center text-gray-500 col-span-1 md:col-span-2 lg:col-span-4">
              <AlertTriangle className="h-5 w-5 mr-2" />
              <span>No folders available. Please create a folder to continue</span>
            </div>
          )
        ) : (
          files.length > 0 ? (
            files.map((file) => (
              <FileCard
                key={file.id}
                id={file.id}
                title={file.name}
                date={file.createdAt.toDateString()}
                subtitle={file.folderName ?? file.workspaceName}
                image={file.image ?? "/sample-1.jpg"}
                fileType={file.type}
              />
            ))
          ) : (
            <div className="flex items-center justify-center text-gray-500 col-span-1 md:col-span-2 lg:col-span-4">
              <AlertTriangle className="h-5 w-5 mr-2" />
              <span>No files available. Please create a file to continue</span>
            </div>
          )
        )}
      </div>
    </section>
  )
}

