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
    const promptWithContext = `Context that the user want to based the output on:\n${contextFileContent} \nPrevious conversation context:\n${contextString}\n\nCurrent message: ${content}`;
    const result = streamText({
      model: chatProviders[model],
      prompt: promptWithContext,
      experimental_transform: smoothStream(),
      async onFinish({ text, response }) {

        console.log("TEXT", text);
        console.log("REPONSE", response)
        
        await db.message.create({
          data: {
            chatSessionId: chatSessionId,
            content: text,
            sender: MessageSenderSchema.enum.SYSTEM
          }
        })
      }
    })

    return result.toDataStreamResponse();
  
    // const response = new NextResponse(textStream, {
    //   headers: {
    //     'Content-Type': 'text/event-stream',
    //     'Cache-Control': 'no-cache',
    //     'Connection': 'keep-alive'
    //   },
    // });

    // return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Request setup or streaming initiation error' },
      { status: 400 }
    );
  }
}
