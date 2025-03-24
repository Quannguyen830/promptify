import { type BaseProps } from "~/constants/interfaces";
import AssistantInputToolbar from "./assistant-input-toolbar";
import { SendHorizonal } from "lucide-react";
import { Button } from "~/components/ui/button";

const AssistantInput: React.FC<BaseProps> = ({ className }) => {
  
  return (
    <form className={`h-[161px] box-border w-full bg-gray-50 rounded-sm p-3 ${className}`}>
      <AssistantInputToolbar />

      <div className="flex flex-row items-center gap-2">
        <textarea className="mt-2 h-[81px] max-h-32 w-full bg-transparent resize-none focus:outline-none" placeholder="Ask me anything" />
        <Button variant={"ghost"} className="p-2 fill-black stroke-black">
          <SendHorizonal className="" />
        </Button>
      </div>
    </form>
  )
}
export default AssistantInput;