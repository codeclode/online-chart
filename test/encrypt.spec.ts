import { decrypt } from "../src/utils/encrypt";
import { encrypt } from "../src/utils/encrypt";

const randomStrings = new Array(10).fill(1).map((v) => {
  return Math.random().toString();
});
test("encrypt", () => {
  randomStrings.forEach((v) => {
    expect(
      ((v: string) => {
        const e = encrypt(v);
        const d = decrypt(e);
        return d;
      })(v)
    ).toBe(v);
  });
});
