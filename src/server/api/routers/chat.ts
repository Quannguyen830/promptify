import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { MessageSenderSchema } from "~/constants/types";

import { generateChatTitle, sendMessage, sendMessageWithContext } from "~/server/services/gemini-service";


export const ChatRouter = createTRPCRouter({
  createChatSessionWithMessage: protectedProcedure
    .input(z.object({
      content: z.string(),
      sender: MessageSenderSchema,
    }))
    .mutation(async ({ input, ctx }) => {
      const { content, sender } = input;
      
      const agentReply = await sendMessage(content);
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
              {
                content: agentReply,
                sender: MessageSenderSchema.enum.AGENT
              }
            ]
          },
        },
        include: {
          messages: true,
        },
      });

      console.log("createChatSessionWithMessage", response);
      return {
        id: response.id,
        response: agentReply,
      };
    }),

  // save user message, get reply and save agent message. Use with existing ChatSession
  createMessageAndGetResponse: protectedProcedure
    .input(z.object({
      chatSessionId: z.string(),
      content: z.string(),
      sender: MessageSenderSchema,
      context: z.array(z.object({
        content: z.string(),
        sender: MessageSenderSchema
      }))
    }))
    .mutation(async ({ input, ctx }) => {
      const { chatSessionId, content, sender, context } = input;
      
      // save user message to db
      await ctx.db.message.create({
        data: {
          chatSessionId: chatSessionId,
          content: content,
          sender: sender,
        },
      });

      // get reply from agent
      const reply = await sendMessageWithContext(content, context);
      
      // save and return reply to client
      return await ctx.db.message.create({
        data: {
          chatSessionId: chatSessionId,
          content: reply,
          sender: MessageSenderSchema.enum.AGENT
        }
      })
    }),
    
  getAllChatSessions: protectedProcedure
    .query(async ({ ctx }) => {
      const response = await ctx.db.chatSession.findMany({
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
  
});