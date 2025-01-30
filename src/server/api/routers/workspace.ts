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
    })

})