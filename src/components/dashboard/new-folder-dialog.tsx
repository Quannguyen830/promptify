"use client"

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "~/components/ui/dialog"
import { Input } from "~/components/ui/input"
import { Button } from "~/components/ui/button"
import { Label } from "~/components/ui/label"
import { FolderPlus, ArrowLeft } from "lucide-react"
import { useEffect, useRef, useState, type ChangeEvent } from "react"
import { type Folder, type Workspace } from "@prisma/client"
import { api } from "~/trpc/react"
import { useDashboardStore } from "./dashboard-store"
import { WorkspaceSelector } from "./workspace-selector-dialog"

interface NewFolderDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onClose: () => void
}

type Step = "workspace" | "folder"

export function NewFolderDialog({ open, onOpenChange, onClose }: NewFolderDialogProps) {
  const [step, setStep] = useState<Step>("workspace")
  const [selectedParent, setSelectedParent] = useState<Workspace | Folder | null>(null)
  const [folderName, setFolderName] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)
  const utils = api.useUtils()
  const currentParent = useDashboardStore((state) => state.currentParent)

  // Reset state when dialog opens
  useEffect(() => {
    if (open) {
      if (currentParent) {
        setStep("folder")
        setSelectedParent(currentParent)
      } else {
        setStep("workspace")
        setSelectedParent(null)
      }
      setFolderName("")
    }
  }, [open, currentParent])

  const createFolderMutation = api.folder.createNewFolder.useMutation({
    onMutate: () => {
      void utils.workspace.listWorkspaceByUserId.cancel()
      void utils.workspace.getWorkspaceByWorkspaceId.cancel()
      void utils.folder.getFolderContentByFolderId.cancel()

      const parent = currentParent ?? selectedParent
      if (!parent) return {}

      const previousWorkspaces = utils.workspace.listWorkspaceByUserId.getData()
      const previousWorkspace = parent.itemType === 'workspace'
        ? utils.workspace.getWorkspaceByWorkspaceId.getData({ workspaceId: parent.id })
        : undefined
      const previousFolder = parent.itemType === 'folder'
        ? utils.folder.getFolderContentByFolderId.getData({ folderId: parent.id })
        : undefined

      const newFolder = {
        id: "new-folder",
        name: folderName,
        workspaceId: parent.itemType === 'workspace'
          ? parent.id
          : (parent as Folder).workspaceId,
        workspaceName: parent.itemType === 'workspace'
          ? parent.name
          : (parent as Folder).workspaceName,
        itemType: "folder",
        hasSubfolders: false,
        size: 0,
        parentFolderId: parent.itemType === 'folder' ? parent.id : null,
        createdAt: new Date(),
        updatedAt: new Date(),
        lastAccessed: null,
        image: null,
        files: [],
        subfolders: []
      }

      // Update views based on parent type
      if (parent.itemType === 'workspace') {
        utils.workspace.getWorkspaceByWorkspaceId.setData(
          { workspaceId: parent.id },
          (prev) => prev ? {
            ...prev,
            folders: [...prev.folders, newFolder]
          } : prev
        )
      } else if (parent.itemType === 'folder') {
        utils.folder.getFolderContentByFolderId.setData(
          { folderId: parent.id },
          (prev) => prev ? {
            ...prev,
            subfolders: [...prev.subfolders, newFolder]
          } : prev
        )
      }

      // Update dashboard view
      utils.workspace.listWorkspaceByUserId.setData(
        undefined,
        (prev) => {
          if (!prev) return prev

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

      return { previousWorkspaces, previousWorkspace, previousFolder }
    },

    onSuccess: () => {
      const parent = currentParent ?? selectedParent
      if (!parent) return

      void utils.workspace.listWorkspaceByUserId.invalidate()
      if (parent.itemType === 'workspace') {
        void utils.workspace.getWorkspaceByWorkspaceId.invalidate({ workspaceId: parent.id })
      } else if (parent.itemType === 'folder') {
        void utils.folder.getFolderContentByFolderId.invalidate({ folderId: parent.id })
      }
    },

    onError: (error, variables, context) => {
      void utils.workspace.listWorkspaceByUserId.invalidate()

      if (currentParent?.itemType === 'workspace' && context?.previousWorkspace) {
        void utils.workspace.getWorkspaceByWorkspaceId.setData(
          { workspaceId: currentParent.id },
          context.previousWorkspace
        )
      } else if (currentParent?.itemType === 'folder' && context?.previousFolder) {
        void utils.folder.getFolderContentByFolderId.setData(
          { folderId: currentParent.id },
          context.previousFolder
        )
      }
    }
  })

  const handleWorkspaceSelect = (selected: Workspace | Folder) => {
    setSelectedParent(selected)
    setStep("folder")
  }

  const handleCreate = async () => {
    const parent = currentParent ?? selectedParent
    if (!parent || !folderName.trim()) return

    onClose()

    const uploadPayload = {
      workspaceId: parent.itemType === 'workspace'
        ? parent.id
        : (parent as Folder).workspaceId,
      workspaceName: parent.itemType === 'workspace'
        ? parent.name
        : (parent as Folder).workspaceName,
      name: folderName,
      parentsFolderId: parent.itemType === 'folder' ? parent.id : undefined
    }

    await createFolderMutation.mutateAsync(uploadPayload)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FolderPlus className="h-5 w-5" />
            {step === "workspace" ? "Select Location" : "New Folder"}
          </DialogTitle>
        </DialogHeader>

        {!currentParent && step === "workspace" ? (
          <WorkspaceSelector onSelect={handleWorkspaceSelect} />
        ) : (
          <div className="py-4 space-y-4">
            {!currentParent && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Button variant="ghost" size="sm" className="gap-1"
                  onClick={() => setStep("workspace")}
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
                Creating folder in: {selectedParent?.name}
              </div>
            )}
            {currentParent && (
              <div className="text-sm text-muted-foreground">
                Creating folder in: {currentParent.name}
              </div>
            )}
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
        )}

        <DialogFooter>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            {step === "folder" && (
              <Button
                onClick={handleCreate}
                disabled={!folderName.trim() || !(currentParent ?? selectedParent)}
              >
                Create
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

