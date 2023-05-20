import { extent } from "d3";

export function normalize(data: number[]) {
  let [min, max] = extent(data);
  return function (d: number) {
    if (
      typeof min === "number" &&
      typeof max === "number" &&
      Math.abs(max - min) >= 1e-3
    ) {
      return (d - min) / (max - min);
    } else {
      return 0.5;
    }
  };
}
