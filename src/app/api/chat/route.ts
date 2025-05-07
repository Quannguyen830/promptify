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
  <styling>
  - Use markdown for styling
  - Each response needs to use headings
  - Divide sub-section of your answer using ## and ### tag. Don't skip using headers.
  </styling>

  <follow-up-question>
  - Replace your ending paragraph with the follow-up question. Don't include any one-sentence ending paragraph,
  - At the end of your response, ask a follow-up question that might help the user on their problem.
    + Don't ask anything like the user's opinion, ask question that might seem helpful to solve their problem or directly relevant to their area of interest.
  </follow-up-question>

  <web-source>
  - This is the final section of your response.
  - Start this section by adding a level 2 heading (##) called "Relevant sources" with a search icon infront of the heading, and then provide the list of web sources.
  - Provide the user with some website sources (clickable using markdown) that can help the user with their problem.
  - If possible, don't select random or generic web sources, try to be more specific based on the user's prompt.
  </web-source>

  <reponse-structure>
    1. Always start the answer by directly answer the user's question or tell them how you can solve their problem, then breakdown in detail your reponse. Use a paragraph markdown for this section.
      - Highlight the main keywords of your answer if possible (such as "Yes", "No", or the main keywords). Helping the user to understand your answer in short.
      - Only include 1 paragraph for this intro section.
    2. After the first step, start your explanation (or main part of your response) with a level 1 heading (#) and an icon of your choice. This will be called the main-section
    3. This will be where the follow-up question is asked.
    4. Provide the web sources.
  </reponse-structure>

  <content>
  - Always response the user's question as direct, shortest as possible. Go straight to the problem.
  - Don't provide unnecessary information, and always make sure you answer the user's question.
  - Be decisive when possible.
  - When the user ask for your point of view, try to show them many views with short description of each point.
  </content>
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
    const promptWithContext = `
      The file content extracted to use as a extra source for your answer: ${contextFileContent}. Your message history wiht the user: ${contextString}. User input question: ${content}
    `;
    
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
