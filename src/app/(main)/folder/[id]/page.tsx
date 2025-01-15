'use client'

import { Plus } from 'lucide-react'
import { Navbar } from "~/components/dashboard/navbar"
import { SuggestedSection } from "~/components/dashboard/suggested-section"
import { Button } from "~/components/ui/button"
import { NewItemDialog } from "~/components/dashboard/new-item-diaplog"
import { FolderBreadcrumb } from "~/components/dashboard/folder-breadcrumb"
import { useParams } from 'next/navigation'

export default function FolderPage() {
  const { id } = useParams<{ id: string }>();

  if (!id || Array.isArray(id)) {
    return <div>Error: Invalid folder ID</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <FolderBreadcrumb
            items={[
              { label: "My Drive", href: "/dashboard" },
              { label: id, href: `/folder/${id}`, current: true }
            ]}
          />
          <NewItemDialog>
            <Button variant="outline" className="gap-2 rounded-full">
              <Plus className="h-4 w-4" />
              New
            </Button>
          </NewItemDialog>
        </div>
        <SuggestedSection title="Folder contents" type="files" />
      </main>
    </div>
  )
}

