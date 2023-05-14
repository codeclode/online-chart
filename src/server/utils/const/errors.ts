import { TRPCError } from "@trpc/server";

export class RepeatUserError extends TRPCError {
  constructor() {
    super({
      message: RepeatUserError.messageString,
      code: "BAD_REQUEST",
    });
  }
  static messageString = "USER_REPEAT";
}
export class PwdNotCorrectOrNoUserError extends TRPCError {
  constructor() {
    super({
      message: PwdNotCorrectOrNoUserError.messageString,
      code: "BAD_REQUEST",
    });
  }
  static messageString = "PWD_INCORRECT_OR_NOUSER";
}

export class TokenOverTimeERROR extends TRPCError {
  constructor() {
    super({
      message: TokenOverTimeERROR.messageString,
      code: "UNAUTHORIZED",
    });
  }
  static messageString = "TOKEN_OVERTIME";
}

export class CommenTokenOverTimeError extends TRPCError {
  constructor() {
    super({
      message: CommenTokenOverTimeError.messageString,
      code: "UNAUTHORIZED",
    });
  }
  static messageString = "COMMEN_TOKEN_OVERTIME";
}
