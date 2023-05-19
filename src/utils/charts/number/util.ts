import { extent } from "d3";

export function normalize(data: number[]) {
  let [min, max] = extent(data);
  return function (d: number) {
    if (typeof min === "number" && typeof max === "number") {
      return (d - min) / (max - min);
    } else {
      return 0.5;
    }
  };
}
