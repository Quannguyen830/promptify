/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { SuggestedSection } from "~/components/dashboard/suggested-section"
import { FolderBreadcrumb } from "~/components/dashboard/folder-breadcrumb"
import { useParams } from 'next/navigation'
import { api } from '~/trpc/react'
import { useDashboardStore } from "~/components/dashboard/dashboard-store"
import { useEffect, useState } from 'react'
import { Navbar } from "~/components/dashboard/navbar"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "~/components/ui/tabs"
import Loading from "~/components/share/loading-spinner"
import type { File, Folder } from "@prisma/client"
import { UploadFileDialog } from "~/components/dashboard/upload-file-dialog"

export default function WorkspacePage() {
  const { id } = useParams<{ id: string }>();
  const { addItemsHistory, history, setCurrentParent } = useDashboardStore();
  const [fetchedFiles, setFetchedFiles] = useState<File[]>();
  const [fetchedFolders, setFetchedFolders] = useState<Folder[]>();
  const [isUploadFileOpen, setIsUploadFileOpen] = useState(false);

  const { data: fetchedWorkspace, isLoading: isLoading, error: error } = api.workspace.getWorkspaceByWorkspaceId.useQuery(
    { workspaceId: id }
  );

  useEffect(() => {
    if (fetchedWorkspace) {
      setCurrentParent(fetchedWorkspace);
    }
  }, [fetchedWorkspace]);

  useEffect(() => {
    if (fetchedWorkspace) {
      setFetchedFiles(fetchedWorkspace.files.filter(file => file.workspaceId === id));
      setFetchedFolders(fetchedWorkspace.folders.filter(folder => folder.workspaceId === id));

      addItemsHistory({
        id: fetchedWorkspace.id,
        label: fetchedWorkspace.name,
        href: `/workspace/${fetchedWorkspace.id}`,
        isFolder: false
      });
    }
  }, [fetchedWorkspace, addItemsHistory]);

  if (!id || Array.isArray(id)) {
    return <div>Error: Invalid workspace ID</div>;
  }

  if (isLoading) return <Loading />;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="px-6 h-full">
      <Navbar />

      <main className="mt-5 h-full">
        <h1 className="text-2xl font-semibold mb-3">{fetchedWorkspace?.name}</h1>

        <div className="mb-6">
          <FolderBreadcrumb
            items={[
              { id: "MyDrive", label: "MyDrive", href: "/dashboard", current: false, isFolder: false },
              ...history.map((item, index) => ({
                id: item.id,
                label: item.label,
                href: `/workspace/${item.id}`,
                current: index === history.length - 1,
                isFolder: false
              })),
            ]}
          />
        </div>

        <Tabs defaultValue="all" className="w-full h-full">
          <TabsList className="border-b w-full justify-start h-auto p-0 bg-transparent">
            <TabsTrigger
              value="all"
              className="px-4 py-2 data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none bg-transparent"
            >
              All Files
            </TabsTrigger>
            <TabsTrigger
              value="folders"
              className="px-4 py-2 data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none bg-transparent"
            >
              Folder
            </TabsTrigger>
            <TabsTrigger
              value="docx"
              className="px-4 py-2 data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none bg-transparent"
            >
              DOCX
            </TabsTrigger>
            <TabsTrigger
              value="pdf"
              className="px-4 py-2 data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none bg-transparent"
            >
              PDF
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6 h-full">
            {fetchedFiles && fetchedFiles.length > 0 ? (
              <SuggestedSection title="Files" type="files" files={fetchedFiles} />
            ) : (
              <div className="flex flex-col items-center justify-center mt-32">
                <p className="text-muted-foreground text-center mb-4">This workspace doesn&apos;t have any file.</p>
                <div className="flex gap-2">
                  <button className="text-blue-500 hover:underline" onClick={() => setIsUploadFileOpen(true)}>Create new file</button>
                  <span className="text-muted-foreground">or</span>
                  <button className="text-blue-500 hover:underline" onClick={() => setIsUploadFileOpen(true)}>Upload your file</button>
                  <span className="text-muted-foreground">to get started</span>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="folders">
            <SuggestedSection title="Folders" type="folders" folders={fetchedFolders} />
          </TabsContent>

          <TabsContent value="docx">
            <SuggestedSection title="Files" type="files" files={fetchedFiles?.filter(file => file.type.includes("doc"))} />
          </TabsContent>

          <TabsContent value="pdf">
            <SuggestedSection title="Files" type="files" files={fetchedFiles?.filter(file => file.type.includes("pdf"))} />
          </TabsContent>
        </Tabs>
      </main>

      <UploadFileDialog
        open={isUploadFileOpen}
        onOpenChange={setIsUploadFileOpen}
        onClose={() => setIsUploadFileOpen(false)}
      />
    </div>
  )
}

