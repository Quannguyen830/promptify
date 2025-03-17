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
import { useRouter } from "next/navigation";

interface NewFolderDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onClose: () => void
}

export function NewWorkspaceDialog({ open, onOpenChange, onClose }: NewFolderDialogProps) {
  const { data: session } = useSession();
  const utils = api.useUtils();
  const [workspaceName, setWorkspaceName] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter();

  const createNewWorkspace = api.workspace.createNewWorkspace.useMutation({
    onMutate: () => {
      void utils.workspace.listWorkspaceByUserId.cancel();

      const previousWorkspaces = utils.workspace.listWorkspaceByUserId.getData();

      void utils.workspace.listWorkspaceByUserId.setData(undefined, (prev) => {
        if (!prev) return prev;

        return [...prev, {
          id: "new-workspace",
          name: workspaceName,
          userId: session?.user.id ?? "",
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
    },
    onError: (error, variables, context) => {
      utils.workspace.listWorkspaceByUserId.setData(undefined, context?.previousWorkspaces);
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
        if (session != null) {
          onClose();

          const newWorkspaceId = await createNewWorkspace.mutateAsync({
            userId: session.user.id,
            workspaceName: workspaceName
          });

          router.push(`/workspace/${newWorkspaceId}`);
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

