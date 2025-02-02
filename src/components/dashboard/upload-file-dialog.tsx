"use client"

import * as React from "react"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "~/components/ui/dialog"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { ScrollArea } from "~/components/ui/scroll-area"
import { ChevronRight, Folder as FolderIcon, Search, Upload } from "lucide-react"
import { type ChangeEvent, useState, useRef, useEffect } from "react"
import { useSession } from "next-auth/react"
import { api } from "~/trpc/react"
import { type Folder, type Workspace } from "@prisma/client"

interface UploadFileDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onClose: () => void
}

export function UploadFileDialog({ open, onOpenChange, onClose }: UploadFileDialogProps) {
  const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFolder, setSelectedFolder] = useState<Folder | Workspace>();
  const [workspaceOrFolderList, setWorkspaceOrFolderList] = useState<Folder[] | Workspace[]>([]);
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { data: session } = useSession();

  const { data: workspaces } = api.workspace.listWorkspaceByUserId.useQuery({
    userId: session?.user.id ?? ""
  });

  const { data: folders } = api.folder.listFolderByWorkspaceId.useQuery(
    { workspaceId: currentFolderId! },
    { enabled: !!currentFolderId }
  );

  useEffect(() => {
    setWorkspaceOrFolderList(workspaces ?? []);
  }, [workspaces]);

  useEffect(() => {
    if (folders) {
      setWorkspaceOrFolderList(folders);
    }
  }, [folders]);

  // const [folderHistory, setFolderHistory] = useState<FolderType[]>([mockFolders[0]])

  const uploadFileMutation = api.file.uploadFile.useMutation();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    } else {
      setSelectedFile(undefined);
    }
  }

  const handleFolderClick = (workspaceOrFolder: Workspace | Folder) => {
    setSelectedFolder(workspaceOrFolder)

    // This is a folder
    if ('workspaceId' in workspaceOrFolder) {
      setCurrentFolderId(workspaceOrFolder.id); // Set the current folder ID
    }
    // This is a workspace 
    else {
      setCurrentFolderId(workspaceOrFolder.id); // Set the current workspace ID
    }

    // setFolderHistory((prev) => [...prev, folder])
  }

  // const handleBackClick = () => {
  //   if (folderHistory.length > 1) {
  //     const newHistory = folderHistory.slice(0, -1)
  //     setFolderHistory(newHistory)
  //     setSelectedWorkspace(newHistory[newHistory.length - 1])
  //   }
  // }

  const handleUpload = async () => {
    if (selectedFile && selectedFolder) {
      try {
        if (session !== null) {
          console.log("File: ", selectedFile)
          if (selectedFile) {
            const arrayBuffer = await selectedFile.arrayBuffer();
            const uint8Array = new Uint8Array(arrayBuffer);

            // Determine the workspaceId based on the type of selectedFolder
            const workspaceId = 'workspaceId' in selectedFolder ? selectedFolder.workspaceId : selectedFolder.id;

            const result = await uploadFileMutation.mutateAsync({
              fileName: selectedFile.name,
              fileSize: selectedFile.size.toString(),
              fileType: selectedFile.type,
              fileBuffer: uint8Array,
              workspaceId: workspaceId
            });

            console.log("File uploaded successfully:", result);
            handleClose();
          }
        }
      } catch (error) {
        console.error("File upload failed:", error);
      }
    }
  }

  // Reset state function
  const resetState = () => {
    setSelectedFile(undefined);
    setSearchQuery("");
    setSelectedFolder(undefined);
    setWorkspaceOrFolderList(workspaces ?? []);
    setCurrentFolderId(null);
  };

  // Reset state when the dialog is closed
  const handleClose = () => {
    resetState();
    onClose();
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      handleClose();
    }
    onOpenChange(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload files to Drive
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* File Selection */}
          <div className="space-y-2">
            <Label>Choose files</Label>
            <div className="flex gap-2">
              <Input ref={fileInputRef} type="file" multiple onChange={handleFileChange} className="cursor-pointer" />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Select destination location</Label>

            {/* Breadcrumb Navigation */}
            {/* <div className="flex items-center gap-1 text-sm text-muted-foreground pb-2">
              {folderHistory.map((folder, index) => (
                <Fragment key={folder.id}>
                  {index > 0 && <ChevronRight className="h-4 w-4" />}
                  <button
                    onClick={() => {
                      setFolderHistory(folderHistory.slice(0, index + 1))
                      setSelectedWorkspace(folder)
                    }}
                    className="hover:text-primary transition-colors"
                  >
                    {folder.name}
                  </button>
                </Fragment>
              ))}
            </div> */}

            {/* Folder Search */}
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search folders"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>

            {/* Folder List */}
            <ScrollArea className="h-[200px] border rounded-md">
              <div className="p-4 space-y-2">
                {workspaceOrFolderList.map((workspaceOrFolder) => (
                  <button
                    key={workspaceOrFolder.id}
                    onClick={() => handleFolderClick(workspaceOrFolder)}
                    className={`w-full flex items-center gap-2 p-2 rounded-md hover:bg-accent text-left ${selectedFolder?.id === workspaceOrFolder.id ? 'bg-accent' : ''
                      }`}
                  >
                    <FolderIcon className="h-4 w-4" />
                    <span className="flex-1">{workspaceOrFolder.name}</span>
                    {/* {workspaceOrFolder. && <ChevronRight className="h-4 w-4" />} */}
                  </button>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Selected Path Display */}
          {/* <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <ArrowRight className="h-4 w-4" />
            Files will be uploaded to: {selectedWorkspace.name.join(" > ")}
          </div> */}
        </div>

        <DialogFooter>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={handleClose}>
              Cancel
            </Button>
            <Button onClick={handleUpload} disabled={!selectedFile} className="gap-2">
              <Upload className="h-4 w-4" />
              Upload
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

