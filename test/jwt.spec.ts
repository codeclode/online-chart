import jwt from "jsonwebtoken";
const { sign, verify } = jwt;
const key = "rhy37iu5rh";
let signRet = sign(
  {
    userName: "李傲松",
  },
  key,
  {
    expiresIn: "7200s",
  }
);
let ver = verify(signRet, key);
