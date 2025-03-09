import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { MessageSenderSchema } from "~/constants/types";

import { generateChatTitle, sendMessageWithContextStreaming } from "~/server/services/gemini-service";
import { observable } from "@trpc/server/observable";

export const ChatRouter = createTRPCRouter({
  createChatSession: protectedProcedure
    .input(z.object({
      firstMessageContent: z.string(),
      sender: MessageSenderSchema,
    }))
    .mutation(async ({ input, ctx }) => {
      const { firstMessageContent: content, sender } = input;
      
      // const agentReply = await sendMessage(content);
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

  streamAgentResponse: publicProcedure
  .input(z.object({
    chatSessionId: z.string(),
    content: z.string(),
    context: z.array(z.object({
      content: z.string(),
      sender: MessageSenderSchema
    }))
  }))
  .subscription(async ({ input, ctx }) => {
    const { chatSessionId, content, context } = input;
        
    return observable<{ content: string, done: boolean }>((emit) => {
      // Define an abort controller to cancel the stream if needed
      const abortController = new AbortController();
      const signal = abortController.signal;
      
      // Start the streaming process asynchronously
      (async () => {
        try {
          // Get streaming response
          const streamResponse = await sendMessageWithContextStreaming(content, context);
          let accumulatedResponse = '';
          
          // Process each chunk as it comes in
          for await (const chunk of streamResponse.stream) {
            // Check if the subscription has been cancelled
            if (signal.aborted) {
              console.log('Streaming was aborted');
              break;
            }
            
            const textChunk = chunk.text();
            accumulatedResponse += textChunk;
            
            // Emit each chunk to the client
            emit.next({
              content: textChunk,
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
                sender: MessageSenderSchema.enum.AGENT
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

      console.log("getAllChatSessions: ", response);
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

      console.log("getChatSessionById: ", response);
      return response;
    }
  ),
});
