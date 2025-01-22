import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { getFilesFromS3 } from "~/server/services/s3-service";

export const fileRouter = createTRPCRouter({
  uploadFile: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(({ input }) => {
      return input.userId;
    }),

  getFile: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input }) => {
      const files = await getFilesFromS3(input.userId);
      return files;
    }),
})