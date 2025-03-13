"use client"

import * as React from "react"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "~/components/ui/dialog"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { ScrollArea } from "~/components/ui/scroll-area"
import { ArrowRight, ChevronRight, FileIcon, Folder as FolderIcon, FolderOpen, Search, Upload } from "lucide-react"
import { useState, useEffect, Fragment } from "react"
import { api } from "~/trpc/react"
import type { File, Folder } from "@prisma/client"
import { type FolderHistoryItem, MyDrive, type FolderWithRelations, type WorkspaceWithRelations } from "~/constants/interfaces"
import { useRouter } from "next/navigation";

interface SelectFileDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onClose: () => void
}

export function SelectFileDialog({ open, onOpenChange, onClose }: SelectFileDialogProps) {
  const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined)
  const [searchQuery, setSearchQuery] = useState("")
  const [workspaceOrFolderList, setWorkspaceOrFolderList] = useState<FolderWithRelations[] | WorkspaceWithRelations[]>([]);
  const [allFolders, setAllFolders] = useState<Folder[]>([])
  const [folderHistory, setFolderHistory] = useState<FolderHistoryItem[]>([MyDrive]);
  const [currentFiles, setCurrentFiles] = useState<File[]>([]);
  const router = useRouter();

  const { data: workspaces } = api.workspace.listWorkspaceByUserId.useQuery();

  useEffect(() => {
    setWorkspaceOrFolderList(workspaces ?? []);
    if (workspaces) {
      setAllFolders(workspaces.flatMap(workspace => workspace.folders));
    }
  }, [workspaces]);

  const handleOpen = () => {
    if (selectedFile) {
      router.push(`/file/${selectedFile.id}`);
    }
  }

  const handleNextButtonClick = (workspaceOrFolder: WorkspaceWithRelations | FolderWithRelations) => {
    if ('workspaceId' in workspaceOrFolder) {
      // This is a folder
      const subfolders = allFolders.filter(folder => folder.parentFolderId === workspaceOrFolder.id);
      const filesInFolder = workspaceOrFolder.files;

      setWorkspaceOrFolderList(subfolders as FolderWithRelations[]);
      setCurrentFiles(filesInFolder ?? []);
    } else if ('folders' in workspaceOrFolder) {
      const folders = workspaceOrFolder.folders;
      const rootFolders = folders.filter(folder =>
        folder.parentFolderId === null &&
        folder.workspaceId === workspaceOrFolder.id
      );

      const rootFiles = workspaceOrFolder.files.filter(file => !file.folderId);

      setWorkspaceOrFolderList(rootFolders as FolderWithRelations[]);
      setCurrentFiles(rootFiles);
    }

    setFolderHistory((prev) => [...prev, workspaceOrFolder]);
  }

  const handleBreadcrumbClick = (index: number) => {
    if (index === 0) {
      setWorkspaceOrFolderList(workspaces ?? []);
      setFolderHistory([MyDrive]);
      setCurrentFiles([]);
    } else {
      const selectedItem = folderHistory[index] as WorkspaceWithRelations | FolderWithRelations;

      if ('workspaceId' in selectedItem) {
        // This is a folder
        const subfolders = allFolders.filter(folder => folder.parentFolderId === selectedItem.id);
        setWorkspaceOrFolderList(subfolders as FolderWithRelations[]);
        const filesInFolder = selectedItem.files;
        setCurrentFiles(filesInFolder ?? []);
      } else if ('folders' in selectedItem) {
        const folders = selectedItem.folders;
        const rootFolders = folders.filter(folder =>
          folder.parentFolderId === null &&
          folder.workspaceId === selectedItem.id
        );
        const rootFiles = selectedItem.files.filter(file => !file.folderId);

        setWorkspaceOrFolderList(rootFolders as FolderWithRelations[]);
        setCurrentFiles(rootFiles);
      }
    }

    setFolderHistory(folderHistory.slice(0, index + 1));
  };

  const resetState = () => {
    setSelectedFile(undefined);
    setSearchQuery("");
    setWorkspaceOrFolderList(workspaces ?? []);
    setFolderHistory([MyDrive]);
    setCurrentFiles([]);
  };

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
            Select a file to open
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
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

            {/* Modified Folder and File List */}
            <ScrollArea className="h-[300px] border rounded-md">
              <div className="p-4 space-y-2">
                {/* Folders */}
                {workspaceOrFolderList.map((workspaceOrFolder) => (
                  <button
                    key={workspaceOrFolder.id}
                    onClick={() => handleNextButtonClick(workspaceOrFolder)}
                    className={`w-full flex items-center gap-2 p-2 rounded-md hover:bg-accent text-left`}
                  >
                    <FolderIcon className="h-4 w-4" />
                    <span className="flex-1">{workspaceOrFolder.name}</span>
                    {('files' in workspaceOrFolder && workspaceOrFolder.files.length > 0) &&
                      <ChevronRight className="h-4 w-4" />}
                  </button>
                ))}

                {/* Files */}
                {currentFiles.map((file) => (
                  <button
                    key={file.id}
                    onClick={() => setSelectedFile(file)}
                    className={`w-full flex items-center gap-2 p-2 rounded-md hover:bg-accent text-left ${selectedFile?.id === file.id ? 'bg-accent' : ''
                      }`}
                  >
                    <FileIcon className="h-4 w-4" />
                    <span className="flex-1">{file.name}</span>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Selected Path Display */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <ArrowRight className="h-4 w-4" />
            Files will be opened in: {selectedFile ? selectedFile.name : "No file selected"}
          </div>
        </div>

        <DialogFooter>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={handleClose}>
              Cancel
            </Button>
            <Button onClick={handleOpen} disabled={!selectedFile} className="gap-2">
              <FolderOpen className="h-4 w-4" />
              Open
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

