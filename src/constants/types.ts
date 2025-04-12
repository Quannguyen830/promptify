/* eslint-disable @typescript-eslint/no-unused-vars */

import {
  MessageSender as MessageSenderPrisma
} from "@prisma/client";
import { z } from "zod";

// CHAT
export const ChatProviderSchema = z.enum([
  "gemini-2.0-flash",
  "claude-3-haiku-20240307"
]);
export type ChatProvider = z.infer<typeof ChatProviderSchema>; 


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

  name: z.string(),
  messages: z.array(MessageSchema),
})
export type ChatSession = z.infer<typeof ChatSessionSchema>;

const ClientChatSessionSchema = ChatSessionSchema.pick({
  id: true,
  name: true,
}).and(z.object({
  messages: z.array(ClientMessageSchema)
}))
export type ClientChatSession = z.infer<typeof ClientChatSessionSchema>;



// AUTH
export const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
})

export const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
})

export const signUpSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions",
  }),
})

export type SignInInput = z.infer<typeof signInSchema>
export type SignUpInput = z.infer<typeof signUpSchema>
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>