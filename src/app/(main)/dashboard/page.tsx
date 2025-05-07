'use client'

import { SuggestedSection } from "~/components/dashboard/suggested-section"
import { api } from "~/trpc/react"
import { useEffect } from 'react'
import { useDashboardStore } from "~/components/dashboard/dashboard-store"
import { Navbar } from "~/components/dashboard/navbar"
import Loading from "~/components/share/loading-spinner"
import { SlidingTab } from "~/components/dashboard/sliding-tab"
import { Toolbox } from "~/components/dashboard/toolbox"
import { Tabs, TabsContent } from "~/components/ui/tabs"

export default function Page() {
  const { resetHistory, addFile, addFolder, resetCurrentParent, addWorkspace } = useDashboardStore();

  const { data: fetchedWorkspaces, isLoading, error } = api.workspace.listWorkspaceByUserId.useQuery(undefined, {
    refetchOnMount: true
  });

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

      if (fetchedWorkspaces?.length) {
        fetchedWorkspaces.forEach(workspace => {
          addWorkspace(workspace);
        });
      }
    }
  }, [fetchedWorkspaces]);

  if (isLoading) return <Loading className="w-full" />;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="px-6 w-full h-screen flex flex-col">
      <Navbar />

      <div className="flex-1 overflow-y-auto py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-semibold mb-5">Dashboard</h1>
        </div>

        <Tabs defaultValue="workspaces" className="w-full">
          <div className="flex items-center border-b border-gray-200 justify-between">
            <SlidingTab />
            <Toolbox />
          </div>

          <TabsContent value="workspaces" className="mt-6">
            <SuggestedSection
              title="Suggested workspaces"
              type="workspaces"
              workspaces={fetchedWorkspaces}
            />
          </TabsContent>

          <TabsContent value="task">
            <div className="flex flex-col items-center justify-center mt-32">
              <p className="text-muted-foreground text-center mb-4">
                No tasks available.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="document">
            <div className="flex flex-col items-center justify-center mt-32">
              <p className="text-muted-foreground text-center mb-4">
                No documents available.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

