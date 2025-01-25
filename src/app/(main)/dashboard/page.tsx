'use client'

import { SuggestedSection } from "~/components/dashboard/suggested-section"
import { Plus } from "lucide-react"
import { Button } from "~/components/ui/button"
import { NewItemDialog } from "~/components/dashboard/new-item-diaplog"
import { useSession } from "next-auth/react"
import { api } from "~/trpc/react"

export default function Page() {
  const { data: session } = useSession();
  const { data: fetchedFiles, isLoading, error } = api.file.getFile.useQuery(
    { userId: session?.user.id ?? "" }
  );

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

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
      <SuggestedSection title="Suggested files" type="files" files={fetchedFiles} />
    </div>
  )
}

