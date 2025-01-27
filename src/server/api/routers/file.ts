import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { listFileFromS3, uploadFileToS3 } from "~/server/services/s3-service";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const fileRouter = createTRPCRouter({
  uploadFile: protectedProcedure
    .input(z.object({ 
      userId: z.string(),
      fileName: z.string(),
      fileSize: z.string(),
      fileType: z.string(),
      fileBuffer: z.instanceof(Uint8Array),
    }))
    .mutation(async ({ input }) => {
      const { userId, fileName, fileSize, fileType, fileBuffer } = input;
      const buffer = Buffer.from(fileBuffer);


      const newFileData = {
        name: fileName,
        size: parseFloat(fileSize),
        type: fileType,
      }

      console.log("New file data: ", newFileData);
      const newFile = await prisma.file.create({
        data: newFileData
      })

      const s3Response = await uploadFileToS3(buffer, newFile.id, userId)

      return s3Response;
    }),

  listFileByUserId: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input }) => {
      const files = await listFileFromS3(input.userId);
      
      console.log(files);
      return files;
    }),
})