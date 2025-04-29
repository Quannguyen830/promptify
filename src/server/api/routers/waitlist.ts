import { createTRPCRouter, publicProcedure } from "../trpc";
import { z } from "zod";

export const waitlistRouter = createTRPCRouter({
  addNewWaiter: publicProcedure
    .input(z.object({
      email: z.string().email()
    }))
    .mutation(async ({ input, ctx }) => {
      return await ctx.db.waitlist.create({
        data: {
          email: input.email
        }
      })
    })
})