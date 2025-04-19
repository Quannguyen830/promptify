"use client";

import { FilePlus2, Search } from "lucide-react";
import { useState } from "react";
import { useChat } from "~/components/chat-section/chat-store";

import { Button } from "~/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "~/components/ui/dropdown-menu";
import { Input } from "~/components/ui/input";
import { ScrollArea } from "~/components/ui/scroll-area";

import { api } from "~/trpc/react";


export default function FileSelectorMenu() {  
  const {
    addContextFileId
  } = useChat();

  const { data: files } = api.file.getAllFileNamesWithWorkspace.useQuery();
  const [searchInput, setSearchInput] = useState<string>("");

  if (!files) return null;

  const handleSearchInput = (input: string) => {
    setSearchInput(input);
  };
  
  const filteredFiles = searchInput.trim() === ""
    ? files
    : files?.filter(file => file.name.toLowerCase().includes(searchInput.toLowerCase())
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="focus-visible:outline-0">
        <Button variant="ghost" className="p-2">
          <FilePlus2 className="h-6"/> 
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="">
        <DropdownMenuGroup className="relative flex">
          <Search className="absolute h-4 top-2 left-1 text-muted-foreground" />
          <Input 
            type="text"
            onChange={(e) => handleSearchInput(e.target.value)}
            placeholder="Enter File name"
            className="h-8 focus-visible:ring-0 pl-8"
          />
        </DropdownMenuGroup>

        <DropdownMenuGroup>
          <ScrollArea>
            {filteredFiles?.map((file, index) => (
              <DropdownMenuItem onClick={() => addContextFileId(file)} className="flex gap-2 w-80 justify-between" key={index}>
                <p className="w-2/3 truncate text-ellipsis">{file.name}</p>
                <p className="w-1/3 text-end text-black/50 ">{file.workspaceName}</p>
              </DropdownMenuItem>
            ))}
          </ScrollArea>
        </DropdownMenuGroup>
      
      </DropdownMenuContent>
    </DropdownMenu>
  )
}