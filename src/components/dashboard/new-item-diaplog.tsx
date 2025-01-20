"use client"

import * as React from 'react'
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "~/components/ui/dialog"
import { FolderPlus, Upload, FileUp } from 'lucide-react'
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "~/components/ui/command"
import { DialogTitle } from "@radix-ui/react-dialog"
import { uploadFile } from "~/services/file-service"
import { useSession } from "next-auth/react"
import { useCallback, useRef } from 'react';
import { NewFolderDialog } from './new-folder-dialog'

interface NewItemDialogProps {
  children: React.ReactNode
}

export function NewItemDialog({ children }: NewItemDialogProps) {
  const { data: session } = useSession();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [isNewItemOpen, setIsNewItemOpen] = React.useState(false)
  const [isNewFolderOpen, setIsNewFolderOpen] = React.useState(false)

  const handleNewFolder = async () => {
    setIsNewItemOpen(false)
    setIsNewFolderOpen(true)
  }

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (session !== null) {
        await uploadFile(session, event);
      }
    } catch (error) {
      console.error("File upload failed:", error);
    }
  }, [session]);

  const handleFileUploadClick = () => {
    fileInputRef.current?.click();
  }

  return (
    <>
      <Dialog open={isNewItemOpen} onOpenChange={setIsNewItemOpen}>
        <DialogTrigger asChild>
          {children}
        </DialogTrigger>
        <DialogContent className="p-0 max-w-[320px]">
          <DialogTitle className="sr-only">New Item</DialogTitle>
          <Command>
            <CommandList>
              <CommandGroup>
                {/* New Folder */}
                <CommandItem onSelect={handleNewFolder} className="flex items-center gap-2 p-3">
                  <FolderPlus className="h-4 w-4" />
                  <span className="flex-1">New folder</span>
                </CommandItem>

                {/* Upload file */}
                <CommandItem className="flex items-center gap-2 p-3">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <button
                    onClick={handleFileUploadClick}
                    className="flex items-center gap-2 w-full text-left"
                  >
                    <FileUp className="h-4 w-4" />
                    <span className="flex-1">Upload file</span>
                  </button>
                </CommandItem>

                {/* Upload folder */}
                <CommandItem className="flex items-center gap-2 p-3">
                  <Upload className="h-4 w-4" />
                  <span className="flex-1">Upload folder</span>
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </DialogContent>
      </Dialog>

      <NewFolderDialog
        open={isNewFolderOpen}
        onOpenChange={setIsNewFolderOpen}
        onClose={() => setIsNewFolderOpen(false)}
      />
    </>
  )
}

