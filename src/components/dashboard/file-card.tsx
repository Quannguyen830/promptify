import { MoreVertical } from 'lucide-react'
import { Card, CardContent } from "~/components/ui/card"
import { Button } from "~/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"
import Image from "next/image"
import { type FileCardProps } from '~/constants/interfaces'
import { api } from '~/trpc/react'
import Link from 'next/link'
import { useState, useRef } from 'react'
import { DeleteWarningDialog } from '../upload/delete-warning-dialog'
import { RenameDialog } from '../upload/rename-dialog'
import { useToast } from "~/hooks/use-toast"
import { copyToClipboard } from "~/lib/utils/copy-to-clipboard"


export function FileCard({ id, title, date, fileType }: FileCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showRenameDialog, setShowRenameDialog] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const utils = api.useUtils();
  const { toast } = useToast()

  const updateFile = api.file.updateFileByFileId.useMutation({
    onSuccess: () => {
      void utils.workspace.listWorkspaceByUserId.invalidate()
      void utils.workspace.getWorkspaceByWorkspaceId.invalidate()
      void utils.folder.getFolderContentByFolderId.invalidate()
    }
  })

  const { mutate: removeFile } = api.file.deleteFileByFileId.useMutation({
    onMutate: () => {
      void utils.workspace.listWorkspaceByUserId.cancel()
      void utils.workspace.getWorkspaceByWorkspaceId.cancel()
      void utils.folder.getFolderContentByFolderId.cancel()

      const previousWorkspaces = utils.workspace.listWorkspaceByUserId.getData()
      const workspaces = previousWorkspaces ?? []

      const file = workspaces.flatMap(w => w.files).find(f => f.id === id)
      if (!file) return { previousWorkspaces }

      const previousWorkspace = file.workspaceId
        ? utils.workspace.getWorkspaceByWorkspaceId.getData({ workspaceId: file.workspaceId })
        : undefined
      const previousFolder = file.folderId
        ? utils.folder.getFolderContentByFolderId.getData({ folderId: file.folderId })
        : undefined

      if (file.workspaceId) {
        utils.workspace.getWorkspaceByWorkspaceId.setData(
          { workspaceId: file.workspaceId },
          (prev) => prev ? {
            ...prev,
            files: prev.files.filter(f => f.id !== id)
          } : prev
        )
      }

      if (file.folderId) {
        utils.folder.getFolderContentByFolderId.setData(
          { folderId: file.folderId },
          (prev) => prev ? {
            ...prev,
            files: prev.files.filter(f => f.id !== id)
          } : prev
        )
      }

      utils.workspace.listWorkspaceByUserId.setData(
        undefined,
        (prev) => prev?.map(workspace => ({
          ...workspace,
          files: workspace.files.filter(f => f.id !== id)
        }))
      )

      return { previousWorkspaces, previousWorkspace, previousFolder }
    },

    onSuccess: () => {
      void utils.workspace.listWorkspaceByUserId.invalidate()
      void utils.workspace.getWorkspaceByWorkspaceId.invalidate()
      void utils.folder.getFolderContentByFolderId.invalidate()
      
      toast({
        title: "File deleted",
        description: `"${title}" deleted successfully`,
        variant: "success",
        className: "p-4",
      })
    },

    onError: (error, variables, context) => {
      if (context) {
        utils.workspace.listWorkspaceByUserId.setData(undefined, context.previousWorkspaces)

        const file = context.previousWorkspaces?.flatMap(w => w.files).find(f => f.id === id)
        if (file) {
          if (file.workspaceId && context.previousWorkspace) {
            utils.workspace.getWorkspaceByWorkspaceId.setData(
              { workspaceId: file.workspaceId },
              context.previousWorkspace
            )
          }
          if (file.folderId && context.previousFolder) {
            utils.folder.getFolderContentByFolderId.setData(
              { folderId: file.folderId },
              context.previousFolder
            )
          }
        }
      }
      
      toast({
        title: "Deletion failed",
        description: "There was an error deleting the file",
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

  const handleConfirmRename = (newFileName: string) => {
    updateFile.mutate({ 
      fileId: id, 
      fileName: newFileName 
    })
  }

  const handleConfirmDelete = () => {
    removeFile({ fileId: id })
  }

  const handleGetLink = async () => {
    setDropdownOpen(false)
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? window.location.origin
    const shareUrl = `${baseUrl}/file/${id}`
    
    const success = await copyToClipboard(shareUrl)
    
    if (success) {
      toast({
        title: "Link copied",
        description: "File link copied to clipboard",
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
        title="Delete File"
        description={`Are you sure you want to delete "${title}"? This action cannot be undone.`}
      />

      <RenameDialog
        open={showRenameDialog}
        onOpenChange={setShowRenameDialog}
        onConfirm={handleConfirmRename}
        title="Rename File"
        currentName={title}
        itemType="file"
      />

      <Card className="overflow-hidden hover:bg-accent/5 cursor-pointer transition-colors shadow-none">
        <Link href={`/file/${id}`}>
          <div className="relative aspect-[1.6] w-full rounded-lg p-2">
            <div className='bg-gray-200 w-full h-full rounded-lg'></div>
            {fileType == 'application/pdf' && (
              <div className="absolute top-4 left-4 p-1 rounded-md">
                <Image
                  src={"/icon/pdf-icon.svg"}
                  alt="PDF icon"
                  width={40}
                  height={40}
                />
              </div>
            )}
            {(fileType == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || fileType == 'application/msword') && (
              <div className="absolute top-4 left-4 p-1 rounded-md">
                <Image
                  src={"/icon/docx-icon.svg"}
                  alt="DOCX icon"
                  width={40}
                  height={40}
                />
              </div>
            )}
            <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
              <DropdownMenuTrigger asChild onClick={(e) => e.preventDefault()}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-4 right-4 h-8 w-8 hover:bg-background/90"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleRename();
                }}>Rename</DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  void handleGetLink();
                }}>Get link</DropdownMenuItem>
                <DropdownMenuItem
                  className='text-red-500'
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleRemove();
                  }}>
                  Remove
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <CardContent className="p-4 flex flex-col gap-2">
            <h3 className="font-medium leading-none truncate" title={title}>{title}</h3>
            <div className="flex items-center justify-between gap-2 mt-2">
              <p className="text-sm text-muted-foreground">
                {date}
              </p>
              <Image
                src="/icon/collab-icon.svg"
                alt="Collaborators"
                width={56}
                height={24}
              />
            </div>
          </CardContent>
        </Link>
      </Card>
    </>
  )
}

