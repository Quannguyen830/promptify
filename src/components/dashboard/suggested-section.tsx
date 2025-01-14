import { ChevronDown, Folder } from 'lucide-react'
import { Button } from "~/components/ui/button"
import { FolderCard } from "./folder-card"
import { FileCard } from "./file-card"

interface SuggestedSectionProps {
  title: string
  type: "folders" | "files"
}

export function SuggestedSection({ title, type }: SuggestedSectionProps) {
  const folders = [
    { title: "IOS", subtitle: "On My Drive" },
    { title: "Comp Architecture", subtitle: "On My Drive" },
    { title: "PHOTOS!!!", subtitle: "Shared with me" },
    { title: "Oceanstar", subtitle: "Shared with me" },
  ]

  const files = [
    { title: "IMG_2878.HEIC", date: "Created Dec 15, 2024", imageUrl: "/favicon.ico" },
    { title: "DSCF1047.JPG", date: "Created Dec 15, 2024", imageUrl: "/favicon.ico" },
    { title: "IMG_6064.JPG", date: "Created Dec 15, 2024", imageUrl: "/favicon.ico" },
    { title: "DSC05518-2.jpg", date: "Created Dec 15, 2024", imageUrl: "/favicon.ico" },
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
              key={folder.title}
              title={folder.title}
              subtitle={folder.subtitle}
              icon={<Folder className="h-5 w-5" />}
            />
          ))
          : files.map((file) => (
            <FileCard
              key={file.title}
              title={file.title}
              date={file.date}
              imageUrl={file.imageUrl}
            />
          ))}
      </div>
    </section>
  )
}

