"use client"

import * as React from "react"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "~/components/ui/dialog"
import { Input } from "~/components/ui/input"
import { Button } from "~/components/ui/button"
import { Label } from "~/components/ui/label"
import { WorkspaceSelector } from "./workspace-selector-dialog"
import { FolderPlus, ArrowLeft } from "lucide-react"
import { useEffect, useRef, useState, type ChangeEvent } from "react"
import { type Folder, type Workspace } from "@prisma/client"
import { api } from "~/trpc/react"

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
  const utils = api.useUtils();

  const createFolderMutation = api.folder.createNewFolder.useMutation({
    onMutate: () => {
      void utils.workspace.listWorkspaceByUserId.cancel();

      const previousWorkspaces = utils.workspace.listWorkspaceByUserId.getData();

      utils.workspace.listWorkspaceByUserId.setData(undefined, (prev) => {
        if (!prev) return prev;

        if (!selectedParent) return prev;

        const parentWorkspaceId = 'workspaceId' in selectedParent ? selectedParent.workspaceId : selectedParent.id;

        return prev.map(workspace => {
          if (workspace.id === parentWorkspaceId) {
            return {
              ...workspace,
              folders: [...workspace.folders, {
                id: "new-folder",
                name: folderName,
                workspaceId: parentWorkspaceId,
                workspaceName: workspace.name,
                itemType: "folder",
                hasSubfolders: false,
                size: 0,
                parentFolderId: 'workspaceId' in selectedParent ? selectedParent.id : null,
                createdAt: new Date(),
                updatedAt: new Date()
              }]
            };
          }
          return workspace;
        });
      });

      return {
        previousWorkspaces
      }
    },
    onSuccess: () => {
      void utils.workspace.listWorkspaceByUserId.invalidate();
    },
    onError: (error, variables, context) => {
      utils.workspace.listWorkspaceByUserId.setData(undefined, context?.previousWorkspaces);
    }
  });

  useEffect(() => {
    if (open) {
      setStep("workspace")
      setSelectedParent(null)
      setFolderName("")
    }
  }, [open])

  useEffect(() => {
    if (step === "folder" && inputRef.current) {
      inputRef.current.focus()
    }
  }, [step])

  const handleWorkspaceSelect = (selectedWorkspace: Workspace | Folder) => {
    setSelectedParent(selectedWorkspace)
    setStep("folder")
  }

  const handleCreate = () => {
    if (selectedParent && folderName.trim()) {
      onClose();

      const workspaceId = 'workspaceId' in selectedParent ? selectedParent.workspaceId : selectedParent.id;
      const workspaceName = 'workspaceId' in selectedParent ? selectedParent.workspaceName : selectedParent.name

      const uploadPayload: {
        workspaceId: string;
        workspaceName: string;
        name: string;
        parentsFolderId?: string
      } = {
        workspaceId: workspaceId,
        workspaceName: workspaceName,
        name: folderName
      };

      // This is a folder
      if ('workspaceId' in selectedParent) {
        console.log("This is folder: ", selectedParent);
        uploadPayload.parentsFolderId = selectedParent.id;
      }

      const newFolderId = createFolderMutation.mutateAsync(uploadPayload);

      console.log("Creating folder:", newFolderId, "in workspace:", selectedParent.name)
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
              Creating folder in: {selectedParent?.name}
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

