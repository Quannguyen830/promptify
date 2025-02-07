'use client'

import { SuggestedSection } from "~/components/dashboard/suggested-section"
import { FolderBreadcrumb } from "~/components/dashboard/folder-breadcrumb"
import { useParams } from 'next/navigation'
import { api } from '~/trpc/react'
import { useDashboardStore } from "~/components/dashboard/dashboard-store"
import { useEffect } from 'react'

export default function WorkspacePage() {
  const { id } = useParams<{ id: string }>();
  const { addItemsHistory, history } = useDashboardStore();

  const { data: fetchedWorkspace, isLoading: isLoading, error: error } = api.workspace.getWorkspaceByWorkspaceId.useQuery(
    { workspaceId: id }
  );

  useEffect(() => {
    if (fetchedWorkspace) {
      addItemsHistory({
        id: fetchedWorkspace.id,
        label: fetchedWorkspace.name,
        href: `/workspace/${fetchedWorkspace.id}`,
      });
    }
  }, [fetchedWorkspace, addItemsHistory]);

  if (!id || Array.isArray(id)) {
    return <div>Error: Invalid workspace ID</div>;
  }

  const fetchedFolders = fetchedWorkspace?.folders.filter(folder => folder.parentFolderId == null)

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
                href: `/workspace/${item.id}`,
                current: index === history.length - 1
              })),
            ]}
          />
        </div>
        <SuggestedSection title="Folder contents" type="folders" folders={fetchedFolders} />
        <SuggestedSection title="File contents" type="files" files={fetchedWorkspace?.files ?? []} />
      </main>
    </div>
  )
}

