import { router, publicProcedure, prisma } from "../trpc";
import { array, nullable, number, object, string, z } from "zod";
import {
  ColorNotFoundError,
  PwdNotCorrectOrNoUserError,
  RepeatUserError,
  TokenOverTimeERROR,
} from "../utils/const/errors";
import { encrypt } from "~/utils/encrypt";
import { makeSign, verifier } from "~/utils/tokenMaker";
import { JsonWebTokenError, JwtPayload, TokenExpiredError } from "jsonwebtoken";
import { privateProduce } from "../procedures/privateProduce";
import { User } from "@prisma/client";
export const userRouter = router({
  register: publicProcedure
    .input(
      z.object({
        userName: z.string().min(1).max(16),
        password: z.string().min(1),
      })
    )
    .mutation(async ({ input }) => {
      let user = await prisma.user.findFirst({
        where: {
          username: input.userName,
        },
      });
      if (user) {
        throw new RepeatUserError();
      } else {
        let newUser = await prisma.user.create({
          data: {
            username: input.userName,
            password: encrypt(input.password),
          },
        });
        return newUser;
      }
    }),
  login: publicProcedure
    .input(
      z.object({
        userName: z.string().min(1).max(16),
        password: z.string().min(1),
      })
    )
    .query(async ({ ctx, input }) => {
      let crtpwd = encrypt(input.password);
      let user = await prisma.user.findFirst({
        where: {
          username: input.userName,
          password: crtpwd,
        },
      });
      if (!user) {
        throw new PwdNotCorrectOrNoUserError();
      } else {
        return {
          refreshToken: makeSign(user.username, true),
          token: makeSign(user.username),
        };
      }
    }),
  getTokenWithRefreshToken: publicProcedure
    .input(
      z.object({
        refreshToken: string(),
      })
    )
    .query(async ({ input }) => {
      try {
        let ver: JwtPayload | string = verifier(input.refreshToken, true);
        if (typeof ver === "string") {
          throw new Error("未知错误");
        } else {
          return {
            token: makeSign(ver.userName),
            userName: ver.userName,
          };
        }
      } catch (e: any) {
        if (typeof e === "object" && e instanceof JsonWebTokenError) {
          throw new TokenOverTimeERROR();
        } else {
          throw new Error("未知错误");
        }
      }
    }),
  getUserInfoByToken: privateProduce.query(async ({ ctx }) => {
    let user = await prisma.user.findFirst({
      where: {
        username: ctx.username,
      },
    });
    if (!user) {
      throw new PwdNotCorrectOrNoUserError();
    }
    return {
      ...user,
      password: "1a5wa84r65ae4r89w",
    };
  }),
  getColorPreSetByUserID: privateProduce.query(async ({ ctx }) => {
    let user = await prisma.user.findFirst({
      where: {
        username: ctx.username,
      },
      include: {
        preset: {
          select: {
            name: true,
            id: true,
            positions: true,
          },
        },
      },
    });
    if (!user) {
      throw new PwdNotCorrectOrNoUserError();
    }
    let preset = user.preset.map((v) => {
      return {
        name: v.name,
        id: v.id,
        isGradient: v.positions.length !== 0,
      };
    });
    let retUser = {
      ...user,
      preset,
      password: "1a5wa84r65ae4r89w",
    };
    return retUser;
  }),
  upsertPresetColor: privateProduce
    .input(
      z.object({
        id: nullable(string()),
        name: string().max(20).min(1),
        colors: array(string()),
        positions: nullable(array(number())),
      })
    )
    .mutation(async ({ input, ctx }) => {
      let user = await prisma.user.findFirst({
        where: {
          username: ctx.username,
        },
      });
      if (!user) {
        throw new PwdNotCorrectOrNoUserError();
      } else {
        try {
          let colors = await prisma.colorPreSet.upsert({
            where: {
              id: input.id ? input.id : "eeeea11cd4ff3737900943e9",
            },
            update: {
              name: input.name,
              colors: input.colors,
              positions: input.positions || [],
            },
            create: {
              name: input.name,
              colors: input.colors,
              positions: input.positions || [],
              ownerID: user.id,
            },
          });
          return colors;
        } catch (e) {
          throw new Error();
        }
      }
    }),
  getColorByID: publicProcedure.input(string()).query(async ({ input }) => {
    let colorSet = await prisma.colorPreSet.findFirst({
      where: {
        id: input,
      },
    });
    if (colorSet) {
      return colorSet;
    } else {
      throw new ColorNotFoundError();
    }
  }),
});
