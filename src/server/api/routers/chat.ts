import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { MessageSenderSchema } from "~/constants/types";

import { generateChatTitle } from "~/server/services/llm-service";

export const ChatRouter = createTRPCRouter({
  createChatSession: protectedProcedure
    .input(z.object({
      firstMessageContent: z.string(),
      sender: MessageSenderSchema,
    }))
    .mutation(async ({ input, ctx }) => {
      const { firstMessageContent: content, sender } = input;
      
      if (!ctx.session.user.id) return;

      const chatName = await generateChatTitle(content);
      
      const response = await ctx.db.chatSession.create({
        data: {
          name: chatName,
          userId: ctx.session.user.id,
          messages: {
            create: [
              {
                content: content,
                sender: sender
              },
            ]
          },
        },
        include: {
          messages: true,
        },
      });

      return response;
    }),

  createChatSessionWithoutInitMessage: protectedProcedure
    .mutation(async ({ ctx }) => {
      return await ctx.db.chatSession.create({
        data: {
          name: "Untilted",
          userId: ctx.session.user.id
        }
      });
    }),


  // save user message. Use with existing ChatSession
  createMessage: protectedProcedure
    .input(z.object({
      chatSessionId: z.string(),
      content: z.string(),
      sender: MessageSenderSchema,
    }))
    .mutation(async ({ input, ctx }) => {
      const { chatSessionId, content, sender } = input;
      
      // save user message to db
      const result = await ctx.db.message.create({
        data: {
          chatSessionId: chatSessionId,
          content: content,
          sender: sender,
        },
      });
      return result;
    }),
    
    
  getAllChatSessions: protectedProcedure
    .query(async ({ ctx }) => {
      const response = await ctx.db.chatSession.findMany({
        where: {
          userId: ctx.session.user.id
        },
        select: {
          id: true,
          name: true,
          messages: {
            select: {
              content: true,
              sender: true
            }
          }
        },
        orderBy: {
          createdAt: 'asc'
        }
      });

      return response;
    }
  ),

  getAllChatSessionsId: protectedProcedure
    .query(async ({ ctx }) => {
      const response = await ctx.db.chatSession.findMany({
        where: {
          userId: ctx.session.user.id
        },
        select: {
          id: true,
          name: true
        },
        orderBy: {
          createdAt: "asc"
        }
      })
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
        select: {
          id: true,
          name: true,
          messages: true,
        },
      });

      return response;
    }
  ),
});
