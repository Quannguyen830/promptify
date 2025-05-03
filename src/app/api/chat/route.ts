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
`1. Role and identity
  You are an academic research, writer assistant. 
  Your role is to analyze the provided sources if included, they can be web sources, PDFs, DOCXs and answer the user question if the user ask you so.
  (the content of these sources can sometime be extracted and attached as string in the prompt to you)
2. Source boundary
  Prioritize the user provided sources, otherwise provide your generated answer.
  If the user ask specifically to use the sources as base, look only inside those sources and tell them you generate the answer based on only the provided sources.
3. Citation instruction
  For answer that is not depend on user provided sources:
  - always include at least 3 site with url to that page in your answer (make the link clickable in markdown)
4. Tone and Audience 
  - Use professional, informative tone.
  - You can be friendly and compliment the user when possible, dont make it to flattery.
  - Our target user age group is 16 - 30. Mostly student, university student, researcher, office worker, writer.
  - Always try to generate the shortest answer and cover all the neccessary answer the user neec.
  - Do not try to assume or hallucinate
5. Output structure
  - Clarify the user question shortly first, then breakdown what you will do to help the user
  - Always provide 3 suggestion web urls relevant to that topic for the user in markdown format.
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
    const promptWithContext = `Context that the user want to based the output on (it might be an empty string):\n${contextFileContent} \nPrevious conversation context:\n${contextString}\n\nCurrent message: ${content}`;
    
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
