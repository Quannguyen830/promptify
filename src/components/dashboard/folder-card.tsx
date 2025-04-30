import { MoreVertical } from 'lucide-react'
import { Card } from "~/components/ui/card"
import { Button } from "~/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"
import Link from "next/link"
import { api } from '~/trpc/react'
import { useState } from 'react'
import { DeleteWarningDialog } from '../upload/delete-warning-dialog'

interface FolderCardProps {
  id: string
  title: string
  subtitle: string
  icon?: React.ReactNode
}

export function FolderCard({ id, title, subtitle, icon }: FolderCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const utils = api.useUtils();

  const { mutate: removeFolder } = api.folder.deleteFolderByFolderId.useMutation({
    onMutate: () => {
      void utils.workspace.listWorkspaceByUserId.cancel()
      void utils.workspace.getWorkspaceByWorkspaceId.cancel()
      void utils.folder.getFolderContentByFolderId.cancel()

      const previousWorkspaces = utils.workspace.listWorkspaceByUserId.getData()
      const workspaces = previousWorkspaces ?? []

      // Find the folder to get its workspace and parent folder IDs
      const folder = workspaces.flatMap(w => w.folders).find(f => f.id === id)
      if (!folder) return { previousWorkspaces }

      // Store previous states
      const previousWorkspace = folder.workspaceId
        ? utils.workspace.getWorkspaceByWorkspaceId.getData({ workspaceId: folder.workspaceId })
        : undefined
      const previousParentFolder = folder.parentFolderId
        ? utils.folder.getFolderContentByFolderId.getData({ folderId: folder.parentFolderId })
        : undefined

      // Update workspace view
      if (folder.workspaceId) {
        utils.workspace.getWorkspaceByWorkspaceId.setData(
          { workspaceId: folder.workspaceId },
          (prev) => prev ? {
            ...prev,
            folders: prev.folders.filter(f => f.id !== id)
          } : prev
        )
      }

      // Update parent folder view
      if (folder.parentFolderId) {
        utils.folder.getFolderContentByFolderId.setData(
          { folderId: folder.parentFolderId },
          (prev) => prev ? {
            ...prev,
            subfolders: prev.subfolders.filter(f => f.id !== id)
          } : prev
        )
      }

      // Update dashboard view
      utils.workspace.listWorkspaceByUserId.setData(
        undefined,
        (prev) => prev?.map(workspace => ({
          ...workspace,
          folders: workspace.folders.filter(f => f.id !== id)
        }))
      )

      return { previousWorkspaces, previousWorkspace, previousParentFolder }
    },

    onSuccess: () => {
      void utils.workspace.listWorkspaceByUserId.invalidate()
      void utils.workspace.getWorkspaceByWorkspaceId.invalidate()
      void utils.folder.getFolderContentByFolderId.invalidate()
    },

    onError: (error, variables, context) => {
      if (context) {
        utils.workspace.listWorkspaceByUserId.setData(undefined, context.previousWorkspaces)

        const folder = context.previousWorkspaces?.flatMap(w => w.folders).find(f => f.id === id)
        if (folder) {
          if (folder.workspaceId && context.previousWorkspace) {
            utils.workspace.getWorkspaceByWorkspaceId.setData(
              { workspaceId: folder.workspaceId },
              context.previousWorkspace
            )
          }
          if (folder.parentFolderId && context.previousParentFolder) {
            utils.folder.getFolderContentByFolderId.setData(
              { folderId: folder.parentFolderId },
              context.previousParentFolder
            )
          }
        }
      }
    }
  });

  const handleRemove = () => {
    setShowDeleteDialog(true)
  }

  const handleConfirmDelete = () => {
    removeFolder({ folderId: id })
  }

  return (
    <>
      <DeleteWarningDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleConfirmDelete}
        title="Delete Folder"
        description={`Are you sure you want to delete "${title}"? All contents within this folder will be permanently deleted. This action cannot be undone.`}
      />

      <Card className="group relative hover:bg-accent transition-colors">
        <Link href={`/folder/${id}`} className="block">
          <div className="p-4 flex items-start">
            <div className="mt-1 flex-shrink-0 mr-4">
              {icon}
            </div>
            <div className="flex-1 min-w-0 pr-8">
              <h3 className="text-sm font-medium leading-none truncate mb-1">
                {title}
              </h3>
              <p className="text-sm text-muted-foreground truncate">
                {subtitle}
              </p>
            </div>
          </div>
        </Link>
        <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Share</DropdownMenuItem>
              <DropdownMenuItem>Get link</DropdownMenuItem>
              <DropdownMenuItem className='text-red-500' onClick={(e) => {
                e.stopPropagation();
                handleRemove();
              }}>Remove</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </Card>
    </>
  )
}

