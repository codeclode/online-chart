import { auth } from "../middleware/Auth";
import { publicProcedure } from "../trpc";

export const privateProduce = publicProcedure.use(auth);
