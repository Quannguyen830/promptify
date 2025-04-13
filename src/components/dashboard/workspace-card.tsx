import { MoreVertical } from "lucide-react"
import Link from "next/link"
import { Button } from "~/components/ui/button"
import { Card } from "~/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "~/components/ui/dropdown-menu"
import { api } from "~/trpc/react"
import { DeleteWarningDialog } from "./delete-warning-dialog"
import { useState } from "react"

interface WorkspaceCardProps {
  id: string
  name: string
  date: string
  numberOfFiles: number
  // type: "personal" | "shared"
}

export function WorkspaceCard({ id, name, date, numberOfFiles }: WorkspaceCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const utils = api.useUtils();

  const { mutate: removeWorkspace } = api.workspace.deleteWorkspaceByWorkspaceId.useMutation(
    {
      onMutate: () => {
        void utils.workspace.listWorkspaceByUserId.cancel();

        const previousWorkspaces = utils.workspace.listWorkspaceByUserId.getData();

        utils.workspace.listWorkspaceByUserId.setData(undefined, (prev) => {
          if (!prev) return prev;

          return prev.filter((workspace) => workspace.id !== id);
        });

        return { previousWorkspaces };
      },
      onSuccess: () => {
        void utils.workspace.listWorkspaceByUserId.invalidate();
      },
      onError: (error, variables, context) => {
        utils.workspace.listWorkspaceByUserId.setData(undefined, context?.previousWorkspaces);
        console.error("Error removing workspace:", error);
      }
    }
  );

  const handleRemove = () => {
    setShowDeleteDialog(true);
  }

  const handleConfirmDelete = () => {
    removeWorkspace({ workspaceId: id });
  }

  return (
    <>
      <DeleteWarningDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleConfirmDelete}
        title="Delete Workspace"
        description={`Are you sure you want to delete "${name}"? This action cannot be undone.`}
      />

      <Card className="border p-4">
        <Link href={`/workspace/${id}`} className="block">
          <div className="grid grid-cols-2 gap-2 mb-4">
            <div className="h-16 border rounded"></div>
            <div className="h-16 border rounded"></div>
            <div className="h-16 border rounded"></div>
            <div className="h-16 border rounded"></div>
          </div>
          <h3 className="font-medium">{name}</h3>
          <div className="flex items-center gap-2">
            <p className="text-xs text-gray-500">{numberOfFiles} files</p>
            <div className="h-1 w-1 bg-gray-500 rounded-full"></div>
            <p className="text-xs text-gray-500">{date}</p>
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
              <DropdownMenuItem className='text-red-500' onClick={(e) => {
                e.stopPropagation();
                handleRemove();
              }}>Remove</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </Card>
    </>
  )
}
