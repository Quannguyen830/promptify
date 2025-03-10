"use client"

import { useParams } from "next/navigation"

import { api } from "~/trpc/react"
import Loading from "~/components/share/loading-spinner"
import TextEditorPage from "~/components/file-editor/text-editor-page"
import PdfPage from "~/components/file-editor/pdf-page"

export default function FilePage() {
  const { id } = useParams<{ id: string }>();

  const { data: fetchedFile, isLoading, error } = api.file.getFileByFileId.useQuery({
    fileId: id
  });

  if (isLoading) return <Loading />;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="flex flex-col h-screen">
      {
        fetchedFile?.type == "pdf" ? (
          <PdfPage documentLink={fetchedFile.signedUrl} />
        ) : (
          <TextEditorPage documentName={id} />
        )
      }
    </div>
  )
}

