import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { ChatProviderSchema, MessageSenderSchema } from "~/constants/types";

import { observable } from "@trpc/server/observable";
import { generateChatTitle, sendMessageWithContextStreaming } from "~/server/services/llm-service";

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

  streamAgentResponse: publicProcedure
  .input(z.object({
    chatSessionId: z.string(),
    content: z.string(),
    context: z.array(z.object({
      content: z.string(),
      sender: MessageSenderSchema
    })),
    model: ChatProviderSchema
  }))
  .subscription(async ({ input, ctx }) => {
    const { chatSessionId, content, context, model } = input;
        
    return observable<{ content: string, done: boolean }>((emit) => {
      // Define an abort controller to cancel the stream if needed
      const abortController = new AbortController();
      const signal = abortController.signal;
      
      // Start the streaming process asynchronously
      (async () => {
        try {
          // Get streaming response
          const result = await sendMessageWithContextStreaming(content, context, model);
          let accumulatedResponse = '';
          
          // Process each chunk as it comes in
          for await (const chunk of result.textStream) {
            // Check if the subscription has been cancelled
            if (signal.aborted) {
              console.log('Streaming was aborted');
              break;
            }
            
            accumulatedResponse += chunk;
            
            // Emit each chunk to the client
            emit.next({
              content: chunk,
              done: false
            });
          }
          
          // Only save to DB and complete if not aborted
          if (!signal.aborted) {
            // Save the complete response to the database when streaming is done
            await ctx.db.message.create({
              data: {
                chatSessionId: chatSessionId,
                content: accumulatedResponse,
                sender: MessageSenderSchema.enum.SYSTEM
              }
            });
            
            // Signal that we're done streaming
            emit.next({
              content: '',
              done: true
            });
            
            emit.complete();
          }
        } catch (error) {
          console.error('Error streaming response:', error);
          if (!signal.aborted) {
            emit.error(error);
          }
        }
      })().catch(error => {
        console.error('Error streaming response:', error);
        if (!signal.aborted) {
          emit.error(error);
        }
      });
      
      // Return the teardown logic function
      return () => {
        console.log('Subscription ended, cleaning up resources');
        abortController.abort();
      };
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
