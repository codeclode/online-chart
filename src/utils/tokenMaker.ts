import jwt, { JwtPayload } from "jsonwebtoken";
const { sign, verify } = jwt;
const jwtKey = "rhy37iu5rh";
const refreshKey = "RWTJWF510227";
export function makeSign(user: string, isRefresh = false) {
  return sign({ userName: user }, isRefresh ? refreshKey : jwtKey, {
    expiresIn: isRefresh ? "7d" : "2h",
  });
}
export function verifier(sign: string, isRefresh = false): string | JwtPayload {
  let ver = verify(sign, isRefresh ? refreshKey : jwtKey);
  return ver;
}
