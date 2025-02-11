'use client'

import { SuggestedSection } from "~/components/dashboard/suggested-section"
import { useSession } from "next-auth/react"
import { api } from "~/trpc/react"
import { useEffect, useState } from 'react'
import { GuestUser } from "~/constants/interfaces"
import { useDashboardStore } from "~/components/dashboard/dashboard-store"
import { Navbar } from "~/components/dashboard/navbar"
import Loading from "~/components/share/loading-spinner"

export default function Page() {
  const { data: session } = useSession();
  const { resetHistory } = useDashboardStore();

  const { data: fetchedFiles, isLoading: loadingFiles, error: errorFiles } = api.file.listFileByUserId.useQuery();
  const { data: fetchedFolders, isLoading: loadingFolders, error: errorFolders } = api.folder.listFolderByUserId.useQuery();
  const { data: fetchedWorkspaces, isLoading: loadingWorkspaces, error: errorWorkspaces } = api.workspace.listWorkspaceByUserId.useQuery();

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

  if (isLoading) return <Loading />;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <Navbar />

      <div className="flex items-center justify-between mt-5">
        <h1 className="text-2xl font-semibold mb-5">Welcome to Promptify Dashboard</h1>
      </div>

      <SuggestedSection title="Suggested workspaces" type="workspaces" workspaces={fetchedWorkspaces} />
      <SuggestedSection title="Suggested folders" type="folders" folders={fetchedFolders} />
      <SuggestedSection title="Suggested files" type="files" files={fetchedFiles} />
    </div>
  )
}

