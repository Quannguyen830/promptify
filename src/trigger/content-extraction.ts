/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */


import { extractRawText } from 'mammoth';

import { schemaTask } from "@trigger.dev/sdk/v3";
import { db } from "~/server/db";
import { z } from "zod";

const FILE_SIZE_BYTE_LIMIT=10000000 

export const contentExtractionTask = schemaTask({
  id: "content-extraction",
  schema: z.object({
    fileId: z.string(),
    fileType: z.string(),
    fileSize: z.string(),
    fileBuffer: z.instanceof(Uint8Array)
  }),
  run: async (payload) => {
    try {
      let extractedContent = "";
    
      switch (payload.fileType) {
        case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
          extractedContent = await extractTextFromDocx(payload.fileBuffer);
        case "application/pdf":
          // extractedContent = await extractTextFromPdf(payload.fileBuffer);     
      }

      // Upload content to Supabase
      if (parseFloat(payload.fileSize) < FILE_SIZE_BYTE_LIMIT) {
        await db.file.update({
          where: {
            id: payload.fileId
          },
          data: {
            content: extractedContent
          }
        })
      } else {
        // Upload to vector db implementation here
      }
      
      return {
        message: "helo"
      }
    } catch (error) {
      console.error("An error occured in contentExtractionTask", error);
    }
  }
})


// async function extractTextFromPdf(pdfData: Uint8Array): Promise<string> {
//   const buffer = Buffer.from(pdfData);

//   const data = await pdfParse(buffer);

//   return data.text.trim();
// }

async function extractTextFromDocx(docxData: Uint8Array): Promise<string> {
  const buffer = Buffer.from(docxData);

  const { value } = await extractRawText({ buffer });
  return value;
}

