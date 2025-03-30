import { Plus } from "lucide-react"
import { NewItemDialog } from "./new-item-diaplog"
import { Button } from "../ui/button"
import { SearchBar } from "./search-bar"

export function Navbar() {
  return (
    <header className="flex items-center justify-between bg-background border-b h-16 ">
      <div className="flex-1 max-w-4xl">
        <SearchBar />
      </div>

      <div className="flex ml-3 items-center justify-center">
        <NewItemDialog>
          <Button variant="default" className="gap-2 bg-blue-500 rounded-md">
            <Plus className="h-4 w-4" />
            Create New
          </Button>
        </NewItemDialog>
      </div>
    </header>
  )
}

