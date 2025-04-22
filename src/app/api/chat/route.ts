import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { ChatProviderSchema, MessageSenderSchema } from "~/constants/types";
import { db } from "~/server/db";
import { sendMessageWithContextStreaming } from "~/server/services/llm-service";

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
    const json = req.json();
    const input = requestSchema.parse(json);

    const { content, context, model, contextFiles } = input;

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
    const result = await sendMessageWithContextStreaming(content, context, model, contextFileContent);
    
    return result.toDataStreamResponse();
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Invalid request or streaming error' },
      { status: 400 }
    );
  }
}
