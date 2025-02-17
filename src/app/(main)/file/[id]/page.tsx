"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import mammoth from "mammoth"

import { api } from "~/trpc/react"
import Loading from "~/components/share/loading-spinner"
import { Textarea } from "~/components/ui/textarea"
import { EditToolbar } from "~/components/file-editor/text-editor-toolbox"
import { PDFToolbar } from "~/components/file-editor/pdf-toolbox"
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { paginateContent } from "~/app/helpers/file-pagination-helper"

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

export default function FilePage() {
  const { id } = useParams<{ id: string }>();
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [zoom, setZoom] = useState(100)
  const [pages, setPages] = useState<string[]>([])
  const [currentPageContent, setCurrentPageContent] = useState<string>("PDF Content")
  const [wordContent, setWordContent] = useState<string>("")

  const { data: fetchedFile, isLoading, error } = api.file.getFileByFileId.useQuery({
    fileId: id
  });

  const { mutate: updateFile } = api.file.updateFileByFileId.useMutation();

  useEffect(() => {
    if (fetchedFile?.type === "text/plain" ||
      fetchedFile?.type?.includes('word')) {
      setCurrentPageContent(pages[currentPage - 1] ?? "");
    }
  }, [currentPage, pages, fetchedFile?.type]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  useEffect(() => {
    if (fetchedFile?.type === "text/plain") {
      if (typeof (fetchedFile.body) == "string") {
        const paginatedContent = paginateContent(fetchedFile?.body ?? "No file content");
        setPages(paginatedContent);
        setTotalPages(paginatedContent.length);
        setCurrentPageContent(paginatedContent[0] ?? "");
        setCurrentPage(1);
      }
    } else if (fetchedFile?.type == "application/docx") {
      if (typeof (fetchedFile.body) != "string") {
        console.log("Converting Word document to HTML...");
        mammoth.convertToHtml({ arrayBuffer: fetchedFile.body })
          .then((result) => {
            setWordContent(result.value);
          })
          .catch((error) => {
            console.error("Error converting Word document:", error);
          });
      }
    }
  }, [fetchedFile?.body, fetchedFile?.type])

  const renderToolbar = () => {
    if (fetchedFile?.type === "application/pdf") {
      return (
        <PDFToolbar
          currentPage={currentPage}
          totalPages={totalPages}
          zoom={zoom}
          onPageChange={handlePageChange}
          onZoomChange={(value) => setZoom(value[0] ?? 75)}
          onZoomIn={() => setZoom((prev) => Math.min(prev + 10, 150))}
          onZoomOut={() => setZoom((prev) => Math.max(prev - 10, 50))}
          onRotate={() => console.log("Rotate PDF")}
          onDownload={() => console.log("Download PDF")}
          onPrint={() => console.log("Print PDF")}
          onShare={() => console.log("Share PDF")}
        />
      );
    }

    // For doc, docx, and txt files
    return (
      <EditToolbar
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    );
  };

  const renderContent = () => {
    switch (fetchedFile?.type) {
      case "application/pdf":
        return (
          <Document
            file={fetchedFile.signedUrl}
            onLoadError={(error) => console.error("Error loading PDF:", error)}
            loading={<Loading />}
          >
            <Page
              pageNumber={currentPage}
              scale={zoom / 100}
              loading={<Loading />}
            />
          </Document>
        );

      case "application/msword":
      case "application/docx":
        return (
          <div
            className="w-full h-full p-4 overflow-auto"
            dangerouslySetInnerHTML={{ __html: wordContent }}
            style={{ fontSize: `${zoom}%` }}
          />
        )

      default:
        return (
          <Textarea
            value={currentPageContent}
            onChange={(e) => setCurrentPageContent(e.target.value)}
            className="w-full h-full resize-none border-none focus-visible:ring-0 p-0"
            style={{ fontSize: `${zoom}%` }}
          />
        )
    }
  };

  if (isLoading) return <Loading />;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="flex flex-col h-screen">
      {renderToolbar()}

      {/* Document Viewer */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div
          className="bg-white shadow-lg flex border rounded-2xl p-4"
          style={{
            width: `${8.5 * zoom}px`,
            height: `${11 * zoom}px`,
            transition: "width 0.2s, height 0.2s",
            maxWidth: '95%',
            maxHeight: 'calc(100vh - 140px)',
          }}
        >
          {renderContent()}
        </div>
      </div>
    </div>
  )
}

