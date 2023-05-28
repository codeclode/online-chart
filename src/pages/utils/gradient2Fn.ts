import { scaleLinear } from "d3";
import { gradientStop } from "~/components/inputComponent/gradientPicker";

export function gradient2f(colorSet: gradientStop[]) {
  if (colorSet.length === 0) return () => "rgb(0,0,0)";
  colorSet.sort((a, b) => a.position - b.position);
  let n = colorSet.length;
  if (colorSet[0]!.position !== 0) {
    colorSet.unshift({
      position: 0,
      color: colorSet[0]!.color,
    });
  }
  if (colorSet[n - 1]!.position !== 100) {
    colorSet.push({
      position: 100,
      color: colorSet[n - 1]!.color,
    });
  }
  let colors = colorSet.map((v) => v.color);
  let skips = colorSet.map((v) => v.position / 100);
  return scaleLinear<string, string, string>().domain(skips).range(colors);
}