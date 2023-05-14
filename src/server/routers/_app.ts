import { router } from "../trpc";

import { userRouter } from "./user";
import { postRouter } from "./post";

export const appRouter = router({
  user: userRouter,
  post: postRouter,
});
//mergeRouters(userRouter,postRouter)
export type AppRouter = typeof appRouter;
