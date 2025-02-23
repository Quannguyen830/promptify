"use client"

import * as React from "react"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "~/components/ui/dialog"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { ScrollArea } from "~/components/ui/scroll-area"
import { ArrowRight, ChevronRight, Folder as FolderIcon, Search, Upload } from "lucide-react"
import { type ChangeEvent, useState, useRef, useEffect, Fragment } from "react"
import { useSession } from "next-auth/react"
import { api } from "~/trpc/react"
import { type Folder, type Workspace } from "@prisma/client"
import { type FolderHistoryItem, MyDrive } from "~/constants/interfaces"

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
  const [allFolders, setAllFolders] = useState<Folder[]>([])
  const [rootFolders, setRootFolders] = useState<Folder[]>();
  const [childFolders, setChildFolders] = useState<Folder[]>();
  const [folderHistory, setFolderHistory] = useState<FolderHistoryItem[]>([MyDrive]);
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { data: session } = useSession();
  const utils = api.useUtils();

  const { data: workspaces } = api.workspace.listWorkspaceByUserId.useQuery();

  useEffect(() => {
    setWorkspaceOrFolderList(workspaces ?? []);
    if (workspaces) {
      setAllFolders(workspaces.flatMap(workspace => workspace.folders));
    }
  }, [workspaces]);

  useEffect(() => {
    if (rootFolders && rootFolders.length > 0) {
      setWorkspaceOrFolderList(rootFolders);
    }
  }, [rootFolders]);

  useEffect(() => {
    if (childFolders && childFolders.length > 0) {
      setWorkspaceOrFolderList(childFolders);
    }
  }, [childFolders])

  const uploadFileMutation = api.file.uploadFile.useMutation({
    onMutate: () => {
      void utils.workspace.listWorkspaceByUserId.cancel();

      const previousWorkspaces = utils.workspace.listWorkspaceByUserId.getData();

      void utils.workspace.listWorkspaceByUserId.setData(undefined, (prev) => {
        if (!prev) return prev;

        return prev.map(workspace => {
          if (workspace.id === selectedFolder?.id) {
            return {
              ...workspace, files: [...workspace.files, {
                id: "new-file",
                name: selectedFile?.name ?? "",
                size: selectedFile?.size ?? 0,
                type: selectedFile?.type ?? "",
                createdAt: new Date(),
                updatedAt: new Date(),
                itemType: "file",
                workspaceId: workspace.id,
                workspaceName: workspace.name,
                folderId: selectedFolder?.id,
                folderName: selectedFolder?.name
              }]
            };
          }
          return workspace;
        });
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

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    } else {
      setSelectedFile(undefined);
    }
  }

  const handleFolderClick = async (workspaceOrFolder: Workspace | Folder) => {
    setSelectedFolder(workspaceOrFolder);
  };

  const handleNextButtonClick = (workspaceOrFolder: Workspace | Folder) => {
    // This is a folder
    if ('workspaceId' in workspaceOrFolder) {
      const subfolders = allFolders.filter(folder => folder.parentFolderId === workspaceOrFolder.id);
      setChildFolders(subfolders)
    }
    // This is a workspace 
    else if ('folders' in workspaceOrFolder) {
      const folders = workspaceOrFolder.folders as Folder[];
      const filteredRootFolders = folders.filter(folder => folder.parentFolderId === null && folder.workspaceId === workspaceOrFolder.id);
      setRootFolders(filteredRootFolders);
    }

    setFolderHistory((prev) => [...prev, workspaceOrFolder]);
  }

  const handleUpload = async () => {
    if (selectedFile && selectedFolder) {
      try {
        if (session !== null) {
          if (selectedFile) {
            handleClose();

            const arrayBuffer = await selectedFile.arrayBuffer();
            const uint8Array = new Uint8Array(arrayBuffer);

            // Determine the workspaceId based on the type of selectedFolder
            const workspaceId = 'workspaceId' in selectedFolder ? selectedFolder.workspaceId : selectedFolder.id;
            const workspaceName = 'workspaceId' in selectedFolder ? selectedFolder.workspaceName : selectedFolder.name;
            const folderName = 'workspaceId' in selectedFolder ? selectedFolder.name : undefined;

            const uploadPayload = {
              fileName: selectedFile.name,
              fileSize: selectedFile.size.toString(),
              fileType: selectedFile.type,
              fileBuffer: uint8Array,
              workspaceId: workspaceId,
              folderId: selectedFolder.itemType === "folder" ? selectedFolder.id : undefined,
              workspaceName: workspaceName,
              folderName: folderName,
            };

            const result = await uploadFileMutation.mutateAsync(uploadPayload);

            console.log("File uploaded successfully:", result);
          }
        }
      } catch (error) {
        console.error("File upload failed:", error);
      }
    }
  };

  const handleBreadcrumbClick = (index: number) => {
    if (index === 0) {
      setWorkspaceOrFolderList(workspaces ?? []);
      setFolderHistory([MyDrive]);
    } else {
      const selectedItem = folderHistory[index] as Workspace | Folder;
      setSelectedFolder(selectedItem);

      // Check if the selected item is a folder or workspace and set the children accordingly
      if ('workspaceId' in selectedItem) {
        const subfolders = allFolders.filter(folder => folder.parentFolderId === selectedItem.id);
        setWorkspaceOrFolderList(subfolders);
      } else if ('folders' in selectedItem) {
        const folders = selectedItem.folders as Folder[];
        const filteredRootFolders = folders.filter(folder => folder.parentFolderId === null && folder.workspaceId === selectedItem.id);
        setWorkspaceOrFolderList(filteredRootFolders);
      }
    }

    setFolderHistory(folderHistory.slice(0, index + 1));
  };

  // Reset state function
  const resetState = () => {
    setSelectedFile(undefined);
    setSearchQuery("");
    setSelectedFolder(undefined);
    setWorkspaceOrFolderList(workspaces ?? []);
    setFolderHistory([MyDrive]);
  };

  // Reset state when the dialog is closed
  const handleClose = () => {
    resetState();
    onClose();
  };

  const handleDialogOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      handleClose();
    }
    onOpenChange(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogOpenChange}>
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
              <Input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileChange}
                className="cursor-pointer"
                accept=".pdf, .docx"
              />
            </div>
            {/* Add a helper text for file type guidance */}
            <p className="text-sm text-muted-foreground">Allowed file types: PDF, DOCX</p>
          </div>

          <div className="space-y-2">
            <Label>Select destination location</Label>

            {/* Breadcrumb Navigation */}
            <div className="flex items-center gap-1 text-sm text-muted-foreground pb-2">
              {folderHistory.map((folder, index) => (
                <Fragment key={folder.id}>
                  {index > 0 && <ChevronRight className="h-4 w-4" />}
                  <button
                    onClick={() => handleBreadcrumbClick(index)}
                    className="hover:text-primary transition-colors"
                  >
                    {folder.name}
                  </button>
                </Fragment>
              ))}
            </div>

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
                    {workspaceOrFolder.hasSubfolders &&
                      <ChevronRight
                        className="h-4 w-4"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleNextButtonClick(workspaceOrFolder);
                        }}
                      />}
                  </button>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Selected Path Display */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <ArrowRight className="h-4 w-4" />
            Files will be uploaded to: {selectedFolder ? selectedFolder.name : "No folder selected"}
          </div>
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

