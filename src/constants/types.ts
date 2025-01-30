/* eslint-disable @typescript-eslint/no-unused-vars */

import { z } from "zod";

import { 
  MessageSender as MessageSenderPrisma
} from "@prisma/client";


// CHAT
export const MessageSenderSchema = z.nativeEnum(MessageSenderPrisma);
export type MessageSender = z.infer<typeof MessageSenderSchema>;

const MessageSchema = z.object({
  id: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),

  content: z.string(),
  sender: MessageSenderSchema,
})
export type Message = z.infer<typeof MessageSchema>;

const ClientMessageSchema = MessageSchema.pick({
  content: true,
  sender: true
})
export type ClientMessage = z.infer<typeof ClientMessageSchema>;

const ChatSessionSchema = z.object({
  id: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),

  messages: z.array(MessageSchema),
})
export type ChatSession = z.infer<typeof ChatSessionSchema>;

const ClientChatSessionSchema = ChatSessionSchema.pick({
  id: true,
}).and(z.object({
  messages: z.array(ClientMessageSchema)
}))
export type ClientChatSession = z.infer<typeof ClientChatSessionSchema>;