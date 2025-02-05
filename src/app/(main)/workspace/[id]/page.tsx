'use client'

import { Plus } from 'lucide-react'
import { SuggestedSection } from "~/components/dashboard/suggested-section"
import { Button } from "~/components/ui/button"
import { NewItemDialog } from "~/components/dashboard/new-item-diaplog"
import { FolderBreadcrumb } from "~/components/dashboard/folder-breadcrumb"
import { useParams } from 'next/navigation'
import { api } from '~/trpc/react'

export default function WorkspacePage() {
  const { id } = useParams<{ id: string }>();

  const { data: fetchedWorkspace, isLoading: isLoading, error: error } = api.workspace.getWorkspaceByWorkspaceId.useQuery(
    { workspaceId: id }
  );

  if (!id || Array.isArray(id)) {
    return <div>Error: Invalid workspace ID</div>;
  }

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <FolderBreadcrumb
            items={[
              { label: "My Drive", href: "/dashboard" },
              { label: fetchedWorkspace?.name ?? id, href: `/workspace/${id}`, current: true }
            ]}
          />
          <NewItemDialog>
            <Button variant="outline" className="gap-2 rounded-full">
              <Plus className="h-4 w-4" />
              New
            </Button>
          </NewItemDialog>
        </div>
        <SuggestedSection title="Folder contents" type="folders" folders={fetchedWorkspace?.folders ?? []} />
        <SuggestedSection title="File contents" type="files" files={fetchedWorkspace?.files ?? []} />
      </main>
    </div>
  )
}

