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
import { useState } from 'react'
import { DeleteWarningDialog } from './delete-warning-dialog'

export function FileCard({ id, title, date, fileType }: FileCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const utils = api.useUtils();

  const { mutate: removeFile } = api.file.deleteFileByFileId.useMutation({
    onMutate: () => {
      void utils.workspace.listWorkspaceByUserId.cancel()
      void utils.workspace.getWorkspaceByWorkspaceId.cancel()
      void utils.folder.getFolderContentByFolderId.cancel()

      const previousWorkspaces = utils.workspace.listWorkspaceByUserId.getData()
      const workspaces = previousWorkspaces ?? []

      // Find the file to get its workspace and folder IDs
      const file = workspaces.flatMap(w => w.files).find(f => f.id === id)
      if (!file) return { previousWorkspaces }

      // Store previous states
      const previousWorkspace = file.workspaceId
        ? utils.workspace.getWorkspaceByWorkspaceId.getData({ workspaceId: file.workspaceId })
        : undefined
      const previousFolder = file.folderId
        ? utils.folder.getFolderContentByFolderId.getData({ folderId: file.folderId })
        : undefined

      // Update workspace view
      if (file.workspaceId) {
        utils.workspace.getWorkspaceByWorkspaceId.setData(
          { workspaceId: file.workspaceId },
          (prev) => prev ? {
            ...prev,
            files: prev.files.filter(f => f.id !== id)
          } : prev
        )
      }

      // Update folder view
      if (file.folderId) {
        utils.folder.getFolderContentByFolderId.setData(
          { folderId: file.folderId },
          (prev) => prev ? {
            ...prev,
            files: prev.files.filter(f => f.id !== id)
          } : prev
        )
      }

      // Update dashboard view
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
    }
  });
  const handleRemove = () => {
    setShowDeleteDialog(true)
  }

  const handleConfirmDelete = () => {
    removeFile({ fileId: id })
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
            {fileType == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' && (
              <div className="absolute top-4 left-4 p-1 rounded-md">
                <Image
                  src={"/icon/docx-icon.svg"}
                  alt="DOCX icon"
                  width={40}
                  height={40}
                />
              </div>
            )}
            <DropdownMenu>
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
            <h3 className="font-medium leading-none">{title}</h3>
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

