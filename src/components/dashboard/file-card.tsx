import { MoreVertical } from 'lucide-react'
import { Card, CardContent, CardHeader } from "~/components/ui/card"
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

export function FileCard({ id, title, date, imageUrl, subtitle }: FileCardProps) {
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
    removeFile({ fileId: id });
  }

  return (
    <>
      <Card className="hover:bg-accent cursor-pointer transition-colors">
        <Link href={`/file/${id}`}>
          <CardHeader className="p-0">
            <div className="relative aspect-video w-full">
              <Image
                src={imageUrl}
                alt={title}
                fill
                className="object-cover p-3 rounded-[20px]"
              />
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium leading-none">{title}</h3>
                <p className="text-sm text-muted-foreground truncate mt-1">{subtitle}</p>
                <p className="text-sm text-muted-foreground mt-2">{date}</p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Share</DropdownMenuItem>
                  <DropdownMenuItem>Get link</DropdownMenuItem>
                  <DropdownMenuItem
                    className='text-red-500'
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemove();
                    }}>
                    Remove</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardContent>
        </Link>
      </Card>
    </>
  )
}

