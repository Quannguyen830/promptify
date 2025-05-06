import { smoothStream, streamText } from "ai";
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { ChatProviderSchema, MessageSenderSchema } from "~/constants/types";
import { db } from "~/server/db";
import { chatProviders } from "~/server/services/llm-service";

const requestSchema = z.object({
  chatSessionId: z.string(),
  content: z.string(),
  context: z.array(z.object({
    content: z.string(),
    sender: MessageSenderSchema
  })),
  model: ChatProviderSchema,
  contextFiles: z.array(z.object({
    id: z.string(),
  name: z.string()
  }))
});

const SYSTEM_PROMPT =
`
You are a highly capable and professional research AI assistant.

Your main task is to analyze the input and help the user answer their question or assist them with any problem. The input may include:
- File content the user selected as sources, included in the input as string.
- Message history between you and the user.
- The user's input prompt.

Your personality:
- You are a friendly, warm and helpful assistant. You like to encouragement and try to compliment other when possible without sounding flattery.

You must response the user with these points in mind:
- At the end of your response, ask a follow-up question to see if you could help the user more on solving the problem.
- Before asking a follow-up question, provide the user with some website sources (clickable using markdown) that can help the user with their problem".
- Before providing some website sources to the user, add a header called "Relevant sources" with a search icon in-front.
- Always start the answer by clarifying what the user's problem is and what you are going to do, use a paragraph markdown for this section.
- After clarifying the problem, start your explanation (or main part of your response) with a header with # tag in markdown.
- Divide sub-section of your answer using ## and ### tag.
- For short question that can be answer directly, you might not need headers.
- Always response the user's question as direct, shortest as possible.
- Don't provide unnecessary information, and always make sure you answer the user's question.
- Try to use markdown to make your presentation as clean and structure as possible, icon use on headers are encouraged. 
`


export async function POST(req: NextRequest) {
  try {
    const json: unknown = await req.json();
    const input = requestSchema.parse(json);

    const { chatSessionId, content, context, model, contextFiles } = input;

    const fileIds = contextFiles.map(file => file.id);
    let contextFileContent = "";

    if (contextFiles.length !== 0) {
      const files = await db.file.findMany({
        where: {
          id: { 
            in: fileIds
          }
        },
        select: {
          content: true
        }
      })
      contextFileContent = files.map(f => f.content).join("\n");
    }

    const contextString = JSON.stringify(context);
    const promptWithContext = `The file content extracted to use as a extra source for your answer: ${contextFileContent}. Your message history wiht the user: ${contextString}. User input question: ${content}`;
    
    const result = streamText({
      system: SYSTEM_PROMPT,
      model: chatProviders[model],
      prompt: promptWithContext,
      experimental_transform: smoothStream(),
      async onFinish({ text, response }) {

        console.log("TEXT", text);
        console.log("REPONSE", response)
        
        // persist after stream
        await db.message.create({
          data: {
            chatSessionId: chatSessionId,
            content: text,
            sender: MessageSenderSchema.enum.SYSTEM
          }
        })
      }
    })
  
    const response = new NextResponse(result.textStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
      },
    });

    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Request setup or streaming initiation error' },
      { status: 400 }
    );
  }
}
