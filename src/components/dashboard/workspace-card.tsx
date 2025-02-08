import { Briefcase, MoreVertical } from "lucide-react"
import Link from "next/link"
import { Button } from "~/components/ui/button"
import { Card } from "~/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "~/components/ui/dropdown-menu"
import { api } from "~/trpc/react"

interface WorkspaceCardProps {
  id: string
  name: string
  date: string
  // type: "personal" | "shared"
}

export function WorkspaceCard({ id, name, date }: WorkspaceCardProps) {
  const { mutate: removeWorkspace } = api.workspace.deleteWorkspaceByWorkspaceId.useMutation();

  const handleRemove = () => {
    removeWorkspace({ workspaceId: id }, {
      onSuccess: () => {
        console.log(`File with ID ${id} removed successfully.`);
      },
      onError: (error) => {
        console.error("Error removing file:", error);
      }
    });
  }
  return (
    <Card className="group relative hover:bg-accent transition-colors">
      <Link href={`/workspace/${id}`} className="block">
        <div className="p-4 flex items-start">
          <div className="mt-1 flex-shrink-0 mr-4">
            <Briefcase />
          </div>
          <div className="flex-1 min-w-0 pr-8">
            <h3 className="text-sm font-medium leading-none truncate mb-1">
              {name}
            </h3>
            <p className="text-sm text-muted-foreground truncate">
              {date}
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
            <DropdownMenuItem onClick={handleRemove}>Remove</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Card>
  )
}
