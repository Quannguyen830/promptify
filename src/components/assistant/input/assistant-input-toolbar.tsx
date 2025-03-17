import { ImageIcon, Upload } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { type ChatModel } from "~/constants/interfaces";

const AssistantInputToolbar = () => {
  const chatModels: ChatModel[] = [
    {
      name: "ChatGPT",
      value: "chatgpt"
    },
    {
      name: "Gemini",
      value: "gemini"
    }
  ];

  return (
    <div className={`flex justify-between w-full bg-stone-200 h-12 rounded-[8px]`}>
      <div className="p-3">
        <Select>
          <SelectTrigger disabled className="h-6 p-0 w-28 shadow-none focus-visible:ring-0 focus:outline-0">
            <SelectValue className="h-4" placeholder={chatModels[0]!.name} />
          </SelectTrigger>
          <SelectContent className="w-24 bg-red-500 p-0">
            {chatModels.map((model, index: number) => (
              <SelectItem className="" key={index} value={model.value}>{model.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-row items-center gap-4 h-full px-3">
        {/* create custom component for adding image and download */}
        <Button variant="ghost" className="p-2">
          <ImageIcon className="h-6" />
        </Button>

        <Button variant="ghost" className="p-2">
          <Upload className="h-6" />
        </Button>
      </div>
    </div>
  )
}

export default AssistantInputToolbar;