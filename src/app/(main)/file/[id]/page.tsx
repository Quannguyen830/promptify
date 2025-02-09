"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Slider } from "~/components/ui/slider"
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCw, Download, Printer, Share2 } from "lucide-react"
import { ApiResponse } from "~/constants/interfaces"

export default function PDFViewer() {
  const { id } = useParams<{ id: string }>();
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1) // This would be set when the PDF is loaded
  const [zoom, setZoom] = useState(100)
  const [content, setContent] = useState("PDF Content")

  // These functions would be implemented to interact with a PDF rendering library
  const goToNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages))
  const goToPrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1))
  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 10, 200))
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 10, 50))
  const handleRotate = () => console.log("Rotate PDF")
  const handleDownload = () => console.log("Download PDF")
  const handlePrint = () => console.log("Print PDF")
  const handleShare = () => console.log("Share PDF")

  useEffect(() => {
    const fetchFile = async () => {
      if (id) {
        const response = await fetch(`/api/get-file-from-s3?id=${id}`);
        if (response.ok) {
          const data = await response.json() as ApiResponse;
          console.log("Data: ", data.body);
          setContent(data.body);
        } else {
          console.error("Failed to fetch file:", response.statusText);
        }
      }
    };

    fetchFile()
      .catch((e) => {
        console.log(e);
      })
  }, [id])

  return (
    <div className="flex flex-col h-screen">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 pb-4 border-b">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" onClick={goToPrevPage} disabled={currentPage === 1}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center">
            <Input
              type="number"
              value={currentPage}
              onChange={(e) => setCurrentPage(Number(e.target.value))}
              className="w-16 text-center"
            />
            <span className="mx-2">of {totalPages}</span>
          </div>
          <Button variant="ghost" size="icon" onClick={goToNextPage} disabled={currentPage === totalPages}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" onClick={handleZoomOut}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Slider
            value={[zoom]}
            // onValueChange={(value) => setZoom(value[0])}
            min={50}
            max={200}
            step={10}
            className="w-32"
          />
          <Button variant="ghost" size="icon" onClick={handleZoomIn}>
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleRotate}>
            <RotateCw className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleDownload}>
            <Download className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={handlePrint}>
            <Printer className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleShare}>
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* PDF Viewer */}
      <div className="flex-1 overflow-auto bg-gray-100 flex items-center justify-center rounded-xl my-5">
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
          <div className="w-full h-full p-5 flex items-center justify-center text-gray-400 overflow-auto">
            <div className="whitespace-pre-wrap max-h-full overflow-auto">{content}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

