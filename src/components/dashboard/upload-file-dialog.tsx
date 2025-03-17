"use client"

import * as React from "react"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "~/components/ui/dialog"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { Upload } from "lucide-react"
import { type ChangeEvent, useState, useRef } from "react"
import { useSession } from "next-auth/react"
import { api } from "~/trpc/react"
import { useRouter } from "next/navigation"
import { useDashboardStore } from "./dashboard-store"
import { type Folder } from "@prisma/client"

interface UploadFileDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onClose: () => void
}

export function UploadFileDialog({ open, onOpenChange, onClose }: UploadFileDialogProps) {
  const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { data: session } = useSession()
  const utils = api.useUtils()
  const router = useRouter()
  const currentParent = useDashboardStore((state) => state.currentParent)

  const uploadFileMutation = api.file.uploadFile.useMutation({
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

      const newFile = {
        id: "new-file",
        name: selectedFile?.name ?? "",
        size: selectedFile?.size ?? 0,
        type: selectedFile?.type ?? "",
        createdAt: new Date(),
        updatedAt: new Date(),
        lastAccessed: null,
        itemType: "file",
        workspaceId: currentParent?.itemType === 'workspace'
          ? currentParent.id
          : (currentParent as Folder).workspaceId,
        workspaceName: currentParent?.itemType === 'workspace'
          ? currentParent.name
          : (currentParent as Folder).workspaceName,
        folderId: currentParent?.itemType === 'folder' ? currentParent.id : null,
        folderName: currentParent?.itemType === 'folder' ? currentParent.name : null,
        image: null,
      }

      // Update workspace view
      if (currentParent?.itemType === 'workspace') {
        utils.workspace.getWorkspaceByWorkspaceId.setData(
          { workspaceId: currentParent.id },
          (prev) => prev ? {
            ...prev,
            files: [...prev.files, newFile]
          } : prev
        )
      }

      // Update folder view
      if (currentParent?.itemType === 'folder') {
        utils.folder.getFolderContentByFolderId.setData(
          { folderId: currentParent.id },
          (prev) => prev ? {
            ...prev,
            files: [...prev.files, newFile]
          } : prev
        )
      }

      // Update dashboard view
      utils.workspace.listWorkspaceByUserId.setData(undefined, (prev) => {
        if (!prev || !currentParent) return prev
        return prev.map(workspace => {
          if (workspace.id === newFile.workspaceId) {
            return {
              ...workspace,
              files: [...workspace.files, newFile]
            }
          }
          return workspace
        })
      })

      return { previousWorkspaces, previousWorkspace, previousFolder }
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

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
    } else {
      setSelectedFile(undefined)
    }
  }

  const handleUpload = async () => {
    if (!selectedFile || !currentParent) return

    try {
      if (session !== null) {
        handleClose()

        const arrayBuffer = await selectedFile.arrayBuffer()
        const uint8Array = new Uint8Array(arrayBuffer)

        const uploadPayload = {
          fileName: selectedFile.name,
          fileSize: selectedFile.size.toString(),
          fileType: selectedFile.type,
          fileBuffer: uint8Array,
          workspaceId: currentParent.itemType === 'workspace'
            ? currentParent.id
            : (currentParent as Folder).workspaceId,
          folderId: currentParent.itemType === 'folder'
            ? currentParent.id
            : undefined,
          workspaceName: currentParent.itemType === 'workspace'
            ? currentParent.name
            : (currentParent as Folder).workspaceName,
          folderName: currentParent.itemType === 'folder'
            ? currentParent.name
            : undefined,
        }

        const fileId = await uploadFileMutation.mutateAsync(uploadPayload)
        router.push(`/file/${fileId}`)
      }
    } catch (error) {
      console.error("File upload failed:", error)
    }
  }

  // Reset state function
  const resetState = () => {
    setSelectedFile(undefined)
  }

  // Reset state when the dialog is closed
  const handleClose = () => {
    resetState()
    onClose()
  }

  const handleDialogOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      handleClose()
    }
    onOpenChange(isOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleDialogOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload files to Drive
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* File Selection */}
          <div className="space-y-2">
            <Label>Choose files</Label>
            <div className="flex gap-2">
              <Input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileChange}
                className="cursor-pointer"
                accept=".pdf, .docx"
              />
            </div>
            {/* Add a helper text for file type guidance */}
            <p className="text-sm text-muted-foreground">Allowed file types: PDF, DOCX</p>
          </div>

          {/* Current Location Display */}
          <div className="text-sm text-muted-foreground">
            Files will be uploaded to: {currentParent?.name ?? "My Drive"}
          </div>
        </div>

        <DialogFooter>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              onClick={handleUpload}
              disabled={!selectedFile || !currentParent}
              className="gap-2"
            >
              <Upload className="h-4 w-4" />
              Upload
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

