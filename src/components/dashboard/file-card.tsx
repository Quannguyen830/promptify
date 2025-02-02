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

export function FileCard({ title, date, imageUrl }: FileCardProps) {
  return (
    <Card className="hover:bg-accent cursor-pointer bg-[#202020] border-0 transition-colors">
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
            <p className="text-sm text-muted-foreground pt-1">{date}</p>
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
              <DropdownMenuItem>Remove</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  )
}

