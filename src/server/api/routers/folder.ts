import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const folderRoute = createTRPCRouter({
  createNewFolder: protectedProcedure
    .input(z.object({
      workspaceId: z.string(),
      folderName: z.string()
    }))
    .mutation(({ input, ctx }) => {
      const { workspaceId, folderName } = input;
      
      return "";
    })

})