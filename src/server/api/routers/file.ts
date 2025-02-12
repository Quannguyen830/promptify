import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { uploadFileToS3 } from "~/server/services/s3-service";
import { GuestUser } from "~/constants/interfaces";

export const fileRouter = createTRPCRouter({
  uploadFile: protectedProcedure
    .input(z.object({ 
      fileName: z.string(),
      fileSize: z.string(),
      fileType: z.string(),
      fileBuffer: z.instanceof(Uint8Array),
      workspaceId: z.string(),
      folderId: z.string().optional(),
      workspaceName: z.string(),
      folderName: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const { fileName, fileSize, fileType, fileBuffer, workspaceId, folderId, workspaceName, folderName } = input;
      const buffer = Buffer.from(fileBuffer);

      const newFile = await ctx.db.file.create({
        data: {
          name: fileName,
          size: parseFloat(fileSize),
          type: fileType,
          workspaceId: workspaceId,
          folderId: folderId,
          workspaceName: workspaceName,
          folderName: folderName
        }
      })

      const s3Response = await uploadFileToS3(buffer, newFile.id)

      return s3Response;
    }),

  listFileByUserId: protectedProcedure
    .query(async ({ ctx }) => {
      const files = await ctx.db.file.findMany({
        where: {
          Workspace: {
            userId: ctx.session.user.id ?? GuestUser.id
          },
        },
      });

      return files;
    }),

  deleteFileByFileId: protectedProcedure
    .input(z.object({ fileId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const removedFile = await ctx.db.file.delete({
        where: {
          id: input.fileId
        }
      })

      return removedFile.name;
    }),

  getFileByFileId: protectedProcedure
    .input(z.object({ fileId: z.string() }))
    .query(async ({ input, ctx }) => {
      const file = await ctx.db.file.findUnique({
        where: {
          id: input.fileId
        }
      })

      return file;
    }),

  updateFileByFileId: protectedProcedure
    .input(z.object({
      fileId: z.string(),
      fileBuffer: z.instanceof(Uint8Array),
    }))
    .mutation(async ({ input, ctx }) => {
      const { fileId, fileBuffer } = input;
      const buffer = Buffer.from(fileBuffer);

      const file = await ctx.db.file.findUnique({
        where: {
          id: fileId
        }
      })


    }), 
})