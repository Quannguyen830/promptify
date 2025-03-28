import { type BaseProps } from "~/constants/interfaces";
import AssistantInputToolbar from "./assistant-input-toolbar";

import ChatInput from "~/components/chat-section/chat-input";


const AssistantInput: React.FC<BaseProps> = ({ className }) => {

  return (
    <div className={`flex flex-col gap-2 h-[161px] box-border w-full bg-gray-50 rounded-sm p-3 ${className}`}>
      <AssistantInputToolbar />
      <ChatInput 
        formClassName="flex gap-2 h-full"
        textareaClassName="focus-visible:ring-0 resize-none border-none shadow-none p-0"
      />
    </div>
  )
}
export default AssistantInput;