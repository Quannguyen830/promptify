"use client"

import * as React from "react"
import { Dialog, DialogContent, DialogFooter, DialogTitle } from "~/components/ui/dialog"
import { Button } from "~/components/ui/button"
import { Upload, X } from "lucide-react"
import { type ChangeEvent, useState, useRef, useEffect } from "react"
import { useSession } from "next-auth/react"
import { api } from "~/trpc/react"
import { useDashboardStore } from "../dashboard/dashboard-store"
import { type Folder, type Workspace } from "@prisma/client"
import { WorkspaceSelector } from "./workspace-selector-dialog"
import { FileUploadStatus } from "~/constants/interfaces"
import { FileDropZone } from "./file-drop-zone"
import { LocationDisplay } from "./location-display"
import { FileList } from "./file-list-area"
import { useToast } from "~/hooks/use-toast"

interface UploadFileDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onClose: () => void
}

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
};

export function UploadFileDialog({ open, onOpenChange, onClose }: UploadFileDialogProps) {
  const { toast } = useToast()
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [fileUploadStatuses, setFileUploadStatuses] = useState<FileUploadStatus[]>([])
  const [isUploading, setIsUploading] = useState(false)
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
      setFileUploadStatuses([])
      setIsUploading(false)
    }
  }, [open, currentParent])

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
      
      toast({
        title: "Files uploaded",
        description: `${selectedFiles.length} file${selectedFiles.length > 1 ? 's' : ''} uploaded successfully`,
        variant: "success", 
        className: "p-4", 
      })
      
      setIsUploading(false)
    },
    onError: (error) => {
      console.error("Upload error:", error)
      setIsUploading(false)
      
      toast({
        title: "Upload failed",
        description: "There was an error uploading your files",
        variant: "destructive",
        className: "p-4",
      })
      
      setFileUploadStatuses(prev => 
        prev.map(status => ({ ...status, error: true, uploading: false }))
      )
    }
  })

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      const fileArray = Array.from(files)
      setSelectedFiles(fileArray)
      
      setFileUploadStatuses(fileArray.map(file => ({
        file: file as unknown as FileUploadStatus['file'],
        progress: 0,
        uploading: false,
        error: false,
        fileSize: formatFileSize(file.size)
      })))
    } else {
      setSelectedFiles([])
      setFileUploadStatuses([])
    }
  }

  const handleWorkspaceSelect = (selected: Workspace | Folder) => {
    setSelectedParent(selected)
    setStep("upload")
  }

  const simulateFileProgress = () => {
    const interval = setInterval(() => {
      setFileUploadStatuses(prev => {
        const allComplete = prev.every(status => status.progress >= 100)
        if (allComplete) {
          clearInterval(interval)
          return prev
        }
        
        return prev.map(status => {
          if (status.progress < 100 && status.uploading && !status.error) {
            const increment = Math.random() * 15 // Random progress increment
            const newProgress = Math.min(status.progress + increment, 95)
            return { ...status, progress: newProgress }
          }
          return status
        })
      })
    }, 300)
    
    return interval
  }

  const handleUpload = async () => {
    const parent = currentParent ?? selectedParent
    if (selectedFiles.length === 0 || !parent || !session) return

    try {
      setIsUploading(true)
      
      setFileUploadStatuses(prev => 
        prev.map(status => ({ ...status, uploading: true, progress: 5 }))
      )
      const progressInterval = simulateFileProgress()
      const filePayloads = await Promise.all(selectedFiles.map(async (file) => {
        const arrayBuffer = await file.arrayBuffer()
        const uint8Array = new Uint8Array(arrayBuffer)

        return {
          fileName: file.name,
          fileSize: file.size.toString(),
          fileType: file.type,
          fileBuffer: uint8Array,
          image: null,
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
      
      setFileUploadStatuses(prev => 
        prev.map(status => ({ ...status, progress: 100, uploading: false }))
      )
      
      clearInterval(progressInterval)
      
      setTimeout(() => {
        handleClose()
      }, 500)
      
    } catch (error) {
      console.error("File upload failed:", error)
      setIsUploading(false)
    }
  }

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
    setFileUploadStatuses(prev => prev.filter((_, i) => i !== index))
  }

  const resetState = () => {
    setSelectedFiles([])
    setFileUploadStatuses([])
    setIsUploading(false)
  }

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
      const fileArray = Array.from(files)
      setSelectedFiles(fileArray)
      
      setFileUploadStatuses(fileArray.map(file => ({
        file: file as unknown as FileUploadStatus['file'],
        progress: 0,
        uploading: false,
        error: false,
        fileSize: formatFileSize(file.size)
      })))
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
          <Button variant="ghost" size="icon" onClick={handleClose} disabled={isUploading}>
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
            <FileDropZone
              isDragging={isDragging}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              fileInputRef={fileInputRef}
              handleFileChange={handleFileChange}
            />
            
            <FileList 
              fileUploadStatuses={fileUploadStatuses}
              isUploading={isUploading}
              removeFile={removeFile}
            />
            
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Only support docx, doc, PDF and CSV file.</p>
              
              <LocationDisplay selectedParent={selectedParent} />
            </div>
          </div>
        )}
        
        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={handleClose} disabled={isUploading}>
            Cancel
          </Button>
          {step === "upload" && (
            <Button
              onClick={handleUpload}
              disabled={selectedFiles.length === 0 || !(currentParent ?? selectedParent) || isUploading}
              className="bg-black hover:bg-gray-700"
            >
              {isUploading ? "Uploading..." : "Upload"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

