"use client"

import { SidebarTrigger } from "~/components/ui/sidebar"
import { Plus } from "lucide-react"
import { NewItemDialog } from "./new-item-diaplog"
import { Button } from "../ui/button"
import { SearchBar } from "./search-bar"

export function Navbar() {
  return (
    <header className="flex items-center justify-between g-backbground border-b h-16 px-3">
      <SidebarTrigger className="mr-3" />

      <div className="flex-1 max-w-xl">
        <SearchBar />
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

