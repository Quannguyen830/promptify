"use client"

import { Input } from "~/components/ui/input"
import { SidebarTrigger } from "~/components/ui/sidebar"
import { Plus, Search } from "lucide-react"
import { NewItemDialog } from "./new-item-diaplog"
import { Button } from "../ui/button"

export function Navbar() {
  return (
    <header className="flex items-center justify-between g-backbground border-b h-16 px-3">
      <SidebarTrigger className="mr-3" />

      <div className="flex items-center flex-1 max-w-xl border border-gray-300 shadow-sm rounded-full px-4">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search in Drive"
          className="flex items-center border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 w-full"
        />
      </div>

      <div className="flex ml-3 items-center justify-center">
        <NewItemDialog>
          <Button variant="outline" className="gap-2 rounded-full">
            <Plus className="h-4 w-4" />
            New
          </Button>
        </NewItemDialog>
      </div>
    </header>
  )
}

