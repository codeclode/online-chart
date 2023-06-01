import Crypto from "crypto-js";
const { AES, enc, pad, mode } = Crypto;
const key = enc.Hex.parse("0123456789abcdef0123456789abcdef"); //十六位十六进制数作为密钥
const iv = enc.Hex.parse("abcdef9876543210abcdef9876543210"); //十六位十六进制数作为密钥偏移量
const cusmode = {
  iv,
  mode: mode.CBC,
  padding: pad.Pkcs7,
};

const encodeToken = function (token: string) {
  let wordArray = enc.Utf8.parse(token);
  return wordArray;
};

export function encrypt(word: string) {
  let code = AES.encrypt(encodeToken(word), key, cusmode).toString();
  return code.toString();
}
export function decrypt(code: string) {
  return AES.decrypt(code, key, cusmode).toString(enc.Utf8).toString();
}
