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
import { useRef, useState, useEffect } from "react"
import { Pencil } from "lucide-react"

interface RenameDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (newName: string) => void
  title: string
  currentName: string
  itemType: "workspace" | "folder" | "file"
}

export function RenameDialog({ 
  open, 
  onOpenChange, 
  onConfirm, 
  title, 
  currentName,
  itemType 
}: RenameDialogProps) {
  const [newName, setNewName] = useState(currentName)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      setNewName(currentName)
      setTimeout(() => inputRef.current?.focus(), 0)
    }
  }, [open, currentName])

  const handleRename = async () => {
    if (newName.trim() && newName !== currentName) {
      onConfirm(newName)
    }
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[350px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Pencil className="h-5 w-5" />
            {title}
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Input
            ref={inputRef}
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder={`Untitled ${itemType}`}
            className="border-primary"
            onKeyDown={async (e) => {
              if (e.key === "Enter") await handleRename()
            }}
          />
        </div>
        <DialogFooter>
          <div className="flex justify-end gap-2">
            <Button
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="text-primary font-medium"
            >
              Cancel
            </Button>
            <Button
              onClick={handleRename}
              className="text-primary font-medium"
              variant="ghost"
              disabled={!newName.trim() || newName === currentName}
            >
              Rename
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}