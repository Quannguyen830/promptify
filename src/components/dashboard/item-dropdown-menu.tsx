import { MoreVertical } from 'lucide-react'
import { Button } from "~/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"

interface ItemDropdownMenuProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onRename: () => void
  onGetLink: () => void
  onRemove: () => void
  className?: string
}

export function ItemDropdownMenu({
  open,
  onOpenChange,
  onRename,
  onGetLink,
  onRemove,
  className
}: ItemDropdownMenuProps) {
  return (
    <DropdownMenu open={open} onOpenChange={onOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={className || "h-8 w-8"}
        >
          <MoreVertical className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onRename();
        }}>Rename</DropdownMenuItem>
        <DropdownMenuItem onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onGetLink();
        }}>Get link</DropdownMenuItem>
        <DropdownMenuItem 
          className='text-red-500' 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onRemove();
          }}
        >
          Remove
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}