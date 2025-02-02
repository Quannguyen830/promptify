"use client"

import * as React from "react"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "~/components/ui/dialog"
import { Input } from "~/components/ui/input"
import { Button } from "~/components/ui/button"
import { Label } from "~/components/ui/label"
import { WorkspaceSelector } from "./workspace-selector-dialog"
import { FolderPlus, ArrowLeft } from "lucide-react"
import { useEffect, useRef, useState, type ChangeEvent } from "react"
import { type Workspace } from "@prisma/client"
import { api } from "~/trpc/react"

interface NewFolderDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onClose: () => void
}

type Step = "workspace" | "folder"

export function NewFolderDialog({ open, onOpenChange, onClose }: NewFolderDialogProps) {
  const [step, setStep] = useState<Step>("workspace")
  const [workspace, setWorkspace] = useState<Workspace | null>(null)
  const [folderName, setFolderName] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  const createFolderMutation = api.folder.createNewFolder.useMutation();

  useEffect(() => {
    if (open) {
      setStep("workspace")
      setWorkspace(null)
      setFolderName("")
    }
  }, [open])

  useEffect(() => {
    if (step === "folder" && inputRef.current) {
      inputRef.current.focus()
    }
  }, [step])

  const handleWorkspaceSelect = (selectedWorkspace: Workspace) => {
    setWorkspace(selectedWorkspace)
    setStep("folder")
  }

  const handleCreate = () => {
    if (workspace && folderName.trim()) {
      const newFolderId = createFolderMutation.mutateAsync({
        workspaceId: workspace.id,
        folderName: folderName
      })

      console.log("Creating folder:", newFolderId, "in workspace:", workspace.name)
      onClose()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {step === "workspace" ? (
              <>
                <FolderPlus className="h-5 w-5" />
                Select Workspace
              </>
            ) : (
              <>
                <FolderPlus className="h-5 w-5" />
                New Folder
              </>
            )}
          </DialogTitle>
        </DialogHeader>
        {step === "workspace" ? (
          <WorkspaceSelector onSelect={handleWorkspaceSelect} />
        ) : (
          <div className="py-4 space-y-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Button variant="ghost" size="sm" className="gap-1"
                onClick={() => setStep("workspace")}
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              Creating folder in: {workspace?.name}
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
        )}
        <DialogFooter>
          {step === "folder" && (
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={handleCreate} disabled={!folderName.trim()}>
                Create
              </Button>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

