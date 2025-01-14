import { MoreVertical } from 'lucide-react'
import { Card } from "~/components/ui/card"
import { Button } from "~/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"
import { type FolderCardProps } from '~/interface'

export function FolderCard({ title, subtitle, icon }: FolderCardProps) {
  return (
    <Card className="group relative border-0 hover:bg-accent/50 transition-colors">
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
      </div>
    </Card>
  )
}


