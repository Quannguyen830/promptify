import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { getFilesFromS3, uploadFileToS3 } from "~/server/services/s3-service";
import { PrismaClient } from "@prisma/client";
import { type FileModel } from "~/constants/interfaces";

const prisma = new PrismaClient();

export const fileRouter = createTRPCRouter({
  uploadFile: publicProcedure
    .input(z.object({ 
      userId: z.string(),
      fileName: z.string(),
      file: z.instanceof(Buffer),
    }))
    .mutation(async ({ input }) => {
      const { userId, fileName, file } = input;

      await uploadFileToS3(file, fileName, "application/octet-stream");

      try {
        const newFile = await prisma.file.create({
          data: {
            name: fileName,
            size: file.length,
            type: "application/octet-stream",
            workspaceId: userId,
            folderId: "default-folder-id",
          },
        }) as FileModel;

        return newFile;
      } catch (error) {
        console.error("Error creating file:", error);
        throw new Error("Failed to upload file. Please try again.");
      }
    }),

  getFile: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input }) => {
      const files = await getFilesFromS3(input.userId);
      return files;
    }),
})