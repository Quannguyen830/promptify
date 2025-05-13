import { Plus, Filter, List } from "lucide-react"
import { NewItemDialog } from "../upload/new-item-diaplog"
import { Button } from "../ui/button"
import { SearchBar } from "./search-bar"

export function Navbar() {
  return (
    <header className="flex items-center justify-between bg-background border-b h-16 ">
      <div className="flex-1">
        <SearchBar />
      </div>

      {/* <div className="flex items-center gap-2 mr-2">
        <Button variant="ghost" size="icon" className="rounded-full">
          <Filter className="h-5 w-5" />
          <span className="sr-only">Filter</span>
        </Button>
        
        <Button variant="ghost" size="icon" className="rounded-full">
          <List className="h-5 w-5" />
          <span className="sr-only">View options</span>
        </Button>
      </div> */}

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

