"use client"

import * as React from 'react'
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
// import { uploadFileService } from "~/app/services/file-service"
import { useSession } from "next-auth/react"
import { useCallback, useRef } from 'react';
import { NewFolderDialog } from './new-folder-dialog'
import { api } from "~/trpc/react";
import { NewWorkspaceDialog } from './new-workspace-dialog'

interface NewItemDialogProps {
  children: React.ReactNode
}

export function NewItemDialog({ children }: NewItemDialogProps) {
  const { data: session } = useSession();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [isNewItemOpen, setIsNewItemOpen] = React.useState(false)
  const [isNewFolderOpen, setIsNewFolderOpen] = React.useState(false)
  const [isNewWorkspaceOpen, setIsNewWorkspaceOpen] = React.useState(false)

  const uploadFileMutation = api.file.uploadFile.useMutation();

  const handleNewFolder = async () => {
    setIsNewItemOpen(false)
    setIsNewFolderOpen(true)
  }

  const handleNewWorkspace = async () => {
    setIsNewItemOpen(false)
    setIsNewWorkspaceOpen(true)
  }

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (session !== null) {
        const file = event.target.files?.[0];
        console.log("File: ", file)
        if (file) {
          const arrayBuffer = await file.arrayBuffer();
          const uint8Array = new Uint8Array(arrayBuffer);

          const result = await uploadFileMutation.mutateAsync({
            userId: session.user.id,
            fileName: file.name,
            fileSize: file.size.toString(),
            fileType: file.type,
            fileBuffer: uint8Array
          });
          console.log("File uploaded successfully:", result);
        }
      }
    } catch (error) {
      console.error("File upload failed:", error);
    }
  }, [session, uploadFileMutation]);

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
                <CommandItem className="flex cursor-pointer items-center gap-2 p-3">
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
                    <span className="flex-1">Upload File</span>
                  </button>
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

