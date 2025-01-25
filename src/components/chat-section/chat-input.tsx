import { 
  type SubmitHandler,
  useForm
 } from "react-hook-form";

 import { MessageType, useChatStore } from "./chat-store";
import { getResponse } from "~/server/services/gemini-service"
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Paperclip, Send } from "lucide-react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

export interface ChatInputForm {
  userMessage: string
}

const ChatInput = () => {
  const {
    register,
    handleSubmit,
    reset
  } = useForm<ChatInputForm>()
  
  const {
    addMessage
  } = useChatStore()

  const onSubmit: SubmitHandler<ChatInputForm> = async (data) => { 
    addMessage(data.userMessage, MessageType.USER);
    reset();

    // send msg to model
    const response = await getResponse(data.userMessage);
    addMessage(response, MessageType.AGENT);
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // shift + enter for new line
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      void handleSubmit(onSubmit)();
    }
  };


  const addContext = () => {
    console.log("add context");
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col p-4 gap-2">
      <Textarea 
        {...register("userMessage")} 
        onKeyDown={handleKeyDown}
        className="relative z-0 resize-none overflow-hidden focus-visible:ring-0 w-full"
      />
      
      <div className="flex justify-between">
        <div>
          <Button onClick={addContext} type="button" variant="ghost" size="icon" className="h-8 w-8">
            <Paperclip className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex flex-row gap-1">
          <Select>
            <SelectTrigger className="focus-visible:ring-0 focus:ring-0 shadow-none w-auto h-8 gap-2">
              <SelectValue placeholder="GPT-4" />
            </SelectTrigger>

            <SelectContent>
              <SelectGroup>
                <SelectItem value="gemini">Gemini</SelectItem>
                <SelectItem value="gpt">GPT-4</SelectItem> 
                <SelectItem value="claude">Super long claude model name</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <Button variant="default" type="submit" size="icon" className="h-8 w-8">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </form>
  );
};

export default ChatInput;