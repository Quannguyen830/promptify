import { 
  type SubmitHandler,
  useForm
 } from "react-hook-form";

 import { useChatStore } from "./chat-store";
import { getResponse } from "~/server/services/gemini-service"
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Send } from "lucide-react";

interface ChatInputForm {
  userMessage: string
}

const ChatInput = () => {
  const {
    register,
    handleSubmit
  } = useForm<ChatInputForm>()
  
  const {
    addUserMessage,
    addAgentMessage
  } = useChatStore()

  const onSubmit: SubmitHandler<ChatInputForm> = async (data) => { 
    addUserMessage(data.userMessage);

    // send msg to model
    const response = await getResponse(data.userMessage);

    addAgentMessage(response);
  }


  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-4 relative">
      <Textarea {...register("userMessage")} className="relative resize-none overflow-hidden ring-1 ring-black w-full pr-10" />
      
      <Button type="submit" size="icon" className="absolute top-5 right-5 z-50 h-8 w-8">
        <Send className="h-4 w-4" />
      </Button>
    </form>
  );
};

export default ChatInput;