import { verifier } from "~/utils/tokenMaker";
import { middleware } from "../trpc";
import { CommenTokenOverTimeError } from "../utils/const/errors";

export const auth = middleware(({ ctx, next }) => {
  try {
    if (ctx.auth) {
      let ver = verifier(ctx.auth);
      if (typeof ver === "string") {
        return next({
          ctx: {
            username: ver,
          },
        });
      } else {
        return next({
          ctx: {
            username: ver.userName,
          },
        });
      }
    }
  } catch (e) {
    throw new CommenTokenOverTimeError();
  }
  throw new CommenTokenOverTimeError();
});
