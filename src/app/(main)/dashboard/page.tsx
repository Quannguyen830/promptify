'use client'

import { SuggestedSection } from "~/components/dashboard/suggested-section"
import { api } from "~/trpc/react"
import { useEffect, useState } from 'react'
import { useDashboardStore } from "~/components/dashboard/dashboard-store"
import { Navbar } from "~/components/dashboard/navbar"
import Loading from "~/components/share/loading-spinner"
import { type File, type Folder } from "@prisma/client"

export default function Page() {
  const { resetHistory, addFile, addFolder } = useDashboardStore();
  const [fetchedFolders, setFetchedFolders] = useState<Folder[]>([]);
  const [fetchedFiles, setFetchedFiles] = useState<File[]>([]);

  const { data: fetchedWorkspaces, isLoading, error } = api.workspace.listWorkspaceByUserId.useQuery();

  useEffect(() => {
    resetHistory();
  }, [])

  useEffect(() => {
    if (fetchedWorkspaces) {
      const folders = fetchedWorkspaces.flatMap(workspace => workspace.folders);
      const files = fetchedWorkspaces.flatMap(workspace => workspace.files);

      if (files?.length) {
        files.forEach(file => {
          addFile(file);
        });
      }

      if (folders?.length) {
        folders.forEach(folder => {
          addFolder(folder);
        });
      }

      setFetchedFolders(folders);
      setFetchedFiles(files);
    }
  }, [fetchedWorkspaces]);

  if (isLoading) return <Loading />;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="h-screen flex flex-col">
      <Navbar />

      <div className="flex-1 overflow-y-auto p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold mb-5">Welcome to Promptify Dashboard</h1>
        </div>

        <SuggestedSection title="Suggested workspaces" type="workspaces" workspaces={fetchedWorkspaces} />
        <SuggestedSection title="Suggested folders" type="folders" folders={fetchedFolders} />
        <SuggestedSection title="Suggested files" type="files" files={fetchedFiles} />
      </div>
    </div>
  )
}

