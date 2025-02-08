'use client'

import { SuggestedSection } from "~/components/dashboard/suggested-section"
import { Plus } from "lucide-react"
import { Button } from "~/components/ui/button"
import { NewItemDialog } from "~/components/dashboard/new-item-diaplog"
import { useSession } from "next-auth/react"
import { api } from "~/trpc/react"
import { useEffect, useState } from 'react'
import { GuestUser } from "~/constants/interfaces"

export default function Page() {
  const { data: session } = useSession();
  const { data: fetchedFiles, isLoading: loadingFiles, error: errorFiles, refetch: refetchFiles } = api.file.listFileByUserId.useQuery(
    { userId: session?.user.id ?? GuestUser.id }
  );
  const { data: fetchedFolders, isLoading: loadingFolders, error: errorFolders, refetch: refetchFolders } = api.folder.listFolderByUserId.useQuery(
    { userId: session?.user.id ?? GuestUser.id }
  );
  const { data: fetchedWorkspaces, isLoading: loadingWorkspaces, error: errorWorkspaces, refetch: refetchWorkspaces } = api.workspace.listWorkspaceByUserId.useQuery(
    { userId: session?.user.id ?? GuestUser.id }
  );

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  useEffect(() => {
    const interval = setInterval(() => {
      const fetchData = async () => {
        try {
          // Refetch the queries
          await refetchFiles();
          await refetchFolders();
          await refetchWorkspaces();
        } catch (error) {
          console.error("Error refetching data:", error);
        }
      };

      fetchData()
        .catch((e: Error) => {
          console.log(e);
        })
    }, 5000);

    return () => clearInterval(interval); // Cleanup on unmount
  }, [refetchFiles, refetchFolders, refetchWorkspaces]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold mb-5">Welcome to Promptify Dashboard</h1>
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

