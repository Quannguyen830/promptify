import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { MessageSenderSchema } from "~/constants/types";

import { generateChatTitle } from "~/server/services/llm-service";

export const ChatRouter = createTRPCRouter({
  createChatSession: protectedProcedure
    .input(z.object({
      id: z.string().cuid2(),
      firstMessageContent: z.string(),
      sender: MessageSenderSchema,
    }))
    .mutation(async ({ input, ctx }) => {
      const { firstMessageContent: content, sender, id } = input;
      
      if (!ctx.session.user.id) return;

      let chatName: string;

      try {
        chatName = await generateChatTitle(content);
      } catch (err) {
        console.error("generateChatTitle failed:", err);
        chatName = "New Chat"; // fallback title
      }
      
      const response = await ctx.db.chatSession.create({
        data: {
          id: id,
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
          name: "New chat",
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
          chatSessionId,
          content,
          sender,
        },
      });
      
      // Fire-and-forget: non-blocking background update
      ctx.db.chatSession.findUnique({
        where: { id: chatSessionId },
        select: { name: true },
      })
        .then(async (chatSession) => {
          if (chatSession?.name === "New chat") {
            const title = await generateChatTitle(content);
            await ctx.db.chatSession.update({
              where: { id: chatSessionId },
              data: { name: title },
            });
          }
        })
        .catch((err) => {
          console.error("Failed to rename chat session", err);
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
