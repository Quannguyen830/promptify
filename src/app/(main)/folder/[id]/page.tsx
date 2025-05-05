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

export default function FolderPage() {
  const { id } = useParams<{ id: string }>();
  const { addItemsHistory, history, setCurrentParent } = useDashboardStore();
  const [fetchedFiles, setFetchedFiles] = useState<File[]>();
  const [fetchedFolders, setFetchedFolders] = useState<Folder[]>();
  const [isUploadFileOpen, setIsUploadFileOpen] = useState(false);
  const [isFolderCreateOpen, setIsFolderCreateOpen] = useState(false);

  const { data: fetchFolder, isLoading, error } = api.folder.getFolderContentByFolderId.useQuery(
    { folderId: id }
  );

  useEffect(() => {
    if (fetchFolder) {
      setCurrentParent(fetchFolder);
    }
  }, [fetchFolder]);

  useEffect(() => {
    if (fetchFolder) {
      setFetchedFiles(fetchFolder.files);
      setFetchedFolders(fetchFolder.subfolders);

      addItemsHistory({
        id: fetchFolder.id,
        label: fetchFolder.name,
        href: `/folder/${fetchFolder.id}`,
        isFolder: true
      });
    }
  }, [fetchFolder, addItemsHistory]);

  if (!id || Array.isArray(id)) {
    return <div>Error: Invalid folder ID</div>;
  }

  if (isLoading) return <Loading />;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="px-6 h-full">
      <Navbar />

      <main className="mt-5 h-full">
        <h1 className="text-2xl font-semibold mb-3">{fetchFolder?.name}</h1>

        <div className="mb-6">
          <FolderBreadcrumb
            items={[
              { id: "MyDrive", label: "MyDrive", href: "/dashboard", current: false, isFolder: false },
              ...history.map((item, index) => ({
                id: item.id,
                label: item.label,
                href: item.isFolder ? `/folder/${item.id}` : `/workspace/${item.id}`,
                current: index === history.length - 1,
                isFolder: item.isFolder
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

