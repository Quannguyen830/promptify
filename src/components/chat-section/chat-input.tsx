"use client";

import { 
  type SubmitHandler,
  useForm
} from "react-hook-form";

import { api } from "~/trpc/react";

import { type BaseProps, type ChatInputForm } from "~/constants/interfaces";
import { MessageSenderSchema } from "~/constants/types";

import { SendHorizonal } from "lucide-react";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { ChatState, useChat } from "./chat-store";
import { useStreamChatMutation } from "~/hooks/use-stream-chat";

interface ChatInputProps extends BaseProps {
  formClassName?: string;
  textareaClassName?: string;
}


const ChatInput: React.FC<ChatInputProps> = ({ formClassName, textareaClassName }) => {
  const {
    register,
    handleSubmit,
    reset
  } = useForm<ChatInputForm>()

  const {
    selectedSessionId,
    chatProvider,
    contextFileIds,
    setChatState,
    setSelectedSessionId,
  } = useChat();
  
  const utils = api.useUtils();
  const { mutateAsync } = useStreamChatMutation();
  
  const createSession = api.chat.createChatSession.useMutation({
    onMutate(data) {
      setChatState(ChatState.SESSION_SELECTED);

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
    },
    onSettled(data) {
      if (data) setSelectedSessionId(data.id);

      void utils.chat.getAllChatSessionsId.invalidate();
    }
  });

  const createMessage = api.chat.createMessage.useMutation({
    onMutate(data) {
      void utils.chat.getChatSessionById.cancel({ id: data.chatSessionId });

      utils.chat.getChatSessionById.setData(
        { id: data.chatSessionId },
        (session) => {
          if (!session) return undefined;
          return {
            ...session, 
            messages: [
              ...(session.messages ?? []),
              {
                id: crypto.randomUUID(),
                createdAt: new Date(),
                updatedAt: new Date(),
                sender: data.sender,
                chatSessionId: data.chatSessionId,
                content: data.content
              }
            ]
          };
        }
      );
    },
    onSettled() {
      void utils.chat.getChatSessionById.invalidate({ id: selectedSessionId! });
    }
  });

  const handleStreaming = async (inputMessage: string) => {
    if (!selectedSessionId) return;

    const stream = await mutateAsync({
      chatSessionId: selectedSessionId, 
      content: inputMessage,
      context: utils.chat.getChatSessionById.getData({ id: selectedSessionId ?? "" })?.messages ?? [],
      model: chatProvider,
      contextFiles: contextFileIds,
    });

    const reader = stream.getReader();
    const decoder = new TextDecoder();
    let done = false;
    
    while (!done) {
      const { value, done: streamDone } = await reader.read();
      done = streamDone;
      
      if (value) {
        const chunk = decoder.decode(value, { stream: true });
        
        void utils.chat.getChatSessionById.cancel({ id: selectedSessionId ?? "" });
        utils.chat.getChatSessionById.setData(
          { id: selectedSessionId ?? "" },
          (session) => {
            if (!session?.messages || session.messages.length === 0) return;
        
            const lastMessage = session.messages[session.messages.length - 1];
        
            return {
              ...session,
              messages:
                lastMessage!.sender === "USER"
                  ? [
                      ...session.messages,
                      {
                        id: "streaming-message",
                        createdAt: new Date(),
                        updatedAt: new Date(),
                        sender: MessageSenderSchema.enum.SYSTEM,
                        chatSessionId: selectedSessionId,
                        content: chunk
                      }
                    ]
                  : session.messages.map((msg, index) =>
                      index === session.messages.length - 1
                        ? { ...msg, content: msg.content + chunk, updatedAt: new Date() }
                        : msg
                    )
            };
          }
        );
      }
    }
  }
 
  const onSubmit: SubmitHandler<ChatInputForm> = async (data) => { 
    const inputMessage = data.message;

    if (inputMessage.trim() === "") return;

    reset();
        
    if (!selectedSessionId) { 
      setChatState(ChatState.SESSION_SELECTED);

      await createSession.mutateAsync({
        firstMessageContent: inputMessage,
        sender: "USER"
      });      
    } else {      
      await createMessage.mutateAsync({
        chatSessionId: selectedSessionId,
        content: inputMessage,
        sender: "USER"
      });
    }
    
    await handleStreaming(inputMessage);
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // shift + enter for new line
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      void handleSubmit(onSubmit)();
    }
  };

  return (
    <form 
      onSubmit={handleSubmit(onSubmit)} 
      className={formClassName}
    >
      <Textarea 
        {...register("message")} 
        placeholder="Ask me anything"
        onKeyDown={handleKeyDown}
        className={textareaClassName}
      />
      <Button variant={"ghost"} type="submit" className="p-2 fill-black stroke-black">
        <SendHorizonal />
      </Button>
    </form>
  );
};

export default ChatInput;
