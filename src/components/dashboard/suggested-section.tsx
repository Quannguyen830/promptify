import { ChevronDown, Folder as FolderIcon, AlertTriangle, ChevronUp } from 'lucide-react'
import { Button } from "~/components/ui/button"
import { FolderCard } from "./folder-card"
import { FileCard } from "./file-card"
import { type Folder, type File, type Workspace } from '@prisma/client'
import { WorkspaceCard } from "./workspace-card"
import { useState } from 'react'
import { cn } from '~/lib/utils'

interface SuggestedSectionProps {
  title: string
  type: "folders" | "files" | "workspaces"
  files?: Array<File>
  folders?: Array<Folder>
  workspaces?: Array<Workspace>
}

export function SuggestedSection({ title, type, files = [], folders = [], workspaces = [] }: SuggestedSectionProps) {
  const [isExpanded, setIsExpanded] = useState(true)

  const toggleExpand = () => {
    setIsExpanded(!isExpanded)
  }

  return (
    <section className="space-y-4 mt-3">
      <div className="flex items-center">
        <Button
          variant="ghost"
          className="px-2"
          onClick={toggleExpand}
          aria-expanded={isExpanded}
          aria-controls={`${title.toLowerCase().replace(/\s+/g, "-")}-content`}
        >
          {isExpanded ? (
            <ChevronDown className="h-4 w-4 mr-2 transition-transform duration-200" />
          ) : (
            <ChevronUp className="h-4 w-4 mr-2 transition-transform duration-200" />
          )}
          <h3 className='text-lg'>
            {title}
          </h3>
        </Button>
      </div>
      <div className={cn(
        "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 transition-all duration-300 ease-in-out origin-top",
        isExpanded ? "opacity-100 max-h-[1000px]" : "opacity-0 max-h-0 overflow-hidden",
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
                imageUrl={"/sample-1.jpg"}
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

