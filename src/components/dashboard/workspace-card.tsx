import { MoreVertical } from "lucide-react"
import Link from "next/link"
import { Button } from "~/components/ui/button"
import { Card } from "~/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "~/components/ui/dropdown-menu"
import { api } from "~/trpc/react"
import { DeleteWarningDialog } from "../upload/delete-warning-dialog"
import { RenameDialog } from "../upload/rename-dialog"
import { useState, useRef } from "react"
import { useToast } from "~/hooks/use-toast"
import { copyToClipboard } from "~/lib/utils/copy-to-clipboard"

interface WorkspaceCardProps {
  id: string
  name: string
  date: string
  // type: "personal" | "shared"
}

export function WorkspaceCard({ id, name, date }: WorkspaceCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showRenameDialog, setShowRenameDialog] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const utils = api.useUtils();
  const { toast } = useToast()

  const { mutate: removeWorkspace } = api.workspace.deleteWorkspaceByWorkspaceId.useMutation({
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
      
      toast({
        title: "Workspace deleted",
        description: `"${name}" workspace deleted successfully`,
        variant: "success",
        className: "p-4",
      })
    },
    onError: (error, variables, context) => {
      utils.workspace.listWorkspaceByUserId.setData(undefined, context?.previousWorkspaces);
      console.error("Error removing workspace:", error);
      
      toast({
        title: "Deletion failed",
        description: "There was an error deleting the workspace",
        variant: "destructive",
        className: "p-4",
      })
    }
  });

  const { mutate: updateWorkspace } = api.workspace.updateWorkspaceByWorkspaceId.useMutation({
    onSuccess: () => {
      void utils.workspace.listWorkspaceByUserId.invalidate()
      
      toast({
        title: "Workspace renamed",
        description: "Workspace renamed successfully",
        variant: "success",
        className: "p-4",
      })
    },
    onError: () => {
      toast({
        title: "Rename failed",
        description: "There was an error renaming the workspace",
        variant: "destructive",
        className: "p-4",
      })
    }
  });

  const handleRemove = () => {
    setDropdownOpen(false)
    setShowDeleteDialog(true)
  }

  const handleRename = () => {
    setDropdownOpen(false)
    setShowRenameDialog(true)
  }

  const handleConfirmRename = (newName: string) => {
    updateWorkspace({ 
      workspaceId: id, 
      workspaceName: newName 
    })
  }

  const handleConfirmDelete = () => {
    removeWorkspace({ workspaceId: id })
  }

  const handleGetLink = async () => {
    setDropdownOpen(false)
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? window.location.origin
    const shareUrl = `${baseUrl}/workspace/${id}`
    
    const success = await copyToClipboard(shareUrl)
    
    if (success) {
      toast({
        title: "Link copied",
        description: "Workspace link copied to clipboard",
        variant: "success",
        className: "p-4",
      })
    } else {
      toast({
        title: "Copy failed",
        description: "Failed to copy link to clipboard",
        variant: "destructive",
        className: "p-4",
      })
    }
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
      <RenameDialog
        open={showRenameDialog}
        onOpenChange={setShowRenameDialog}
        onConfirm={handleConfirmRename}
        title="Rename Workspace"
        currentName={name}
        itemType="workspace"
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
          <p className="text-xs text-gray-500">{date}</p>
        </Link>
        <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={(e) => {
                e.stopPropagation();
                handleRename();
              }}>Rename</DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => {
                e.stopPropagation();
                void handleGetLink();
              }}>Get link</DropdownMenuItem>
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
