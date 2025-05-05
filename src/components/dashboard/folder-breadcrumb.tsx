import { ChevronRight, ChevronDown } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"
import { Button } from "~/components/ui/button"
import Link from "next/link"
import { useDashboardStore } from "~/components/dashboard/dashboard-store"

export interface BreadcrumbItem {
  id: string
  label: string
  href: string
  current?: boolean
  isFolder: boolean
}

interface FolderBreadcrumbProps {
  items: BreadcrumbItem[],
}

export function FolderBreadcrumb({ items }: FolderBreadcrumbProps) {
  const { addItemsHistory, resetHistory, history } = useDashboardStore()

  const handleClick = (href: string) => {
    const clickedItem = items.find(item => item.href === href)
    if (clickedItem) {
      const index = history.findIndex(item => item.href === clickedItem.href);
      if (index !== -1) {
        const newHistory = history.slice(0, index + 1);
        resetHistory();
        newHistory.forEach(item => addItemsHistory(item));
      }
    }
  }

  return (
    <nav className="flex items-center text-sm text-muted-foreground">
      {items.map((item, index) => (
        <div key={item.href} className="flex items-center">
          {index > 0 && (
            <ChevronRight className="h-4 w-4 mx-1 flex-shrink-0" />
          )}
          {item.current ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="px-2 py-1 h-auto font-medium text-sm hover:bg-transparent hover:text-foreground"
                >
                  {item.label}
                  <ChevronDown className="ml-1 h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem>
                  Rename
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
              className="pr-2 py-1 rounded-sm hover:text-foreground transition-colors"
              onClick={() => handleClick(item.href)}
            >
              {item.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  )
}

