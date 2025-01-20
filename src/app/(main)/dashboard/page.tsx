'use client'

import { SuggestedSection } from "~/components/dashboard/suggested-section"
import { Navbar } from "~/components/dashboard/navbar"
import { Plus } from "lucide-react"
import { Button } from "~/components/ui/button"
import { NewItemDialog } from "~/components/dashboard/new-item-diaplog"

export default function Page() {
  return (
    <div className="min-h-screen bg-background">
      {/* <Navbar /> */}
      <main className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Welcome to Promptify Dashboard</h1>
          <NewItemDialog>
            <Button variant="outline" className="gap-2 rounded-full">
              <Plus className="h-4 w-4" />
              New
            </Button>
          </NewItemDialog>
        </div>
        <SuggestedSection title="Suggested folders" type="folders" />
        <SuggestedSection title="Suggested files" type="files" />
      </main>
    </div>
  )
}

