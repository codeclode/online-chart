import jwt, { JwtPayload } from "jsonwebtoken";
const { sign, verify } = jwt;
const jwtKey = "rhy37iu5rh";
const refreshKey = "RWTJWF510227";
export function makeSign(user: string, isRefresh: boolean = false) {
  return sign({ user }, isRefresh ? refreshKey : jwtKey, {
    expiresIn: isRefresh ? "7d" : "2h",
  });
}
export function verifier(
  sign: string,
  isRefresh: boolean = false
): string | JwtPayload {
  try {
    let ver = verify(sign, isRefresh ? refreshKey : jwtKey);
    return ver;
  } catch (e) {
    throw e;
  }
}
