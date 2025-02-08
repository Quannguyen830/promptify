'use client'

import { SuggestedSection } from "~/components/dashboard/suggested-section"
import { FolderBreadcrumb } from "~/components/dashboard/folder-breadcrumb"
import { useParams } from 'next/navigation'
import { api } from '~/trpc/react'
import { useDashboardStore } from "~/components/dashboard/dashboard-store"
import { useEffect } from 'react'

export default function FolderPage() {
  const { id } = useParams<{ id: string }>();
  const { addItemsHistory, history } = useDashboardStore();

  const { data: fetchFolder, isLoading, error } = api.folder.getFolderContentByFolderId.useQuery(
    { folderId: id }
  );

  useEffect(() => {
    if (fetchFolder) {
      addItemsHistory({
        id: fetchFolder.id,
        label: fetchFolder.name,
        href: `/folder/${fetchFolder.id}`,
      });
    }
  }, [fetchFolder, addItemsHistory]);

  if (!id || Array.isArray(id)) {
    return <div>Error: Invalid folder ID</div>;
  }

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <FolderBreadcrumb
            items={[
              { id: "MyDrive", label: "MyDrive", href: "/dashboard", current: false },
              ...history.map((item, index) => ({
                id: item.id,
                label: item.label,
                href: 'workspaceId' in item ? `/folder/${item.id}` : `/workspace/${item.id}`,
                current: index === history.length - 1
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

