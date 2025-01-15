import { ChevronRight, ChevronDown } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"
import { Button } from "~/components/ui/button"
import Link from "next/link"

interface BreadcrumbItem {
  label: string
  href: string
  current?: boolean
}

interface FolderBreadcrumbProps {
  items: BreadcrumbItem[]
}

export function FolderBreadcrumb({ items }: FolderBreadcrumbProps) {
  return (
    <nav className="flex items-center space-x-1 text-lg">
      {items.map((item, index) => (
        <div key={item.href} className="flex items-center">
          {index > 0 && <ChevronRight className="h-4 w-4 mx-2 text-muted-foreground" />}
          {item.current ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="px-2 font-medium hover:bg-accent"
                >
                  {item.label}
                  <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  Rename folder
                </DropdownMenuItem>
                <DropdownMenuItem>
                  Move to
                </DropdownMenuItem>
                <DropdownMenuItem>
                  Add shortcut to Drive
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link
              href={item.href}
              className="transition-colors"
            >
              {item.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  )
}

