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
import { useSession } from "next-auth/react"
import { api } from "~/trpc/react"
import { useRef, useState, useEffect } from "react"

interface NewFolderDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onClose: () => void
}

export function NewWorkspaceDialog({ open, onOpenChange, onClose }: NewFolderDialogProps) {
  const { data: session } = useSession();

  const [workspaceName, setWorkspaceName] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  const createNewWorkspace = api.workspace.createNewWorkspace.useMutation();

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
        if (session != null) {
          const newWorkspaceId = await createNewWorkspace.mutateAsync({
            userId: session.user.id,
            workspaceName: workspaceName
          });

          console.log("New workspace created: ", newWorkspaceId);
        }
      } catch (error) {
        console.log("File upload failed:", error)
      }
      onClose()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[320px]">
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

