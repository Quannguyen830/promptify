import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { uploadFileToS3 } from "~/server/services/s3-service";
import { GuestUser } from "~/constants/interfaces";
import { s3Bucket, s3Client } from "~/config/S3-client";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Bucket, s3Client } from "~/config/S3-client";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const fileRouter = createTRPCRouter({
  uploadFile: protectedProcedure
    .input(z.object({ 
      fileName: z.string(),
      fileSize: z.string(),
      fileType: z.string(), 
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

      const getParam = {
        Bucket: s3Bucket,
        Key: input.fileId
      };

      const result = await s3Client.send(new GetObjectCommand(getParam));    
      const signedUrl = await getSignedUrl(s3Client, new GetObjectCommand(getParam), { expiresIn: 3600 });

      if (result.Body) {
        if (file?.type == "application/pdf") {
          const buffer = await result.Body.transformToByteArray(); 

          return { 
            message: "Get successful", 
            body: buffer.toString(),
            type: 'application/pdf',
            signedUrl: signedUrl
          };
        } else if(file?.type == "text/plain") {
          const bodyContents = await result.Body.transformToString();
          return { 
            message: "Get successful", 
            body: bodyContents,
            type: "text/plain"
          } 
        } else if(file?.type == "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
          const buffer = await result.Body.transformToByteArray();

          return {
            message: "Get successful",
            body: buffer,
            type: "application/docx",
            signedUrl: signedUrl
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
        const s3Response = await uploadFileToS3(buffer, file.id)

        return s3Response;
      }

      return null;
    }), 
})