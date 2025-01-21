'use client'

import { SuggestedSection } from "~/components/dashboard/suggested-section"
import { Plus } from "lucide-react"
import { Button } from "~/components/ui/button"
import { NewItemDialog } from "~/components/dashboard/new-item-diaplog"
import { useSession } from "next-auth/react"
import { useEffect } from "react"
import { getFiles } from "~/app/services/file-service"

export default function Page() {
  const { data: session } = useSession();

  // if (session) {
  //   useEffect({
  //     const response = getFiles(session);
  //     console.log(response)
  //   }, [])
  // }

  return (
    <div>
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
    </div>
  )
}

