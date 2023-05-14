import { PrismaClient } from "@prisma/client";
import { initTRPC } from "@trpc/server";
import { Context } from "./context";
interface Meta {
  authRequired: boolean;
}
const t = initTRPC.context<Context>().meta<Meta>().create();
export const prisma = new PrismaClient();
export const router = t.router;
export const publicProcedure = t.procedure;
export const middleware = t.middleware;
