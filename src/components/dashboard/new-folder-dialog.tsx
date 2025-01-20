"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog"
import { Input } from "~/components/ui/input"
import { Button } from "~/components/ui/button"
import { createNewFolder } from "~/services/file-service"
import { useSession } from "next-auth/react"

interface NewFolderDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onClose: () => void
}

export function NewFolderDialog({ open, onOpenChange, onClose }: NewFolderDialogProps) {
  const { data: session } = useSession();

  const [folderName, setFolderName] = React.useState("")
  const inputRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 0)
    } else {
      setFolderName("")
    }
  }, [open])

  const handleCreate = async () => {
    if (folderName.trim()) {
      try {
        if (session != null) {
          await createNewFolder(session, folderName)
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
          <DialogTitle>New folder</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Input
            ref={inputRef}
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
            placeholder="Untitled folder"
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
              disabled={!folderName.trim()}
            >
              Create
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

