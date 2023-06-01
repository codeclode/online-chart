import { makeSign, verifier } from "../src/utils/tokenMaker";
test("jwt", () => {
  expect(() => {
    const d= verifier(makeSign("利阿斯"))
    console.log(d);
    return d
  }).not.toBeNull();
});
