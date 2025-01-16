import { MoreVertical } from 'lucide-react'
import { Card } from "~/components/ui/card"
import { Button } from "~/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"
import Link from "next/link"

interface FolderCardProps {
  id: string
  title: string
  subtitle: string
  icon?: React.ReactNode
}

export function FolderCard({ id, title, subtitle, icon }: FolderCardProps) {
  return (
    <Card className="group relative hover:bg-accent/50 transition-colors">
      <Link href={`/folder/${id}`} className="block">
        <div className="p-4 flex items-start">
          <div className="mt-1 flex-shrink-0 mr-4">
            {icon}
          </div>
          <div className="flex-1 min-w-0 pr-8">
            <h3 className="text-sm font-medium leading-none truncate mb-1">
              {title}
            </h3>
            <p className="text-sm text-muted-foreground truncate">
              {subtitle}
            </p>
          </div>
        </div>
      </Link>
      <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Share</DropdownMenuItem>
            <DropdownMenuItem>Get link</DropdownMenuItem>
            <DropdownMenuItem>Remove</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Card>
  )
}

