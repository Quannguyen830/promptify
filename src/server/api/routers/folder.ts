import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { GuestUser } from "~/constants/interfaces";

export const folderRouter = createTRPCRouter({
  createNewFolder: protectedProcedure
    .input(z.object({
      workspaceId: z.string(),
      name: z.string(),
      workspaceName: z.string(),
      parentsFolderId: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const { workspaceId, name, workspaceName, parentsFolderId } = input;

      console.log("Input: ", input)

      const newFolder = await ctx.db.folder.create({
        data: {
          name: name,
          workspaceId: workspaceId,
          size: 0,
          workspaceName: workspaceName,
          parentFolderId: parentsFolderId
        }
      })

      if(parentsFolderId) {
        await ctx.db.folder.update({
          where: {
            id: parentsFolderId
          },
          data: {
            hasSubfolders: true
          }
        })
      }

      await ctx.db.workspace.update({
        where: {
          id: workspaceId
        },
        data: {
          hasSubfolders: true
        }
      })
      
      return newFolder.id;
    }),

  listFolderByUserId: protectedProcedure
    .query(async ({ ctx }) => {
      const folders = await ctx.db.folder.findMany({
        where: {
          Workspace: {
            userId: ctx.session.user.id ?? GuestUser.id
          }
        }
      })

      return folders;
    }),

  listRootFoldersByWorkspaceId: protectedProcedure
    .input(z.object({
      workspaceId: z.string()
    }))
    .query(async ({ input, ctx }) => {
      const folders = await ctx.db.folder.findMany({
        where: {
          workspaceId: input.workspaceId,
          parentFolderId: null
        }
      });

      return folders;
    }),

  listFolderByParentsFolderId: protectedProcedure
    .input(z.object({
      parentsFolderId: z.string()
    }))
    .query(({ input, ctx }) => {
      const folders = ctx.db.folder.findMany({
        where: {
          parentFolderId: input.parentsFolderId
        }
      })

      return folders;
    }),

  deleteFolderByFolderId: protectedProcedure
    .input(z.object({ folderId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const removedFolder = await ctx.db.folder.delete({
        where: {
          id: input.folderId
        }
      })

      return removedFolder.name;
    }),

  getFolderContentByFolderId: protectedProcedure
    .input(z.object({ folderId: z.string() }))
    .query(async ({ input, ctx }) => {
      const folder = await ctx.db.folder.findUnique({
        where: {
          id: input.folderId
        },
        include: {
          subfolders: true,
          files: true,
        }
      });

      return folder;
    })
})