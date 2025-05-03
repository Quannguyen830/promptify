"use client";

import { 
  type SubmitHandler,
  useForm
} from "react-hook-form";

import { api } from "~/trpc/react";

import { type ChatInputForm } from "~/constants/interfaces";
import { MessageSenderSchema } from "~/constants/types";
import { createId } from '@paralleldrive/cuid2';

import { SendHorizonal } from "lucide-react";
import { Textarea } from "../../ui/textarea";
import { Button } from "../../ui/button";
import { ChatState, useChatStore } from "../../chat/chat-store";
import { useStreamChatMutation } from "~/hooks/use-stream-chat";

import { useChat } from "@ai-sdk/react";

const AssistantInput: React.FC = () => {
  const {
    register,
    handleSubmit,
    reset
  } = useForm<ChatInputForm>()

  
  const utils = api.useUtils();
  const { mutateAsync } = useStreamChatMutation();
  const {
    selectedSessionId,
    chatProvider,
    contextFileIds,
    setChatState,
    setSelectedSessionId,
  } = useChatStore();
  
  const createSession = api.chat.createChatSession.useMutation({
    onMutate(data) {
      setSelectedSessionId(data.id);
      setChatState(ChatState.SESSION_SELECTED);

      utils.chat.getAllChatSessions.setData(
        undefined, 
        (sessions) => [
          ...sessions ?? [],
          {
            id: data.id,
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
      void utils.chat.getChatSessionById.invalidate({ id: data?.id })
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
                id: "temp-id",
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
      void utils.chat.getAllChatSessionsId.invalidate();
    }
  });

  const handleStreaming = async (inputMessage: string, sessionId: string) => {
    console.log("STREAMING STARTED")
    
    // fetch the server api
    const stream = await mutateAsync({
      chatSessionId: sessionId, 
      content: inputMessage,
      context: utils.chat.getChatSessionById.getData({ id: sessionId })?.messages ?? [],
      model: chatProvider,
      contextFiles: contextFileIds,
    });

    console.log("STREAM_CP 1: ", stream);

    const reader = stream.getReader();
    const decoder = new TextDecoder();
    let done = false;
    
    while (!done) {
      const { value, done: streamDone } = await reader.read();
      done = streamDone;
      
      if (value) {
        const chunk = decoder.decode(value, { stream: true });
        
        void utils.chat.getChatSessionById.cancel({ id: sessionId });
        utils.chat.getChatSessionById.setData(
          { id: sessionId },
          (session) => {
            if (!session?.messages) return;
        
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
                        chatSessionId: sessionId,
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
    console.log("STREAMING ENDED")
  }

  const onSubmit: SubmitHandler<ChatInputForm> = async (data) => { 
    const inputMessage = data.message;

    if (inputMessage.trim() === "") return;

    reset();
        
    if (!selectedSessionId) { 
      // for "New topic" btn and chat directly without selecting a topic
      const newSessionId = createId();

      await createSession.mutateAsync({
        id: newSessionId,
        firstMessageContent: inputMessage,
        sender: "USER"
      });

      await handleStreaming(inputMessage, newSessionId);
    } else { 
      // if topic is selected  
      await createMessage.mutateAsync({
        chatSessionId: selectedSessionId,
        content: inputMessage,
        sender: "USER"
      });

      await handleStreaming(inputMessage, selectedSessionId);
    }
  }

  return (
    <form 
      onSubmit={handleSubmit(onSubmit)} 
      className="flex gap-2 h-full"
    >
      <Textarea 
        {...register("message")} 
        onKeyDown={async event => {
          // shift + enter for new line
          if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            await handleSubmit(onSubmit)();
          }
        }}
        placeholder="Ask me anything"
        className="focus-visible:ring-0 resize-none border-none shadow-none p-0"
      />
      <Button variant={"ghost"} type="submit" className="p-2 fill-black stroke-black">
        <SendHorizonal />
      </Button>
    </form>
  );
};

export default AssistantInput;
