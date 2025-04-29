"use client"

import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "~/components/ui/dialog"
import { FolderPlus, Upload, FileUp, Briefcase } from 'lucide-react'
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "~/components/ui/command"
import { DialogTitle } from "@radix-ui/react-dialog"
import { useRef, useState } from 'react';
import { NewFolderDialog } from './new-folder-dialog'
import { NewWorkspaceDialog } from './new-workspace-dialog'
import { UploadFileDialog } from './upload-file-dialog'

interface NewItemDialogProps {
  children: React.ReactNode
}

export function NewItemDialog({ children }: NewItemDialogProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [isNewItemOpen, setIsNewItemOpen] = useState(false)
  const [isUploadFileOpen, setIsUploadFileOpen] = useState(false)
  const [isNewFolderOpen, setIsNewFolderOpen] = useState(false)
  const [isNewWorkspaceOpen, setIsNewWorkspaceOpen] = useState(false)

  const handleNewFolder = async () => {
    setIsNewItemOpen(false)
    setIsNewFolderOpen(true)
  }

  const handleNewWorkspace = async () => {
    setIsNewItemOpen(false)
    setIsNewWorkspaceOpen(true)
  }

  const handleFileUpload = () => {
    setIsNewItemOpen(false);
    setIsUploadFileOpen(true);
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
                {/* New Workspace */}
                <CommandItem onSelect={handleNewWorkspace}
                  className="flex cursor-pointer items-center gap-2 p-3"
                >
                  <Briefcase className="h-4 w-4" />
                  <span className="flex-1">New Workspace</span>
                </CommandItem>

                {/* New Folder */}
                <CommandItem onSelect={handleNewFolder}
                  className="flex cursor-pointer items-center gap-2 p-3"
                >
                  <FolderPlus className="h-4 w-4" />
                  <span className="flex-1">New Folder</span>
                </CommandItem>

                {/* Upload file */}
                <CommandItem onSelect={handleFileUpload}
                  className="flex cursor-pointer items-center gap-2 p-3"
                >
                  <FileUp className="h-4 w-4" />
                  <span className="flex-1">Upload File</span>
                </CommandItem>

                {/* Upload folder */}
                <CommandItem className="flex cursor-pointer items-center gap-2 p-3">
                  <input
                    type="file"
                    // onChange={handleFolderUpload}
                    className="hidden"
                    {...({ webkitdirectory: "true" })}
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 w-full text-left"
                  >
                    <Upload className="h-4 w-4" />
                    <span className="flex-1">Upload Folder</span>
                  </button>
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </DialogContent>
      </Dialog>

      <UploadFileDialog
        open={isUploadFileOpen}
        onOpenChange={setIsUploadFileOpen}
        onClose={() => setIsUploadFileOpen(false)}
      />

      <NewFolderDialog
        open={isNewFolderOpen}
        onOpenChange={setIsNewFolderOpen}
        onClose={() => setIsNewFolderOpen(false)}
      />

      <NewWorkspaceDialog
        open={isNewWorkspaceOpen}
        onOpenChange={setIsNewWorkspaceOpen}
        onClose={() => setIsNewWorkspaceOpen(false)}
      />
    </>
  )
}

