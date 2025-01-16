import { Input } from "~/components/ui/input"
import { SidebarTrigger } from "~/components/ui/sidebar"
import { Avatar, AvatarFallback } from "~/components/ui/avatar"
import { Search } from "lucide-react"
import { useSession } from "next-auth/react"

export function Navbar() {
  const { data: session } = useSession();
  const username = session?.user.email
  const firstLetter = username?.slice(0, 1).toUpperCase();

  return (
    <header className="flex items-center justify-between p-2 bg-background border-b">
      <SidebarTrigger />
      <div className="flex items-center flex-1 max-w-xl">
        <div className="flex items-center w-full bg-secondary rounded-full px-4 py-1.5">
          <Search className="h-4 w-4 text-muted-foreground mr-2" />
          <Input
            type="search"
            placeholder="Search in Drive"
            className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 w-full shadow-none"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Avatar className="h-8 w-8">
          <AvatarFallback>{firstLetter}</AvatarFallback>
        </Avatar>
      </div>
    </header>
  )
}

