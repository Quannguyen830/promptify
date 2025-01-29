import { 
  type SubmitHandler,
  useForm
} from "react-hook-form";
import { Paperclip, Send } from "lucide-react";
import { api } from "~/trpc/react";

import { MessageType, useChatStore } from "./chat-store";
import { getResponse } from "~/server/services/gemini-service"
import { type ChatInputForm, type ChatModel } from "~/constants/interfaces";

import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useSession } from "next-auth/react";

const CHAT_MODELS: ChatModel[] = [
  { value: "gemini", name: "Gemini" },
  // { value: "gpt", name: "GPT-4" },
  // { value: "claude", name: "Super long claude model name" }
]

const ChatInput = () => {
  const {
    messages,
    addMessage,
    currentChatSessionId
  } = useChatStore()
  const {
    register,
    handleSubmit,
    reset
  } = useForm<ChatInputForm>()

  const saveInitialMessage = api.chat.createChatSessionWithMessage.useMutation();
  const saveMessage = api.chat.addMessage.useMutation();
  const userId = useSession().data?.user?.id;

  if (!userId) return;
 
  const onSubmit: SubmitHandler<ChatInputForm> = async (data) => { 
    if (messages.length === 0) {
      saveInitialMessage.mutate({
        userId: userId,
        content: data.userMessage,
        sender: "USER"
      });
    } else {
      saveMessage.mutate({
        chatSessionId: currentChatSessionId,
        content: data.userMessage,
        sender: "USER"
      });
    }
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
              <SelectValue placeholder={CHAT_MODELS[0]?.name} />
            </SelectTrigger>

            <SelectContent>
              <SelectGroup>
                {CHAT_MODELS.map((model) => (
                  <SelectItem key={model.value} value={model.value}>{model.name}</SelectItem>
                ))}
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