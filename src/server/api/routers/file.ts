import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { getFilesFromS3, uploadFileToS3 } from "~/server/services/s3-service";
import { PrismaClient } from "@prisma/client";
import { type FileModel } from "~/interface";

const prisma = new PrismaClient();

export const fileRouter = createTRPCRouter({
  uploadFile: protectedProcedure
    .input(z.object({ 
      userId: z.string(),
      fileName: z.string(),
      fileSize: z.string(),
      fileType: z.string(),
    }))
    .mutation(async ({ input }) => {
      const { fileName, fileSize, fileType, } = input;

      const newFileData = {
        name: fileName,
        size: parseFloat(fileSize),
        type: fileType,
      }

      console.log("New file data: ", newFileData);
      const newFile = prisma.file.create({
        data: newFileData
      })

      return newFile.id;

      // try {

      //   return newFile.id;
      // } catch (error) {
      //   if (error instanceof Error) {
      //     console.error("Error creating file:", error);
      //   } else {
      //     console.error("Unknown error occurred:", error);
      //   }
      //   throw new Error("Failed to upload file. Please try again.");
      // }
    }),

  getFile: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input }) => {
      const files = await getFilesFromS3(input.userId);
      return files;
    }),
})