"use client";

import { useChat } from "~/components/chat-section/chat-store";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";

import { type ChatModel } from "~/constants/interfaces";
import { ChatProviderSchema } from "~/constants/types";


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

const ModelSelector = () => {
  const {
    setChatProvider
  } = useChat();
  
  const handleChatProviderSelect = (provider: ChatModel) => {
    setChatProvider(provider.value);
  }
  
  return (
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

  )
}
export default ModelSelector;