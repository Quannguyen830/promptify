'use client'

import { SuggestedSection } from "~/components/dashboard/suggested-section"
import { useSession } from "next-auth/react"
import { api } from "~/trpc/react"
import { useEffect, useState } from 'react'
import { GuestUser } from "~/constants/interfaces"
import { useDashboardStore } from "~/components/dashboard/dashboard-store"

export default function Page() {
  const { data: session } = useSession();
  const { resetHistory } = useDashboardStore();

  const { data: fetchedFiles, isLoading: loadingFiles, error: errorFiles } = api.file.listFileByUserId.useQuery(
    { userId: session?.user.id ?? GuestUser.id }
  );
  const { data: fetchedFolders, isLoading: loadingFolders, error: errorFolders } = api.folder.listFolderByUserId.useQuery(
    { userId: session?.user.id ?? GuestUser.id }
  );
  const { data: fetchedWorkspaces, isLoading: loadingWorkspaces, error: errorWorkspaces } = api.workspace.listWorkspaceByUserId.useQuery(
    { userId: session?.user.id ?? GuestUser.id }
  );

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    resetHistory();
  }, [resetHistory])

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
        <h1 className="text-2xl font-semibold mb-5">Welcome to Promptify Dashboard</h1>
      </div>

      <SuggestedSection title="Suggested workspaces" type="workspaces" workspaces={fetchedWorkspaces} />
      <SuggestedSection title="Suggested folders" type="folders" folders={fetchedFolders} />
      <SuggestedSection title="Suggested files" type="files" files={fetchedFiles} />
    </div>
  )
}

