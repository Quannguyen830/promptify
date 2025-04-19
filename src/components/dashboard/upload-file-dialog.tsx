"use client"

import * as React from "react"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "~/components/ui/dialog"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { Upload, ArrowLeft } from "lucide-react"
import { type ChangeEvent, useState, useRef, useEffect } from "react"
import { useSession } from "next-auth/react"
import { api } from "~/trpc/react"
import { useDashboardStore } from "./dashboard-store"
import { type Folder, type Workspace } from "@prisma/client"
import { WorkspaceSelector } from "./workspace-selector-dialog"
import { generateThumbnail } from "~/lib/utils/generateThumbnail"

interface UploadFileDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onClose: () => void
}

export function UploadFileDialog({ open, onOpenChange, onClose }: UploadFileDialogProps) {
  const [step, setStep] = useState<"workspace" | "upload">("workspace")
  const [selectedParent, setSelectedParent] = useState<Workspace | Folder | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { data: session } = useSession()
  const utils = api.useUtils()
  const currentParent = useDashboardStore((state) => state.currentParent)

  useEffect(() => {
    if (open) {
      if (currentParent) {
        setStep("upload")
        setSelectedParent(currentParent)
      } else {
        setStep("workspace")
        setSelectedParent(null)
      }
      setSelectedFile(undefined)
    }
  }, [open, currentParent])

  const uploadFileMutation = api.file.uploadFile.useMutation({
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

      const newFile = {
        id: "new-file",
        name: selectedFile?.name ?? "",
        size: selectedFile?.size ?? 0,
        type: selectedFile?.type ?? "",
        createdAt: new Date(),
        updatedAt: new Date(),
        lastAccessed: null,
        itemType: "file",
        workspaceId: parent.itemType === 'workspace'
          ? parent.id
          : (parent as Folder).workspaceId,
        workspaceName: parent.itemType === 'workspace'
          ? parent.name
          : (parent as Folder).workspaceName,
        folderId: parent.itemType === 'folder' ? parent.id : null,
        folderName: parent.itemType === 'folder' ? parent.name : null,
        image: null,
      }

      // Update views based on parent type
      if (parent.itemType === 'workspace') {
        utils.workspace.getWorkspaceByWorkspaceId.setData(
          { workspaceId: parent.id },
          (prev) => prev ? {
            ...prev,
            files: [...prev.files, newFile]
          } : prev
        )
      } else if (parent.itemType === 'folder') {
        utils.folder.getFolderContentByFolderId.setData(
          { folderId: parent.id },
          (prev) => prev ? {
            ...prev,
            files: [...prev.files, newFile]
          } : prev
        )
      }

      // Update dashboard view
      utils.workspace.listWorkspaceByUserId.setData(undefined, (prev) => {
        if (!prev) return prev
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

  const handleWorkspaceSelect = (selected: Workspace | Folder) => {
    setSelectedParent(selected)
    setStep("upload")
  }

  const handleUpload = async () => {
    const parent = currentParent ?? selectedParent
    if (!selectedFile || !parent) return

    try {
      if (session !== null) {
        handleClose()

        const arrayBuffer = await selectedFile.arrayBuffer()
        const uint8Array = new Uint8Array(arrayBuffer)

        // Generate thumbnail - now using the imported function
        const thumbnail = await generateThumbnail(selectedFile)

        const uploadPayload = {
          fileName: selectedFile.name,
          fileSize: selectedFile.size.toString(),
          fileType: selectedFile.type,
          fileBuffer: uint8Array,
          image: thumbnail, // This will now contain the proper thumbnail
          workspaceId: parent.itemType === 'workspace'
            ? parent.id
            : (parent as Folder).workspaceId,
          folderId: parent.itemType === 'folder'
            ? parent.id
            : undefined,
          workspaceName: parent.itemType === 'workspace'
            ? parent.name
            : (parent as Folder).workspaceName,
          folderName: parent.itemType === 'folder'
            ? parent.name
            : undefined,
        }

        await uploadFileMutation.mutateAsync(uploadPayload)
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
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            {step === "workspace" ? "Select Upload Location" : "Upload Files"}
          </DialogTitle>
        </DialogHeader>

        {!currentParent && step === "workspace" ? (
          <WorkspaceSelector onSelect={handleWorkspaceSelect} />
        ) : (
          <div className="space-y-4 py-4">
            {!currentParent && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Button variant="ghost" size="sm" className="gap-1"
                  onClick={() => setStep("workspace")}
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
                Uploading to: {selectedParent?.name}
              </div>
            )}
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
            {currentParent && (
              <div className="text-sm text-muted-foreground">
                Files will be uploaded to: {currentParent.name}
              </div>
            )}
          </div>
        )}

        <DialogFooter>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={handleClose}>
              Cancel
            </Button>
            {step === "upload" && (
              <Button
                onClick={handleUpload}
                disabled={!selectedFile || !(currentParent ?? selectedParent)}
                className="gap-2"
              >
                <Upload className="h-4 w-4" />
                Upload
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

