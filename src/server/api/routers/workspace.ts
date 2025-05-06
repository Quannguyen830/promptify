import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { GuestUser } from "~/constants/interfaces";

export const workspaceRouter = createTRPCRouter({
  createNewWorkspace: protectedProcedure
    .input(z.object({
      workspaceName: z.string(),
    }))
    .mutation(async ({ input, ctx }) => {
      const { workspaceName } = input;

      const newWorkspace = await ctx.db.workspace.create({
        data: { 
          userId: ctx.session.user.id,
          name: workspaceName,
        }
      });

      return newWorkspace.id;
    }),

  listWorkspaceByUserId: protectedProcedure
    .query(async ({ ctx }) => {
      const workspaces = await ctx.db.workspace.findMany({
        where: {
          userId: ctx.session.user.id ?? GuestUser.id
        },
        include: {
          files: true,
          folders: {
            include: {
              files: true,
              subfolders: true
            }
          }
        }
      })

      return workspaces;
    }),
  
  deleteWorkspaceByWorkspaceId: protectedProcedure
    .input(z.object({ workspaceId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const removedWorkspace = await ctx.db.workspace.delete({
        where: {
          id: input.workspaceId
        }
      })

      return removedWorkspace.name;
    }),

  getWorkspaceByWorkspaceId: protectedProcedure
    .input(z.object({ workspaceId: z.string() }))
    .query(async ({ input, ctx }) => {
      const workspace = await ctx.db.workspace.findUnique({
        where: {
          id: input.workspaceId
        },
        include: {
          files: true,
          folders: {
            include: {
              files: true
            }
          }
        }
      })

      return workspace;
    }),

  updateWorkspaceByWorkspaceId: protectedProcedure
    .input(z.object({
      workspaceId: z.string(),
      workspaceName: z.string().optional()
    }))
    .mutation(async ({ input, ctx }) => {
      const { workspaceId, workspaceName } = input;

      const updatedWorkspace = await ctx.db.workspace.update({
        where: {
          id: workspaceId
        },
        data: {
          name: workspaceName
        }
      });

      return updatedWorkspace.id;
    })
})