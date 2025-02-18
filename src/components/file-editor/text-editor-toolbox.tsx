import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, ChevronLeft, ChevronRight } from "lucide-react"

interface EditToolbarProps {
  onBold?: () => void
  onItalic?: () => void
  onUnderline?: () => void
  onAlignLeft?: () => void
  onAlignCenter?: () => void
  onAlignRight?: () => void
  currentPage?: number
  totalPages?: number
  onPageChange?: (page: number) => void
}

export function EditToolbar({
  onBold,
  onItalic,
  onUnderline,
  onAlignLeft,
  onAlignCenter,
  onAlignRight,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
}: EditToolbarProps) {
  return (
    <div className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="icon" onClick={onBold}>
          <Bold className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={onItalic}>
          <Italic className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={onUnderline}>
          <Underline className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onPageChange?.(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="flex items-center">
          <Input
            type="number"
            value={currentPage}
            onChange={(e) => onPageChange?.(Number(e.target.value))}
            className="w-16 text-center"
          />
          <span className="mx-2">of {totalPages}</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onPageChange?.(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="icon" onClick={onAlignLeft}>
          <AlignLeft className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={onAlignCenter}>
          <AlignCenter className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={onAlignRight}>
          <AlignRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

