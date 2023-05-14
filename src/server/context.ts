import { inferAsyncReturnType } from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";

export async function createContext(opts: trpcNext.CreateNextContextOptions) {
  const auth = opts.req.headers["authorization"];
  return { auth };
}
export type Context = inferAsyncReturnType<typeof createContext>;
