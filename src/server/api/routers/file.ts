import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { extractFileId, listFileFromS3, uploadFileToS3 } from "~/server/services/s3-service";

export const fileRouter = createTRPCRouter({
  uploadFile: protectedProcedure
    .input(z.object({ 
      userId: z.string(),
      fileName: z.string(),
      fileSize: z.string(),
      fileType: z.string(),
      fileBuffer: z.instanceof(Uint8Array),
    }))
    .mutation(async ({ input, ctx }) => {
      const { userId, fileName, fileSize, fileType, fileBuffer } = input;
      const buffer = Buffer.from(fileBuffer);


      const newFileData = {
        name: fileName,
        size: parseFloat(fileSize),
        type: fileType,
      }

      console.log("New file data: ", newFileData);
      const newFile = await ctx.db.file.create({
        data: newFileData
      })

      const s3Response = await uploadFileToS3(buffer, newFile.id, userId)

      return s3Response;
    }),

  listFileByUserId: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input, ctx }) => {
      const files = await listFileFromS3(input.userId);

      console.log(files);
      
      const fileIds = files?.map(file => {
        return extractFileId(file.Key ?? "");
      }).filter((id): id is string => id !== undefined);

      console.log(fileIds);

      const prismaFiles = await ctx.db.file.findMany({
        where: {
          id: {
            in: fileIds,
          },
        },
      });

      return prismaFiles;
    }),
})