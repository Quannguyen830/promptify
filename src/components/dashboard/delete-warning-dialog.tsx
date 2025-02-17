import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog"

interface DeleteWarningDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  itemType: "workspace" | "folder" | "file"
  itemName: string
}

export function DeleteWarningDialog({ isOpen, onClose, onConfirm, itemType, itemName }: DeleteWarningDialogProps) {
  const getWarningMessage = () => {
    switch (itemType) {
      case "workspace":
        return `This will permanently delete the workspace "${itemName}" and all its contents, including all folders and files within it.`
      case "folder":
        return `This will permanently delete the folder "${itemName}" and all its contents, including all subfolders and files within it.`
      case "file":
        return `This will permanently delete the file "${itemName}".`
    }
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            {getWarningMessage()}
            <br />
            <br />
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

