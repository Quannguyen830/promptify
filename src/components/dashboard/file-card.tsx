import { MoreVertical } from 'lucide-react'
import { Card, CardContent, CardHeader } from "~/components/ui/card"
import { Button } from "~/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"
import Image from "next/image"
import { type FileCardProps } from '~/constants/interfaces'
import { api } from '~/trpc/react'
import Link from 'next/link'

export function FileCard({ id, title, date, imageUrl, subtitle }: FileCardProps) {
  const { mutate: removeFile } = api.file.deleteFileByFileId.useMutation();

  const handleRemove = () => {
    removeFile({ fileId: id }, {
      onSuccess: () => {
        console.log(`File with ID ${id} removed successfully.`);
      },
      onError: (error) => {
        console.error("Error removing file:", error);
      }
    });
  }

  return (
    <>
      <Card className="hover:bg-accent cursor-pointer transition-colors">
        <Link href={`/file/${id}`}>
          <CardHeader className="p-0">
            <div className="relative aspect-video w-full">
              <Image
                src={imageUrl}
                alt={title}
                fill
                className="object-cover p-3 rounded-[20px]"
              />
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium leading-none">{title}</h3>
                <p className="text-sm text-muted-foreground truncate mt-1">{subtitle}</p>
                <p className="text-sm text-muted-foreground mt-2">{date}</p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Share</DropdownMenuItem>
                  <DropdownMenuItem>Get link</DropdownMenuItem>
                  <DropdownMenuItem
                    className='text-red-500'
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemove();
                    }}>
                    Remove</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardContent>
        </Link>
      </Card>
    </>
  )
}

