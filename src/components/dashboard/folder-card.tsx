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
import { useState, useRef } from 'react'
import { DeleteWarningDialog } from '../upload/delete-warning-dialog'
import { RenameDialog } from '../upload/rename-dialog'
import { useToast } from "~/hooks/use-toast"
import { copyToClipboard } from "~/lib/utils/copy-to-clipboard"

interface FolderCardProps {
  id: string
  title: string
  subtitle: string
  icon?: React.ReactNode
}

export function FolderCard({ id, title, subtitle, icon }: FolderCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showRenameDialog, setShowRenameDialog] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const utils = api.useUtils();
  const { toast } = useToast()

  const { mutate: removeFolder } = api.folder.deleteFolderByFolderId.useMutation({
    onMutate: () => {
      void utils.workspace.listWorkspaceByUserId.cancel()
      void utils.workspace.getWorkspaceByWorkspaceId.cancel()
      void utils.folder.getFolderContentByFolderId.cancel()

      const previousWorkspaces = utils.workspace.listWorkspaceByUserId.getData()
      const workspaces = previousWorkspaces ?? []

      const folder = workspaces.flatMap(w => w.folders).find(f => f.id === id)
      if (!folder) return { previousWorkspaces }

      const previousWorkspace = folder.workspaceId
        ? utils.workspace.getWorkspaceByWorkspaceId.getData({ workspaceId: folder.workspaceId })
        : undefined
      const previousParentFolder = folder.parentFolderId
        ? utils.folder.getFolderContentByFolderId.getData({ folderId: folder.parentFolderId })
        : undefined

      if (folder.workspaceId) {
        utils.workspace.getWorkspaceByWorkspaceId.setData(
          { workspaceId: folder.workspaceId },
          (prev) => prev ? {
            ...prev,
            folders: prev.folders.filter(f => f.id !== id)
          } : prev
        )
      }

      if (folder.parentFolderId) {
        utils.folder.getFolderContentByFolderId.setData(
          { folderId: folder.parentFolderId },
          (prev) => prev ? {
            ...prev,
            subfolders: prev.subfolders.filter(f => f.id !== id)
          } : prev
        )
      }

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
      
      toast({
        title: "Folder deleted",
        description: `"${title}" folder deleted successfully`,
        variant: "success",
        className: "p-4",
      })
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
      
      toast({
        title: "Deletion failed",
        description: "There was an error deleting the folder",
        variant: "destructive",
        className: "p-4",
      })
    }
  });

  const updateFolder = api.folder.updateFolderByFolderId.useMutation({
    onSuccess: () => {
      void utils.workspace.listWorkspaceByUserId.invalidate()
      void utils.workspace.getWorkspaceByWorkspaceId.invalidate()
      void utils.folder.getFolderContentByFolderId.invalidate()
      
      toast({
        title: "Folder renamed",
        description: "Folder renamed successfully",
        variant: "success",
        className: "p-4",
      })
    },
    onError: () => {
      toast({
        title: "Rename failed",
        description: "There was an error renaming the folder",
        variant: "destructive",
        className: "p-4",
      })
    }
  });

  const handleRemove = () => {
    setDropdownOpen(false)
    setShowDeleteDialog(true)
  }

  const handleRename = () => {
    setDropdownOpen(false)
    setShowRenameDialog(true)
  }

  const handleConfirmRename = (newName: string) => {
    updateFolder.mutate({ 
      folderId: id, 
      folderName: newName 
    })
  }

  const handleConfirmDelete = () => {
    removeFolder({ folderId: id })
  }

  const handleGetLink = async () => {
    setDropdownOpen(false)
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? window.location.origin
    const shareUrl = `${baseUrl}/folder/${id}`
    
    const success = await copyToClipboard(shareUrl)
    
    if (success) {
      toast({
        title: "Link copied",
        description: "Folder link copied to clipboard",
        variant: "success",
        className: "p-4",
      })
    } else {
      toast({
        title: "Copy failed",
        description: "Failed to copy link to clipboard",
        variant: "destructive",
        className: "p-4",
      })
    }
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

      <RenameDialog
        open={showRenameDialog}
        onOpenChange={setShowRenameDialog}
        onConfirm={handleConfirmRename}
        title="Rename Folder"
        currentName={title}
        itemType="folder"
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
          <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={(e) => {
                e.stopPropagation();
                handleRename();
              }}>Rename</DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => {
                e.stopPropagation();
                void handleGetLink();
              }}>Get link</DropdownMenuItem>
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

