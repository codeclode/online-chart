test("commontest", () => {
  expect((() => {
    let a: number;
    a = 3;
    return a**2
  })()).toBe(9);
});
