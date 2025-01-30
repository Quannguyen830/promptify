import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { extractFileId, listFileFromS3, uploadFileToS3 } from "~/server/services/s3-service";

export const fileRouter = createTRPCRouter({
  uploadFile: protectedProcedure
    .input(z.object({ 
      fileName: z.string(),
      fileSize: z.string(),
      fileType: z.string(),
      fileBuffer: z.instanceof(Uint8Array),
    }))
    .mutation(async ({ input, ctx }) => {
      const { fileName, fileSize, fileType, fileBuffer } = input;
      const buffer = Buffer.from(fileBuffer);

      const newFile = await ctx.db.file.create({
        data: {
          name: fileName,
          size: parseFloat(fileSize),
          type: fileType,
          workspaceId: "cm6j9s9i40006gbpn9h7nh796"
        }
      })

      const s3Response = await uploadFileToS3(buffer, newFile.id)

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