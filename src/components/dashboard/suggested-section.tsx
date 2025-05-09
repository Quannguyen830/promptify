import { Folder as FolderIcon, AlertTriangle, FileText, Calendar } from 'lucide-react'
import { Button } from "~/components/ui/button"
import { FolderCard } from "./folder-card"
import { FileCard } from "./file-card"
import { Folder, File, type Workspace } from '@prisma/client'
import { WorkspaceCard } from "./workspace-card"
import { cn } from '~/lib/utils'
import { formatDate, formatFileSize } from '~/lib/utils/format-text'

interface SuggestedSectionProps {
  title: string
  type: "folders" | "files" | "workspaces"
  files?: Array<File>
  folders?: Array<Folder>
  workspaces?: Array<Workspace>
  viewMode?: "list" | "grid"
}

export function SuggestedSection({ 
  title, 
  type, 
  files = [], 
  folders = [], 
  workspaces = [],
  viewMode = "grid" 
}: SuggestedSectionProps) {

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
      
      {type === "files" && viewMode === "list" ? (
        <div className="w-full">
          <div className="grid grid-cols-12 gap-4 py-2 px-4 border-b font-medium text-sm text-muted-foreground">
            <div className="col-span-4">Name</div>
            <div className="col-span-2">Location</div>
            <div className="col-span-2">Size</div>
            <div className="col-span-2">Created</div>
            <div className="col-span-2">Modified</div>
          </div>
          <div className="space-y-1 mt-2">
            {files.length > 0 ? (
              files.map((file) => (
                <div 
                  key={file.id} 
                  className="grid grid-cols-12 gap-4 py-2 px-4 hover:bg-accent/5 rounded-md cursor-pointer"
                  onClick={() => window.location.href = `/file/${file.id}`}
                >
                  <div className="col-span-4 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-blue-500" />
                    <span className="truncate">{file.name}</span>
                  </div>
                  <div className="col-span-2 flex items-center gap-2">
                    <FolderIcon className="h-4 w-4 text-muted-foreground" />
                    <span className="truncate text-sm text-muted-foreground">{file.folderName || file.workspaceName || "-"}</span>
                  </div>
                  <div className="col-span-2 text-sm text-muted-foreground">
                    {formatFileSize(file.size)}
                  </div>
                  <div className="col-span-2 flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{formatDate(file.createdAt)}</span>
                  </div>
                  <div className="col-span-2 text-sm text-muted-foreground">
                    {formatDate(file.updatedAt)}
                  </div>
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center text-gray-500 py-8">
                <AlertTriangle className="h-5 w-5 mr-2" />
                <span>No files available</span>
              </div>
            )}
          </div>
        </div>
      ) : (
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
                  subtitle={file.folderName || file.workspaceName}
                  image={file.image || "/sample-1.jpg"}
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
      )}
    </section>
  )
}

