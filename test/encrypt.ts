import Crypto from "crypto-js";
const { AES, enc, pad, mode } = Crypto;
const key = enc.Utf8.parse("1234123412ABCDEF"); //十六位十六进制数作为密钥
const iv = enc.Utf8.parse("ABCDEF1234123412"); //十六位十六进制数作为密钥偏移量
const cusmode = {
  iv,
  mode: mode.CBC,
  padding: pad.Pkcs7,
};
let code = AES.encrypt(
  enc.Utf8.parse("123456123lll"),
  key,
  cusmode
).ciphertext.toString(enc.Base64);
console.log(code);
console.log("----------");
console.log(AES.decrypt(code, key, cusmode).toString(enc.Utf8).toString());
