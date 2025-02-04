'use client'

import { SuggestedSection } from "~/components/dashboard/suggested-section"
import { Plus } from "lucide-react"
import { Button } from "~/components/ui/button"
import { NewItemDialog } from "~/components/dashboard/new-item-diaplog"
import { useSession } from "next-auth/react"
import { api } from "~/trpc/react"
import { useEffect, useState } from 'react'
import { useChatProvider } from "~/components/chat-section/chat-store"

export default function Page() {
  const { data: session } = useSession();
  const { data: fetchedFiles, isLoading: loadingFiles, error: errorFiles } = api.file.listFileByUserId.useQuery(
    { userId: session?.user.id ?? "" }
  );
  const { data: fetchedFolders, isLoading: loadingFolders, error: errorFolders } = api.folder.listFolderByUserId.useQuery(
    { userId: session?.user.id ?? "" }
  );
  const { data: fetchedWorkspaces, isLoading: loadingWorkspaces, error: errorWorkspaces } = api.workspace.listWorkspaceByUserId.useQuery(
    { userId: session?.user.id ?? "" }
  );

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const {
    toggleOpen
  } = useChatProvider();

  useEffect(() => {
    if (loadingFiles || loadingFolders || loadingWorkspaces) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
      if (errorFiles || errorFolders || errorWorkspaces) {
        setError(errorFiles?.message ?? errorFolders?.message ?? errorWorkspaces?.message ?? null);
      } else {
        setError(null);
      }
    }
  }, [loadingFiles, loadingFolders, loadingWorkspaces, errorFiles, errorFolders, errorWorkspaces]);
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Welcome to Promptify Dashboard</h1>
        <NewItemDialog>
          <Button variant="outline" className="gap-2 rounded-full">
            <Plus className="h-4 w-4" />
            New
          </Button>
        </NewItemDialog>
      </div>

      <SuggestedSection title="Suggested workspaces" type="workspaces" workspaces={fetchedWorkspaces} />
      <SuggestedSection title="Suggested folders" type="folders" folders={fetchedFolders} />
      <SuggestedSection title="Suggested files" type="files" files={fetchedFiles} />
    </div>
  )
}

