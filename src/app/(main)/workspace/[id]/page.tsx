/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { FolderBreadcrumb } from "~/components/dashboard/folder-breadcrumb"
import { useParams } from 'next/navigation'
import { api } from '~/trpc/react'
import { useDashboardStore } from "~/components/dashboard/dashboard-store"
import { useEffect, useState } from 'react'
import { Navbar } from "~/components/dashboard/navbar"
import Loading from "~/components/share/loading-spinner"
import type { File, Folder } from "@prisma/client"
import { UploadFileDialog } from "~/components/upload/upload-file-dialog"
import { WorkspaceTabContainer } from "~/components/dashboard/workspace-tab-container"
import { NewFolderDialog } from "~/components/upload/new-folder-dialog"

export default function WorkspacePage() {
  const { id } = useParams<{ id: string }>();
  const { addItemsHistory, history, setCurrentParent } = useDashboardStore();
  const [fetchedFiles, setFetchedFiles] = useState<File[]>();
  const [fetchedFolders, setFetchedFolders] = useState<Folder[]>();
  const [isUploadFileOpen, setIsUploadFileOpen] = useState(false);
  const [isFolderCreateOpen, setIsFolderCreateOpen] = useState(false);

  const { data: fetchedWorkspace, isLoading: isLoading, error: error } = api.workspace.getWorkspaceByWorkspaceId.useQuery(
    { workspaceId: id }
  );

  useEffect(() => {
    if (fetchedWorkspace) {
      setCurrentParent(fetchedWorkspace);
    }
  }, [fetchedWorkspace]);

  useEffect(() => {
    if (fetchedWorkspace) {
      setFetchedFiles(fetchedWorkspace.files.filter(file => file.workspaceId === id));
      setFetchedFolders(fetchedWorkspace.folders.filter(folder => folder.workspaceId === id));

      addItemsHistory({
        id: fetchedWorkspace.id,
        label: fetchedWorkspace.name,
        href: `/workspace/${fetchedWorkspace.id}`,
        isFolder: false
      });
    }
  }, [fetchedWorkspace, addItemsHistory]);

  if (!id || Array.isArray(id)) {
    return <div>Error: Invalid workspace ID</div>;
  }

  if (isLoading) return <Loading />;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="px-6 h-full">
      <Navbar />

      <main className="mt-5 h-full">
        <h1 className="text-2xl font-semibold mb-3">{fetchedWorkspace?.name}</h1>

        <div className="mb-6">
          <FolderBreadcrumb
            items={[
              { id: "MyDrive", label: "MyDrive", href: "/dashboard", current: false, isFolder: false },
              ...history.map((item, index) => ({
                id: item.id,
                label: item.label,
                href: `/workspace/${item.id}`,
                current: index === history.length - 1,
                isFolder: false
              })),
            ]}
          />
        </div>

        <WorkspaceTabContainer
          fetchedFiles={fetchedFiles}
          fetchedFolders={fetchedFolders}
          onUploadClick={() => setIsUploadFileOpen(true)}
          onFolderCreateClick={() => setIsFolderCreateOpen(true)}
        />
      </main>

      <UploadFileDialog
        open={isUploadFileOpen}
        onOpenChange={setIsUploadFileOpen}
        onClose={() => setIsUploadFileOpen(false)}
      />

      <NewFolderDialog
        open={isFolderCreateOpen}
        onOpenChange={setIsFolderCreateOpen}
        onClose={() => setIsFolderCreateOpen(false)}
      />
    </div>
  )
}

