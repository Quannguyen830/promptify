"use client";

import { 
  type SubmitHandler,
  useForm
} from "react-hook-form";
import { SendHorizonal } from "lucide-react";
import { api } from "~/trpc/react";
import { useState } from "react";

import { type BaseProps, type ChatInputForm } from "~/constants/interfaces";

import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { ChatState, useChat } from "./chat-store";

interface ChatInputProps extends BaseProps {
  formClassName?: string;
  textareaClassName?: string;
}


const ChatInput: React.FC<ChatInputProps> = ({ children, formClassName, textareaClassName }) => {
  const {
    register,
    handleSubmit,
    reset
  } = useForm<ChatInputForm>()

  const {
    selectedSessionId,
    isStreaming,
    setChatState,
    setSelectedSessionId,
    setIsStreaming,
  } = useChat();

  const utils = api.useUtils();
  const [userMessage, setUserMessage] = useState<string>("");
  
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

  api.chat.streamAgentResponse.useSubscription(
    {
      chatSessionId: selectedSessionId ?? "",
      content: userMessage,
      context: utils.chat.getChatSessionById.getData({ id: selectedSessionId ?? "" })?.messages ?? []
    },
    {
      onData(data) {
        if (data.done) {
          setIsStreaming(false);
          void utils.chat.getChatSessionById.invalidate();
        } else {
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
                          sender: "AGENT",
                          chatSessionId: selectedSessionId!,
                          content: data.content
                        }
                      ]
                    : session.messages.map((msg, index) =>
                        index === session.messages.length - 1
                          ? { ...msg, content: msg.content + data.content, updatedAt: new Date() }
                          : msg
                      )
              };
            }
          );
        }
      },
      enabled: isStreaming
    }
  );
 
  const onSubmit: SubmitHandler<ChatInputForm> = async (data) => { 
    const inputMessage = data.message;

    if (inputMessage.trim() === "") return;
    setUserMessage(inputMessage);

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
    <form 
      onSubmit={handleSubmit(onSubmit)} 
      className={`${formClassName}`}
    >
      <Textarea 
        {...register("message")} 
        placeholder="Ask me anything"
        onKeyDown={handleKeyDown}
        className={`${textareaClassName}`}
      />
      <Button variant={"ghost"} type="submit" className="p-2 fill-black stroke-black">
        <SendHorizonal />
      </Button>
    </form>
  );
};

export default ChatInput;
