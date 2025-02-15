"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { type S3FileResponse } from "~/constants/interfaces"
import { paginateContent } from "~/app/helpers/file-pagination-helper"
import { api } from "~/trpc/react"
import Loading from "~/components/share/loading-spinner"
import { Textarea } from "~/components/ui/textarea"
import { Switch } from "~/components/ui/switch"
import { Label } from "~/components/ui/label"
import { Badge } from "~/components/ui/badge"
import { EditToolbar } from "~/components/file-editor/text-editor-toolbox"
import { PDFToolbar } from "~/components/file-editor/pdf-toolbox"
import { Document, Page, pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

export default function FilePage() {
  const { id } = useParams<{ id: string }>();
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [zoom, setZoom] = useState(100)
  const [isEditable, setIsEditable] = useState(false)
  const [pages, setPages] = useState<string[]>([])
  const [currentPageContent, setCurrentPageContent] = useState<string>("PDF Content")
  const [pdfUrl, setPdfUrl] = useState<string>("");

  const { data: fetchedFile, isLoading, error } = api.file.getFileByFileId.useQuery({
    fileId: id
  });

  const { mutate: updateFile } = api.file.updateFileByFileId.useMutation();

  useEffect(() => {
    const fetchFile = async () => {
      if (id) {
        const response = await fetch(`/api/get-file-from-s3?id=${id}&fileType=${fetchedFile?.type}`);
        if (response.ok) {
          const data = await response.json() as S3FileResponse;
          console.log("Type: ", data.type);

          const pdfDataUrl = `data:application/pdf;base64,${data.body}`;
          setPdfUrl(pdfDataUrl);

          const paginatedContent = paginateContent(data.body);
          setPages(paginatedContent);
          setTotalPages(paginatedContent.length);
          setCurrentPageContent(paginatedContent[0] ?? "");
        } else {
          console.error("Failed to fetch file:", response.statusText);
        }
      }
    };

    fetchFile()
      .catch((e) => {
        console.log(e);
      })
  }, [id, fetchedFile?.type])

  useEffect(() => {
    console.log("Pdf url: ", pdfUrl);
  }, [pdfUrl]);

  useEffect(() => {
    setCurrentPageContent(pages[currentPage - 1] ?? "");
  }, [currentPage, pages])

  // useEffect(() => {
  //   if (!isEditable && currentPageContent) {
  //     const encoder = new TextEncoder();
  //     const fileBuffer = encoder.encode(currentPageContent);
  //     updateFile({ fileId: id, fileBuffer });
  //   }
  // }, [isEditable, currentPageContent, id, updateFile]);

  if (isLoading) return <Loading />;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="flex flex-col h-screen">
      <div className="flex items-center justify-between p-4 border-b">
        <h1 className="text-2xl font-semibold">PDF Viewer</h1>
        <div className="flex items-center gap-4">
          {isEditable && (
            <Badge variant="default" className="bg-yellow-500">
              Editing Mode
            </Badge>
          )}
          <div className="flex items-center space-x-2">
            <Switch id="edit-mode" checked={isEditable} onCheckedChange={setIsEditable} />
            <Label htmlFor="edit-mode">Edit Mode</Label>
          </div>
        </div>
      </div>

      {isEditable ? (
        <EditToolbar />
      ) : (
        <PDFToolbar
          currentPage={currentPage}
          totalPages={totalPages}
          zoom={zoom}
          onPageChange={setCurrentPage}
          onZoomChange={(value) => setZoom(value[0] ?? 1)}
          onZoomIn={() => setZoom((prev) => Math.min(prev + 10, 200))}
          onZoomOut={() => setZoom((prev) => Math.max(prev - 10, 50))}
          onRotate={() => console.log("Rotate PDF")}
          onDownload={() => console.log("Download PDF")}
          onPrint={() => console.log("Print PDF")}
          onShare={() => console.log("Share PDF")}
        />
      )}

      {/* PDF Viewer */}
      <div className="flex-1 flex items-center justify-center rounded-xl my-1">
        <div
          className="bg-white shadow-lg flex flex-col rounded-2xl"
          style={{
            width: `${8.5 * zoom}px`,
            height: `${11 * zoom}px`,
            transition: "width 0.1s, height 0.1s",
            maxHeight: '80vh',
            overflow: 'hidden',
          }}
        >
          <div className="w-full h-full py-5 px-4 flex items-center border border-5 justify-center overflow-auto rounded-2xl">
            {fetchedFile?.type === "application/pdf" ? (
              <Document file={fetchedFile.signedUrl}>
                <Page pageNumber={totalPages} />
              </Document>
            ) : isEditable ? (
              <Textarea
                value={currentPageContent}
                onChange={(e) => setCurrentPageContent(e.target.value)}
                className="w-full h-full resize-none border-none focus-visible:ring-0 p-0"
                style={{ fontSize: `${zoom}%` }}
              />
            ) : (
              <div className="whitespace-pre-wrap max-h-full w-full overflow-auto">
                {currentPageContent}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

