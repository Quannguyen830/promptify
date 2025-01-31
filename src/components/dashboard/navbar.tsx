"use client"

import { Input } from "~/components/ui/input"
import { SidebarTrigger } from "~/components/ui/sidebar"
import { Avatar, AvatarFallback } from "~/components/ui/avatar"
import { Search } from "lucide-react"
import { useSession } from "next-auth/react"

export function Navbar() {
  const { data: session } = useSession();
  const firstLetter = session?.user?.email?.[0]?.toUpperCase() ?? '';

  return (
    <header className="flex items-center justify-between g-backbground border-b h-16 px-3">
      <SidebarTrigger className="mr-3" />

      <div className="flex items-center flex-1 max-w-xl bg-[#202020] rounded-full px-4">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search in Drive"
          className="flex items-center border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 w-full shadow-none"
        />
      </div>

      <div className="flex ml-3 items-center justify-center">
        <Avatar className="h-8 w-8">
          <AvatarFallback>{firstLetter}</AvatarFallback>
        </Avatar>
      </div>
    </header>
  )
}

