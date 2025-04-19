'use client'

import { Tabs, TabsList, TabsTrigger, TabsContent } from "~/components/ui/tabs"
import { SuggestedSection } from "./suggested-section"
import { type File, type Folder } from "@prisma/client"

interface WorkspaceTabContainerProps {
  fetchedFiles?: File[]
  fetchedFolders?: Folder[]
  onUploadClick: () => void
  onFolderCreateClick: () => void
}

export function WorkspaceTabContainer({ fetchedFiles = [], fetchedFolders = [], onUploadClick, onFolderCreateClick }: WorkspaceTabContainerProps) {
  return (
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

      <TabsContent value="all" className="h-full">
        {fetchedFiles && fetchedFiles.length > 0 ? (
          <SuggestedSection title="Files" type="files" files={fetchedFiles} />
        ) : (
          <div className="flex flex-col items-center justify-center mt-32">
            <p className="text-muted-foreground text-center mb-4">This workspace doesn&apos;t have any file.</p>
            <div className="flex gap-2">
              <button className="text-blue-500 hover:underline" onClick={onUploadClick}>Create new file</button>
              <span className="text-muted-foreground">or</span>
              <button className="text-blue-500 hover:underline" onClick={onUploadClick}>Upload your file</button>
              <span className="text-muted-foreground">to get started</span>
            </div>
          </div>
        )}
      </TabsContent>

      <TabsContent value="folders">
        {fetchedFolders && fetchedFolders.length > 0 ? (
          <SuggestedSection title="Folders" type="folders" folders={fetchedFolders} />
        ) : (
          <div className="flex flex-col items-center justify-center mt-32">
            <p className="text-muted-foreground text-center mb-4">This workspace doesn&apos;t have any folder.</p>
            <div className="flex gap-2">
              <button className="text-blue-500 hover:underline" onClick={onFolderCreateClick}>Create new folder</button>
              <span className="text-muted-foreground">to get started</span>
            </div>
          </div>
        )}
      </TabsContent>

      <TabsContent value="docx">
        <SuggestedSection
          title="Files"
          type="files"
          files={fetchedFiles?.filter(file => file.type.includes("doc"))}
        />
      </TabsContent>

      <TabsContent value="pdf">
        <SuggestedSection
          title="Files"
          type="files"
          files={fetchedFiles?.filter(file => file.type.includes("pdf"))}
        />
      </TabsContent>
    </Tabs>
  )
}