import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const folderRouter = createTRPCRouter({
  createNewFolder: protectedProcedure
    .input(z.object({
      workspaceId: z.string(),
      folderName: z.string(),
      workspaceName: z.string()
    }))
    .mutation(async ({ input, ctx }) => {
      const { workspaceId, folderName, workspaceName } = input;

      const newFolder = await ctx.db.folder.create({
        data: {
          name: folderName,
          workspaceId: workspaceId,
          size: 0,
          workspaceName: workspaceName
        }
      })

      const updatedWorkspace = await ctx.db.workspace.update({
        where: {
          id: workspaceId
        },
        data: {
          hasSubfolders: true
        }
      })

      console.log("Successfully update workspace: ", updatedWorkspace.hasSubfolders)
      
      return newFolder.id;
    }),

  listFolderByUserId: protectedProcedure
    .input(z.object({
      userId: z.string()
    }))
    .query(async ({ input, ctx }) => {
      const folders = await ctx.db.folder.findMany({
        where: {
          Workspace: {
            userId: input.userId
          }
        }
      })

      return folders;
    }),

  listFolderByWorkspaceId: protectedProcedure
    .input(z.object({
      workspaceId: z.string()
    }))
    .query(async ({ input, ctx }) => {
      const folders = ctx.db.folder.findMany({
        where: {
          workspaceId: input.workspaceId
        }
      });

      return folders;
    }),
})