import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { deleteFileFromS3, uploadFileToS3 } from "~/server/services/s3-service";
import { s3Bucket, s3Client } from "~/config/S3-client";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

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

      await uploadFileToS3(buffer, newFile.id)

      return newFile.id;
    }),

  deleteFileByFileId: protectedProcedure
    .input(z.object({ fileId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const removedFile = await ctx.db.file.delete({
        where: {
          id: input.fileId
        }
      })

      await deleteFileFromS3(removedFile.id)

      return removedFile.name;
    }),

  getFileByFileId: protectedProcedure
    .input(z.object({ fileId: z.string() }))
    .query(async ({ input, ctx }) => {
      const file = await ctx.db.file.findUnique({
        where: {
          id: input.fileId
        },
        select: {
          id: true,
          type: true,
          workspaceId: true,
          workspaceName: true,
          folderId: true,
          folderName: true,
        }
      })

      if (!file) {
        throw new Error("File not found");
      }

      const getParam = {
        Bucket: s3Bucket,
        Key: input.fileId
      };

      const result = await s3Client.send(new GetObjectCommand(getParam));    
      const signedUrl = await getSignedUrl(s3Client, new GetObjectCommand(getParam), { expiresIn: 24 * 60 * 60 });

      if (result.Body) {
        if (file.type === "application/pdf") {
          return { 
            message: "Get successful", 
            type: 'pdf',
            signedUrl: signedUrl,
            workspaceId: file.workspaceId,
            workspaceName: file.workspaceName,
            folderId: file.folderId,
            folderName: file.folderName
          };
        } else if(file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
          return {
            message: "Get successful",
            type: "docx",
            signedUrl: signedUrl,
            workspaceId: file.workspaceId,
            workspaceName: file.workspaceName,
            folderId: file.folderId,
            folderName: file.folderName
          }
        }
      }

      return { 
        message: "No content found", 
        body: "No content found" 
      };
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

      if(file) {
        await uploadFileToS3(buffer, file.id)

        return file.id;
      }

      return null;
    }),

  createEmptyFile: protectedProcedure
    .input(z.object({ 
      workspaceId: z.string(),
      folderId: z.string().optional(),
      workspaceName: z.string(),
      folderName: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const { workspaceId, folderId, workspaceName, folderName } = input;
      
      const newFile = await ctx.db.file.create({
        data: {
          name: "Untitled Document.docx",
          size: 0,
          type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          workspaceId: workspaceId,
          folderId: folderId,
          workspaceName: workspaceName,
          folderName: folderName
        }
      });

      const emptyBuffer = Buffer.from("");
      await uploadFileToS3(emptyBuffer, newFile.id);

      return newFile.id;
    }),
})