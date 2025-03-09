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
  { value: "gpt", name: "GPT-4" },
  { value: "claude", name: "Super long claude model name" }
]

const ChatInput = () => {
  const {
    currentChatSession,
    currentUserMessage,
    currentAgentMessageStream,
    isStreaming,
    newChatSessionId,

    setCurrentChatSession,
    setChatState,
    addMessage,
    setCurrentAgentMessageStream,
    resetAgentMessageStream,
    setIsStreaming
  } = useChatStore()

  const {
    register,
    handleSubmit,
    reset
  } = useForm<ChatInputForm>()

  const utils = api.useUtils();
  const createSession = api.chat.createChatSession.useMutation({
    onMutate(data) {
      void utils.chat.getAllChatSessions.cancel();

      const prevSessions = utils.chat.getAllChatSessions.getData();
      
      utils.chat.getAllChatSessions.setData(
        undefined, 
        (sessions) => [
          ...sessions ?? [],
          {
            id: crypto.randomUUID(),
            name: "New Chat",
            messages: [{
              content: data.firstMessageContent,
              sender: data.sender
            }]
          }
        ]
      )
      return { prevSessions };
    },
    onSettled(data) {
      if (data) setCurrentChatSession(data.id, true);

      // void utils.chat.getAllChatSessions.invalidate();
    }
  });

  const createMessage = api.chat.createMessage.useMutation({
    onMutate(data) {
      // void utils.chat.getAllChatSessions.cancel();

      addMessage({
        content: data.content,
        sender: "USER"
      });

      // const prevMessages = utils.chat.getAllChatSessions.getData();

      // return { prevMessages };
    },
    onSettled() {
      void utils.chat.getChatSessionById.invalidate({ id: currentChatSession!.id });
    }
  });

  api.chat.streamAgentResponse.useSubscription(
    {
      chatSessionId: currentChatSession?.id ?? newChatSessionId ?? "",
      content: currentUserMessage,
      context: currentChatSession?.messages ?? []
    },
    {
      onData(data) {
        if (data.done) {
          addMessage({
            content: currentAgentMessageStream,
            sender: "AGENT"
          });
          setIsStreaming(false);
          resetAgentMessageStream();
        } else {
          setCurrentAgentMessageStream(currentAgentMessageStream + data.content);
        }
      },
      enabled: isStreaming
    }
  );

  const userId = useSession().data?.user?.id;
  if (!userId) return;
 
  const onSubmit: SubmitHandler<ChatInputForm> = async (data) => { 
    const inputMessage = data.message;

    if (inputMessage.trim() === "") return;

    reset();
        
    if (!currentChatSession) { 
      setChatState(ChatSectionState.SESSION_SELECTED);

      await createSession.mutateAsync({
        firstMessageContent: inputMessage,
        sender: "USER"
      });      
    } else {      
      await createMessage.mutateAsync({
        chatSessionId: currentChatSession.id,
        content: inputMessage,
        sender: "USER"
      });
    }

    setIsStreaming(true); 
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
