import { Briefcase, MoreVertical } from "lucide-react"
import { Button } from "~/components/ui/button"
import { Card } from "~/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "~/components/ui/dropdown-menu"

interface WorkspaceCardProps {
  id: string
  name: string
  // type: "personal" | "shared"
}

export function WorkspaceCard({ name }: WorkspaceCardProps) {
  return (
    <Card className="group relative hover:bg-accent bg-[#202020] border-0 transition-colors">
      <div className="p-4 flex items-start">
        <div className="mt-1 flex-shrink-0 mr-4">
          <Briefcase className="h-6 w-6" />
        </div>
        <div className="flex-1 min-w-0 pr-8">
          <h3 className="text-sm font-medium leading-none truncate mb-1">{name}</h3>
          <p className="text-sm text-muted-foreground truncate">
            Shared Workspace
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
              <DropdownMenuItem>Open</DropdownMenuItem>
              <DropdownMenuItem>Share</DropdownMenuItem>
              <DropdownMenuItem>Remove from list</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </Card>
  )
}
