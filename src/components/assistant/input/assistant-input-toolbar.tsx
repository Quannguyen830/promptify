"use client";

import { ImageIcon, Upload } from "lucide-react";
import { useChat } from "~/components/chat-section/chat-store";
import { Button } from "~/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { type ChatModel } from "~/constants/interfaces";
import { ChatProviderSchema } from "~/constants/types";
import FileSelectorMenu from "./input-context/file-selector-menu";


export const chatModels: ChatModel[] = [
  {
    name: "Gemini-2.0-flash",
    value: ChatProviderSchema.Enum["gemini-2.0-flash"]
  },
  {
    name: "Claude-3-haiku-20240307",
    value: ChatProviderSchema.Enum["claude-3-haiku-20240307"]
  },
];


const AssistantInputToolbar = () => {
  const {
    setChatProvider
  } = useChat();
  
  const handleChatProviderSelect = (provider: ChatModel) => {
    setChatProvider(provider.value);
  }

  return (
    <div className={`flex justify-between w-full p-3 bg-stone-200 h-12 rounded-[8px]`}>
      <Select disabled onValueChange={(value) => {
        const selectedModel = chatModels.find(model => model.value === value);
        if (selectedModel) {
          handleChatProviderSelect(selectedModel);
        }
      }}>
        <SelectTrigger className="h-6 p-2 pl-0 w-auto gap-1.5 shadow-none focus-visible:ring-0 focus:ring-0 focus:outline-0 hover:bg-stone-50">
          <SelectValue className="h-4" placeholder={chatModels[0]!.name} />
        </SelectTrigger>
        <SelectContent>
          {chatModels.map((model, index: number) => (
            <SelectItem 
              className="pr-2" 
              key={index} 
              value={model.value} 
            >
              {model.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="flex flex-row items-center gap-4 h-full px-3">
        {/* create custom component for adding image and download */}
        <Button variant="ghost" className="p-2">
          <ImageIcon className="h-6" />
        </Button>

        <Button variant="ghost" className="p-2">
          <Upload className="h-6" />
        </Button>

        <FileSelectorMenu />
      </div>
    </div>
  )
}

export default AssistantInputToolbar;