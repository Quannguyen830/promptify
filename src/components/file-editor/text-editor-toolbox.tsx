import { Button } from "~/components/ui/button"
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight } from "lucide-react"

interface EditToolbarProps {
  onBold?: () => void
  onItalic?: () => void
  onUnderline?: () => void
  onAlignLeft?: () => void
  onAlignCenter?: () => void
  onAlignRight?: () => void
}

export function EditToolbar({
  onBold,
  onItalic,
  onUnderline,
  onAlignLeft,
  onAlignCenter,
  onAlignRight,
}: EditToolbarProps) {
  return (
    <div className="flex items-center justify-between p-4">
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

