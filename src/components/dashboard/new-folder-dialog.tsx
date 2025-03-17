"use client"

import * as React from "react"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "~/components/ui/dialog"
import { Input } from "~/components/ui/input"
import { Button } from "~/components/ui/button"
import { Label } from "~/components/ui/label"
import { FolderPlus } from "lucide-react"
import { useRef, useState, type ChangeEvent } from "react"
import { type Folder } from "@prisma/client"
import { api } from "~/trpc/react"
import { useRouter } from "next/navigation"
import { useDashboardStore } from "./dashboard-store"

interface NewFolderDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onClose: () => void
}

export function NewFolderDialog({ open, onOpenChange, onClose }: NewFolderDialogProps) {
  const [folderName, setFolderName] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)
  const utils = api.useUtils()
  const router = useRouter()
  const currentParent = useDashboardStore((state) => state.currentParent)

  const createFolderMutation = api.folder.createNewFolder.useMutation({
    onMutate: () => {
      void utils.workspace.listWorkspaceByUserId.cancel()
      void utils.workspace.getWorkspaceByWorkspaceId.cancel()
      void utils.folder.getFolderContentByFolderId.cancel()

      const previousWorkspaces = utils.workspace.listWorkspaceByUserId.getData()
      const previousWorkspace = currentParent?.itemType === 'workspace'
        ? utils.workspace.getWorkspaceByWorkspaceId.getData({ workspaceId: currentParent.id })
        : undefined
      const previousFolder = currentParent?.itemType === 'folder'
        ? utils.folder.getFolderContentByFolderId.getData({ folderId: currentParent.id })
        : undefined

      const newFolder = {
        id: "new-folder",
        name: folderName,
        workspaceId: currentParent?.itemType === 'workspace'
          ? currentParent.id
          : (currentParent as Folder).workspaceId,
        workspaceName: currentParent?.itemType === 'workspace'
          ? currentParent.name
          : (currentParent as Folder).workspaceName,
        itemType: "folder",
        hasSubfolders: false,
        size: 0,
        parentFolderId: currentParent?.itemType === 'folder' ? currentParent.id : null,
        createdAt: new Date(),
        updatedAt: new Date(),
        lastAccessed: null,
        image: null,
        files: [],
        subfolders: []
      }

      if (currentParent?.itemType === 'workspace') {
        utils.workspace.getWorkspaceByWorkspaceId.setData(
          { workspaceId: currentParent.id },
          (prev) => prev ? {
            ...prev,
            folders: [...prev.folders, newFolder]
          } : prev
        )
      } else if (currentParent?.itemType === 'folder') {
        utils.folder.getFolderContentByFolderId.setData(
          { folderId: currentParent.id },
          (prev) => prev ? {
            ...prev,
            subfolders: [...prev.subfolders, newFolder]
          } : prev
        )
      }

      utils.workspace.listWorkspaceByUserId.setData(
        undefined,
        (prev) => {
          if (!prev || !currentParent) return prev

          return prev.map(workspace => {
            if (workspace.id === newFolder.workspaceId) {
              return {
                ...workspace,
                folders: [...workspace.folders, newFolder]
              }
            }
            return workspace
          })
        }
      )

      return {
        previousWorkspaces,
        previousWorkspace,
        previousFolder
      }
    },

    onSuccess: () => {
      void utils.workspace.listWorkspaceByUserId.invalidate()
      if (currentParent?.itemType === 'workspace') {
        void utils.workspace.getWorkspaceByWorkspaceId.invalidate({ workspaceId: currentParent.id })
      } else if (currentParent?.itemType === 'folder') {
        void utils.folder.getFolderContentByFolderId.invalidate({ folderId: currentParent.id })
      }
    },

    onError: (error, variables, context) => {
      utils.workspace.listWorkspaceByUserId.setData(undefined, context?.previousWorkspaces)

      if (currentParent?.itemType === 'workspace' && context?.previousWorkspace) {
        utils.workspace.getWorkspaceByWorkspaceId.setData(
          { workspaceId: currentParent.id },
          context.previousWorkspace
        )
      } else if (currentParent?.itemType === 'folder' && context?.previousFolder) {
        utils.folder.getFolderContentByFolderId.setData(
          { folderId: currentParent.id },
          context.previousFolder
        )
      }
    }
  })

  const handleCreate = async () => {
    if (!currentParent || !folderName.trim()) return

    onClose()

    const uploadPayload = {
      workspaceId: currentParent.itemType === 'workspace'
        ? currentParent.id
        : (currentParent as Folder).workspaceId,
      workspaceName: currentParent.itemType === 'workspace'
        ? currentParent.name
        : (currentParent as Folder).workspaceName,
      name: folderName,
      parentsFolderId: currentParent.itemType === 'folder' ? currentParent.id : undefined
    }

    const newFolderId = await createFolderMutation.mutateAsync(uploadPayload)
    router.push(`/folder/${newFolderId}`)
  }

  const handleClose = () => {
    setFolderName("")
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FolderPlus className="h-5 w-5" />
            New Folder
          </DialogTitle>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <div className="text-sm text-muted-foreground">
            Creating folder in: {currentParent?.name ?? "My Drive"}
          </div>
          <div className="space-y-2">
            <Label htmlFor="folderName">Folder name</Label>
            <Input
              id="folderName"
              ref={inputRef}
              value={folderName}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setFolderName(e.target.value)}
              placeholder="Untitled folder"
              className="border-primary"
            />
          </div>
        </div>

        <DialogFooter>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              disabled={!folderName.trim() || !currentParent}
            >
              Create
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

