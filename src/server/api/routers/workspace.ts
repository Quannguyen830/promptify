import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const workspaceRouter = createTRPCRouter({
  createNewWorkspace: protectedProcedure
    .input(z.object({
      userId: z.string(),
      workspaceName: z.string()
    }))
    .mutation(async ({ input, ctx }) => {
      const { userId, workspaceName } = input;

      const newWorkspace = await ctx.db.workspace.create({
        data: {
          userId: userId,
          name: workspaceName,
        }
      });

      return newWorkspace.id;
    }),

  listWorkspaceByUserId: protectedProcedure
    .input(z.object({
      userId: z.string()
    }))
    .query(async ({ input, ctx }) => {
      const workspaces = await ctx.db.workspace.findMany({
        where: {
          userId: input.userId
        }
      })

      return workspaces;
    }),
  
  deleteWorkspaceByWorkspaceId: protectedProcedure
    .input(z.object({ workspaceId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const removedWorkspace = await ctx.db.folder.delete({
        where: {
          id: input.workspaceId
        }
      })

      return removedWorkspace.name;
    })
})