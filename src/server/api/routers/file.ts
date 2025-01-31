import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { uploadFileToS3 } from "~/server/services/s3-service";

export const fileRouter = createTRPCRouter({
  uploadFile: protectedProcedure
    .input(z.object({ 
      fileName: z.string(),
      fileSize: z.string(),
      fileType: z.string(),
      fileBuffer: z.instanceof(Uint8Array),
      workspaceId: z.string()
    }))
    .mutation(async ({ input, ctx }) => {
      const { fileName, fileSize, fileType, fileBuffer, workspaceId } = input;
      const buffer = Buffer.from(fileBuffer);

      const newFile = await ctx.db.file.create({
        data: {
          name: fileName,
          size: parseFloat(fileSize),
          type: fileType,
          workspaceId: workspaceId
        }
      })

      const s3Response = await uploadFileToS3(buffer, newFile.id)

      return s3Response;
    }),

  listFileByUserId: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input, ctx }) => {
      const files = await ctx.db.file.findMany({
        where: {
          Workspace: {
            userId: input.userId
          },
        },
      });

      return files;
    }),
})