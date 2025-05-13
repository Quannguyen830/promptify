"use client"

import * as React from "react"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "~/components/ui/dialog"
import { Button } from "~/components/ui/button"
import { AlertTriangle } from "lucide-react"
import { ConfirmationDialog } from "../common/confirmation-dialog"

interface DeleteWarningDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  title: string
  description: string
}

export function DeleteWarningDialog({
  open,
  onOpenChange,
  onConfirm,
  title,
  description
}: DeleteWarningDialogProps) {
  return (
    <ConfirmationDialog
      open={open}
      onOpenChange={onOpenChange}
      onConfirm={onConfirm}
      onCancel={() => onOpenChange(false)}
      title={title}
      description={description}
      confirmText="Delete"
      confirmVariant="destructive"
    />
  )
} 