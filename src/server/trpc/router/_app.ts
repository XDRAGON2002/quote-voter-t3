import { router } from "../trpc";
import { authRouter } from "./auth";
import {quoteRouter} from "./quote"

export const appRouter = router({
  auth: authRouter,
  quote: quoteRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
