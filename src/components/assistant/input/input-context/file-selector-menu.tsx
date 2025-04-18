"use client";

import { FilePlus2 } from "lucide-react";
import { useChat } from "~/components/chat-section/chat-store";

import { Button } from "~/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "~/components/ui/dropdown-menu";
import { ScrollArea } from "~/components/ui/scroll-area";

import { api } from "~/trpc/react";


export default function FileSelectorMenu() {  
  const {
    addContextFileId
  } = useChat();

  const { data: files } = api.file.getAllFileNamesWithWorkspace.useQuery();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="focus-visible:outline-0">
        <Button variant="ghost" className="p-2">
          <FilePlus2 className="h-6"/> 
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="">
        <DropdownMenuLabel>
          
        </DropdownMenuLabel>
      
        <ScrollArea>
          {files?.map((file, index) => (
            <DropdownMenuItem onClick={() => addContextFileId(file)} className="flex gap-2 w-80 justify-between" key={index}>
              <p className="w-2/3 truncate text-ellipsis">{file.name}</p>
              <p className="w-1/3 text-end text-black/50 ">{file.workspaceName}</p>
            </DropdownMenuItem>
          ))}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}