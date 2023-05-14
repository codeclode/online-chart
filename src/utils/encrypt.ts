import Crypto from "crypto-js";
const { AES, enc, pad, mode } = Crypto;
const key = enc.Utf8.parse("13853849013ACD"); //十六位十六进制数作为密钥
const iv = enc.Utf8.parse("19591318465EFF"); //十六位十六进制数作为密钥偏移量
const cusmode = {
  iv,
  mode: mode.CBC,
  padding: pad.Pkcs7,
};
export function encrypt(word: string) {
  let code = AES.encrypt(
    enc.Utf8.parse(word),
    key,
    cusmode
  ).ciphertext.toString(enc.Base64);
  return code;
}
export function decrypt(code: string) {
  return AES.decrypt(code, key, cusmode).toString(enc.Utf8).toString();
}
