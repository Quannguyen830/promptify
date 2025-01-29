import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { MessageSender } from "@prisma/client";

export const ChatRouter = createTRPCRouter({
  createChatSessionWithMessage: protectedProcedure
    .input(z.object({
      userId: z.string(),
      content: z.string(),
      sender: z.nativeEnum(MessageSender),
    }))
    .mutation(async ({ input, ctx }) => {
      const { userId, content, sender } = input;

      const response = await ctx.db.chatSession.create({
        data: {
          userId: userId,
          messages: {
            create: {
              content: content,
              sender: sender,
            },
          },
        },
        include: {
          messages: true,
        },
      });

      console.log("createChatSessionWithMessage: ", response);
      return response;
    }),

  getAllChatSessions: protectedProcedure
    .query(async ({ ctx }) => {
      const response = await ctx.db.chatSession.findMany({
        include: {
          messages: true,
        },
      });

      console.log("getAllChatSessions: ", response);
      return response;
    }
  ),

  getChatSessionById: protectedProcedure
    .input(z.object({
      id: z.string(),
    }))
    .query(async ({ input, ctx }) => {
      const { id } = input;

      const response = await ctx.db.chatSession.findUnique({
        where: {
          id: id,
        },
        include: {
          messages: true,
        },
      });

      console.log("getChatSessionById: ", response);
      return response;
    }
  ),
  
  addMessage: protectedProcedure
    .input(z.object({
      chatSessionId: z.string(),
      content: z.string(),
      sender: z.nativeEnum(MessageSender),
    }))
    .mutation(async ({ input, ctx }) => {
      const { chatSessionId, content, sender } = input;

      const response = await ctx.db.message.create({
        data: {
          chatSessionId: chatSessionId,
          content: content,
          sender: sender,
        },
      });

      console.log("addMessage: ", response);
      return response;
    }),
});