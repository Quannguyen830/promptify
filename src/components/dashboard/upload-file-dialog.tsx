"use client"

import * as React from "react"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "~/components/ui/dialog"
import { Button } from "~/components/ui/button"
import { Label } from "~/components/ui/label"
import { Upload, ArrowLeft, X } from "lucide-react"
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
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { data: session } = useSession()
  const utils = api.useUtils()
  const currentParent = useDashboardStore((state) => state.currentParent)
  const [isDragging, setIsDragging] = useState(false)
  const [step, setStep] = useState<"workspace" | "upload">("workspace")
  const [selectedParent, setSelectedParent] = useState<Workspace | Folder | null>(null)
  
  useEffect(() => {
    if (open) {
      if (currentParent) {
        setStep("upload")
        setSelectedParent(currentParent)
      } else {
        setStep("workspace")
        setSelectedParent(null)
      }
      setSelectedFiles([])
    }
  }, [open, currentParent])

  // Add new mutation for multiple files
  const uploadMultipleFilesMutation = api.file.uploadMultipleFiles.useMutation({
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
        name: "placeholder name",
        size: 1,
        type: "placeholder type",
        createdAt: new Date(),
        updatedAt: new Date(),
        lastAccessed: null,
        itemType: "file" as const,
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
    const files = e.target.files
    if (files && files.length > 0) {
      setSelectedFiles(Array.from(files))
    } else {
      setSelectedFiles([])
    }
  }

  const handleWorkspaceSelect = (selected: Workspace | Folder) => {
    setSelectedParent(selected)
    setStep("upload")
  }

  const handleUpload = async () => {
    const parent = currentParent ?? selectedParent
    if (selectedFiles.length === 0 || !parent) return

    try {
      if (session !== null) {
        handleClose()

        const filePayloads = await Promise.all(selectedFiles.map(async (file) => {
          const arrayBuffer = await file.arrayBuffer()
          const uint8Array = new Uint8Array(arrayBuffer)
          const thumbnail = await generateThumbnail(file)

          return {
            fileName: file.name,
            fileSize: file.size.toString(),
            fileType: file.type,
            fileBuffer: uint8Array,
            image: thumbnail,
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
        }))

        await uploadMultipleFilesMutation.mutateAsync(filePayloads)
      }
    } catch (error) {
      console.error("File upload failed:", error)
    }
  }

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
  }

  // Reset state function
  const resetState = () => {
    setSelectedFiles([])
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

  // Handle drag events
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }
  
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    
    const files = e.dataTransfer.files
    if (files.length > 0) {
      setSelectedFiles(Array.from(files))
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleDialogOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <div className="flex justify-between items-center">
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload
          </DialogTitle>
          <Button variant="ghost" size="icon" onClick={handleClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <p className="text-sm text-muted-foreground mt-2">
          Upload your documents here by dragging the files or browse.
        </p>
        
        {!currentParent && step === "workspace" ? (
          <WorkspaceSelector onSelect={handleWorkspaceSelect} />
        ) : (
          <div className="space-y-6 mt-4">
            {/* Drag and drop area - entire area clickable */}
            <div 
              className={`border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center h-48 cursor-pointer
                ${isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/20'}`}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-12 w-12 text-muted-foreground mb-3" />
              <p className="text-sm font-medium">Drag your file(s) or browse</p>
              <p className="text-xs text-muted-foreground mt-1">Max 10 MB files are allowed</p>
              <input
                ref={fileInputRef}
                type="file"
                multiple={true}
                onChange={handleFileChange}
                className="hidden"
                accept=".pdf,.docx,.doc,.csv"
              />
            </div>
            
            {selectedFiles.length > 0 && (
              <div className="max-h-40 overflow-y-auto">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="text-sm bg-muted p-2 rounded flex justify-between items-center mb-2">
                    <span>{file.name}</span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile(index);
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
            
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Only support docx, doc, PDF and CSV file.</p>
              
              {/* Location section */}
              <div className="space-y-2 pt-4 border-t mt-4">
                <Label className="font-medium">Location</Label>
                <div className="flex items-center gap-2 text-sm mt-2">
                  <span>Home</span>
                  <ArrowLeft className="h-3 w-3 rotate-180" />
                  <span>{selectedParent?.name || "Select location"}</span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          {step === "upload" && (
            <Button
              onClick={handleUpload}
              disabled={selectedFiles.length === 0 || !(currentParent ?? selectedParent)}
              className="bg-black hover:bg-gray-700"
            >
              Upload
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

