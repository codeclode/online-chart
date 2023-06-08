import { Chart } from "./Chart";

export abstract class CommonChart extends Chart<string> {
  columns: string[];
  constructor(
    width: number,
    height: number,
    svg: SVGSVGElement,
    root: SVGGElement
  ) {
    const data = new Map<string, string>();
    data.set("无数据", "Common");
    const { centerX, centerY } = Chart.getCenter(svg, root, width, height);
    super(centerX, centerY, width, height, "", data);
    this.columns = ["key", "value"];
  }
}
