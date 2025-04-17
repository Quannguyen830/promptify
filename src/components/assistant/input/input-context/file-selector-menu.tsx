"use client";

import { FilePlus2 } from "lucide-react";

import { Button } from "~/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "~/components/ui/dropdown-menu";
import { ScrollArea } from "~/components/ui/scroll-area";

import { api } from "~/trpc/react";


export default function FileSelectorMenu() {  
  const { data: files } = api.file.getAllFileNamesWithWorkspace.useQuery();

  
  
  const handleSelectFile = () => {
    
    return
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="focus-visible:outline-0">
        <Button variant="ghost" onClick={handleSelectFile} className="p-2">
          <FilePlus2 className="h-6"/> 
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="">
        <DropdownMenuLabel>
          
        </DropdownMenuLabel>
      
        <ScrollArea>
          {files?.map((file, index) => (
            <DropdownMenuItem className="flex gap-2 w-80 justify-between" id={file.id} key={index}>
              <p className="w-2/3 truncate text-ellipsis">{file.name}</p>
              <p className="w-1/3 text-end text-black/50 ">{file.workspaceName}</p>
            </DropdownMenuItem>
          ))}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}