import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { fileRouter } from "./routers/file";
import { ChatRouter } from "./routers/chat";
import { workspaceRouter } from "./routers/workspace";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  file: fileRouter,
  chat: ChatRouter,
  workspace: workspaceRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
