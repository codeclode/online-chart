import { select } from "d3";
import { Chart } from "./Chart";
import { ChartController } from "./Controller";
import { createSVGElement } from "./util";

export class SvgInputChart extends Chart<any> {
  columns: string[];
  svg: SVGSVGElement;
  tx: number;
  ty: number;
  tscale: number;
  async generateNode(parent: SVGSVGElement | SVGGElement): Promise<boolean> {
    const g = createSVGElement("g");
    const dg = select(g);
    const xg = createSVGElement("g");
    select(xg).attr(
      "transform",
      `scale(${this.tscale}) translate(${-this.tx},${-this.ty})`
    );
    dg.attr("transform", `translate(${this.x},${this.y})`).attr(
      "class",
      "chartContainer"
    );
    xg.innerHTML = this.svg.innerHTML;
    g.append(xg);
    g.addEventListener("click", (e: MouseEvent) => {
      new ChartController(this, parent);
      e.stopPropagation();
    });
    parent.append(g);
    this.node = g;
    return true;
  }
  constructor(svg: SVGSVGElement, root: SVGGElement, inputSVG: SVGSVGElement) {
    const data = new Map<string, string>();
    data.set("无数据", "inputSVG");
    const g = createSVGElement("g");
    g.innerHTML = inputSVG.innerHTML;
    g.style.display = "none";
    root.append(g);
    const { width, height, x, y } = g.getBBox();
    const scale = 30 / Math.min(width, height);
    root.removeChild(g);
    const { centerX, centerY } = Chart.getCenter(
      svg,
      root,
      width * scale,
      height * scale
    );
    super(centerX, centerY, width * scale, height * scale, "", data);
    this.columns = ["key", "value"];
    this.tx = x;
    this.ty = y;
    this.svg = inputSVG;
    this.tscale = scale;
  }
}
