/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { SuggestedSection } from "~/components/dashboard/suggested-section"
import { FolderBreadcrumb } from "~/components/dashboard/folder-breadcrumb"
import { useParams } from 'next/navigation'
import { api } from '~/trpc/react'
import { useDashboardStore } from "~/components/dashboard/dashboard-store"
import { useEffect } from 'react'
import { Navbar } from "~/components/dashboard/navbar"
import Loading from "~/components/share/loading-spinner"

export default function FolderPage() {
  const { id } = useParams<{ id: string }>();
  const { addItemsHistory, history, setCurrentParent } = useDashboardStore();

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
    <div className="px-6">
      <Navbar />

      <main className="container mx-auto space-y-6 mt-5">
        <div className="flex items-center justify-between">
          <FolderBreadcrumb
            items={[
              { id: "MyDrive", label: "MyDrive", href: "/dashboard", current: false, isFolder: false },
              ...history.map((item, index) => ({
                id: item.id,
                label: item.label,
                href: item.isFolder ? `/folder/${item.id}` : `/workspace/${item.id}`,
                current: index === history.length - 1,
                isFolder: true
              })),
            ]}
          />
        </div>
        <SuggestedSection title="Folder contents" type="folders" folders={fetchFolder?.subfolders ?? []} />
        <SuggestedSection title="File contents" type="files" files={fetchFolder?.files ?? []} />
      </main>
    </div>
  )
}

