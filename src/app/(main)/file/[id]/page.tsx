"use client"

import { useParams } from "next/navigation"

import { api } from "~/trpc/react"
import Loading from "~/components/share/loading-spinner"
import { Textarea } from "~/components/ui/textarea"
import { EditToolbar } from "~/components/file-editor/text-editor-toolbox"
import { PDFToolbar } from "~/components/file-editor/pdf-toolbox"
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { paginateContent } from "~/app/helpers/file-pagination-helper"
import TextEditorPage from "~/components/file-editor/text-editor-page"


export default function FilePage() {
  const { id } = useParams<{ id: string }>();

  const { data: fetchedFile, isLoading, error } = api.file.getFileByFileId.useQuery({
    fileId: id
  });

  const { mutate: updateFile } = api.file.updateFileByFileId.useMutation();

  if (isLoading) return <Loading />;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="flex flex-col h-screen">
      <TextEditorPage documentName={id} />
    </div>
  )
}

