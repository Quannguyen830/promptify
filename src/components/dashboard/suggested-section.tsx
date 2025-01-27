import { ChevronDown, Folder } from 'lucide-react'
import { Button } from "~/components/ui/button"
import { FolderCard } from "./folder-card"
import { FileCard } from "./file-card"
import { type File } from '@prisma/client'

interface SuggestedSectionProps {
  title: string
  type: "folders" | "files"
  files?: Array<File>
}

export function SuggestedSection({ title, type, files }: SuggestedSectionProps) {
  const folders = [
    { id: "ios", title: "IOS", subtitle: "On My Drive" },
    { id: "comp-arch", title: "Comp Architecture", subtitle: "On My Drive" },
    { id: "photos", title: "PHOTOS!!!", subtitle: "Shared with me" },
    { id: "oceanstar", title: "Oceanstar", subtitle: "Shared with me" },
  ]

  return (
    <section className="space-y-4">
      <div className="flex items-center">
        <Button variant="ghost" className="px-2">
          <ChevronDown className="h-4 w-4 mr-2" />
          {title}
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {type === "folders"
          ? folders.map((folder) => (
            <FolderCard
              key={folder.id}
              id={folder.id}
              title={folder.title}
              subtitle={folder.subtitle}
              icon={<Folder className="h-5 w-5" />}
            />
          ))
          : files?.map((file) => (
            <FileCard
              key={file.id}
              title={file.name}
              date={file.createdAt.toDateString()}
              imageUrl={"/favicon.ico"}
            />
          ))}
      </div>
    </section>
  )
}

