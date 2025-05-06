"use client"

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog"
import { Input } from "~/components/ui/input"
import { Button } from "~/components/ui/button"
import { api } from "~/trpc/react"
import { useRef, useState, useEffect } from "react"
import { useToast } from "~/hooks/use-toast"

interface NewFolderDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onClose: () => void
}

export function NewWorkspaceDialog({ open, onOpenChange, onClose }: NewFolderDialogProps) {
  const utils = api.useUtils();
  const [workspaceName, setWorkspaceName] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const createNewWorkspace = api.workspace.createNewWorkspace.useMutation({
    onMutate: (data) => {
      void utils.workspace.listWorkspaceByUserId.cancel();

      const previousWorkspaces = utils.workspace.listWorkspaceByUserId.getData();

      void utils.workspace.listWorkspaceByUserId.setData(undefined, (prev) => {
        if (!prev) return prev;

        return [...prev, {
          id: "new-workspace",
          name: data.workspaceName,
          userId: "temp-user-id",
          files: [],
          folders: [],
          createdAt: new Date(),
          updatedAt: new Date(),
          itemType: "workspace",
          hasSubfolders: false,
          size: 0,
          lastAccessed: null,
          image: null
        }];
      });

      return { previousWorkspaces };
    },
    onSuccess: () => {
      void utils.workspace.listWorkspaceByUserId.invalidate();
      
      toast({
        title: "Workspace created",
        description: `"${workspaceName}" workspace created successfully`,
        variant: "success",
        className: "p-4",
      })
    },
    onError: (error, variables, context) => {
      utils.workspace.listWorkspaceByUserId.setData(undefined, context?.previousWorkspaces);
      
      toast({
        title: "Creation failed",
        description: "There was an error creating your workspace",
        variant: "destructive",
        className: "p-4",
      })
    }
  });

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 0)
    } else {
      setWorkspaceName("")
    }
  }, [open])

  const handleCreate = async () => {
    if (workspaceName.trim()) {
      try {
        onClose();

        await createNewWorkspace.mutateAsync({
          workspaceName: workspaceName
        });
      } catch (error) {
        console.log("File upload failed:", error)
      }
      onClose()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[350px]">
        <DialogHeader>
          <DialogTitle>New workspace</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Input
            ref={inputRef}
            value={workspaceName}
            onChange={(e) => setWorkspaceName(e.target.value)}
            placeholder="Untitled workspace"
            className="border-primary"
            onKeyDown={async (e) => {
              if (e.key === "Enter") await handleCreate()
            }}
          />
        </div>
        <DialogFooter>
          <div className="flex justify-end gap-2">
            <Button
              variant="ghost"
              onClick={onClose}
              className="text-primary font-medium"
            >
              Cancel
            </Button>
            <Button
              onClick={async () => await handleCreate()}
              className="text-primary font-medium"
              variant="ghost"
              disabled={!workspaceName.trim()}
            >
              Create
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

