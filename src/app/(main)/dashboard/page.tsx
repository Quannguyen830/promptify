'use client'

import { SuggestedSection } from "~/components/dashboard/suggested-section"
import { api } from "~/trpc/react"
import { useEffect } from 'react'
import { useDashboardStore } from "~/components/dashboard/dashboard-store"
import { Navbar } from "~/components/dashboard/navbar"
import Loading from "~/components/share/loading-spinner"
import { SlidingTab } from "~/components/dashboard/sliding-tab"
import { Toolbox } from "~/components/dashboard/toolbox"

export default function Page() {
  const { resetHistory, addFile, addFolder, resetCurrentParent } = useDashboardStore();

  const { data: fetchedWorkspaces, isLoading, error } = api.workspace.listWorkspaceByUserId.useQuery();

  useEffect(() => {
    resetHistory();
    resetCurrentParent();
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
    }
  }, [fetchedWorkspaces]);

  if (isLoading) return <Loading />;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="px-6 h-screen flex flex-col">
      <Navbar />

      <div className="flex-1 overflow-y-auto py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-semibold mb-5">Dashboard</h1>
        </div>

        <div className="flex items-center border-b border-gray-200 justify-between">
          <SlidingTab />
          <Toolbox />
        </div>

        <SuggestedSection title="Suggested workspaces" type="workspaces" workspaces={fetchedWorkspaces} />
      </div>
    </div>
  )
}

