import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { deleteFileFromS3, uploadFileToS3 } from "~/server/services/s3-service";
import { s3Bucket, s3Client } from "~/config/S3-client";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { contentExtractionTask } from "~/trigger/content-extraction";

export const fileRouter = createTRPCRouter({
  uploadMultipleFiles: protectedProcedure
    .input(z.array(z.object({
      fileName: z.string(),
      fileSize: z.string(),
      fileType: z.string(),
      fileBuffer: z.instanceof(Uint8Array),
      image: z.string().nullable(),
      workspaceId: z.string(),
      folderId: z.string().optional(),
      workspaceName: z.string(),
      folderName: z.string().optional(),
    })))
    .mutation(async ({ input, ctx }) => {
      const results = [];

      for (const file of input) {
        const { fileName, fileSize, fileType, fileBuffer, workspaceId, folderId, workspaceName, folderName } = file;
        const buffer = Buffer.from(fileBuffer);

        const newFile = await ctx.db.file.create({
          data: {
            name: fileName,
            size: parseFloat(fileSize),
            type: fileType,
            image: file.image,
            workspaceId: workspaceId,
            folderId: folderId,
            workspaceName: workspaceName,
            folderName: folderName
          }
        });

        await contentExtractionTask.trigger({
          fileId: newFile.id,
          fileType: fileType,
          fileSize: fileSize,
          fileBuffer: buffer
        })
        await uploadFileToS3(buffer, newFile.id, fileType);
        results.push(newFile);
      }

      return results;
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
          name: true
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
            type: file.type,
            signedUrl: signedUrl,
            workspaceId: file.workspaceId,
            workspaceName: file.workspaceName,
            folderId: file.folderId,
            folderName: file.folderName,
            name: file.name,
            id: file.id
          };
        } else if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
          return {
            message: "Get successful",
            type: file.type,
            signedUrl: signedUrl,
            workspaceId: file.workspaceId,
            workspaceName: file.workspaceName,
            folderId: file.folderId,
            folderName: file.folderName,
            name: file.name,
            id: file.id
          }
        }
      }

      return {
        message: "No content found",
        body: "No content found"
      };
    }),

  updateFileContentByFileId: protectedProcedure
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

      if (file) {
        await uploadFileToS3(buffer, file.id, file.type)

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
      await uploadFileToS3(emptyBuffer, newFile.id, newFile.type);

      return newFile.id;
    }),

  getAllFileNamesWithWorkspace: protectedProcedure
    .query(async ({ ctx }) => {
      return await ctx.db.file.findMany({
        where: {
          Workspace: {
            userId: ctx.session.user.id
          }
        },
        select: {
          id: true,
          name: true,
          workspaceName: true,
        }
      });
    }),

  updateFileByFileId: protectedProcedure
    .input(z.object({
      fileId: z.string(),
      fileName: z.string().optional()
    }))
    .mutation(async ({ input, ctx }) => {
      const { fileId, fileName } = input;

      const updatedFile = await ctx.db.file.update({
        where: {
          id: fileId
        },
        data: {
          name: fileName
        }
      });

      return updatedFile.id;
    })

})