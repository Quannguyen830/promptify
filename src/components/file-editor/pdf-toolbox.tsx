import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Slider } from "~/components/ui/slider"
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCw, Download, Printer, Share2 } from "lucide-react"

interface PDFToolbarProps {
  currentPage: number
  totalPages: number
  zoom: number
  onPageChange: (page: number) => void
  onZoomChange: (zoom: number[]) => void
  onZoomIn: () => void
  onZoomOut: () => void
  onRotate: () => void
  onDownload: () => void
  onPrint: () => void
  onShare: () => void
}

export function PDFToolbar({
  currentPage = 1,
  totalPages = 1,
  zoom,
  onPageChange,
  onZoomChange,
  onZoomIn,
  onZoomOut,
  onRotate,
  onDownload,
  onPrint,
  onShare,
}: PDFToolbarProps) {
  return (
    <div className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="flex items-center">
          <Input
            type="number"
            value={currentPage}
            onChange={(e) => onPageChange(Number(e.target.value))}
            className="w-16 text-center"
          />
          <span className="mx-2">of {totalPages}</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="icon" onClick={onZoomOut}>
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Slider value={[zoom]} onValueChange={onZoomChange} min={50} max={200} step={10} className="w-32" />
        <Button variant="ghost" size="icon" onClick={onZoomIn}>
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={onRotate}>
          <RotateCw className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={onDownload}>
          <Download className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={onPrint}>
          <Printer className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={onShare}>
          <Share2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

