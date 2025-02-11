import { 
  type SubmitHandler,
  useForm
} from "react-hook-form";
import { Paperclip, Send } from "lucide-react";
import { api } from "~/trpc/react";

import { ChatSectionState, useChatStore } from "./chat-store";
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
    currentChatSession,
    addMessage,
    setChatState,
    setCurrentChatSession
  } = useChatStore()

  const {
    register,
    handleSubmit,
    reset
  } = useForm<ChatInputForm>()

  const createSessionWithMessage = api.chat.createChatSessionWithMessage.useMutation();
  const saveMessage = api.chat.createMessageAndGetResponse.useMutation();

  const userId = useSession().data?.user?.id;
  if (!userId) return;
 
  const onSubmit: SubmitHandler<ChatInputForm> = async (data) => { 
    const inputMessage = data.message;
    reset();
    
    if (!currentChatSession) {
      setChatState(ChatSectionState.SESSION_SELECTED);

      addMessage({
        content: inputMessage,
        sender: "USER"
      });
      const reply = await createSessionWithMessage.mutateAsync({
        content: inputMessage,
        sender: "USER"
      });
      addMessage({
        content: reply.response,
        sender: "AGENT"
      })

      setCurrentChatSession(reply.id);
    } else {
      const reply = await saveMessage.mutateAsync({
        chatSessionId: currentChatSession.id,
        content: inputMessage,
        context: currentChatSession.messages.slice(-10),
        sender: "USER"
      });
      addMessage({
        content: inputMessage,
        sender: "USER"
      });
      addMessage({
        content: reply.content,
        sender: "AGENT"
      });
    }
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
        {...register("message")} 
        placeholder="Cmd + L"
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