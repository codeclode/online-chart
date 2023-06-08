import { select } from "d3";
import { CommonChart } from "../Common";
import { createSVGElement } from "../util";
import { ChartController } from "../Controller";

export class RectCommonChart extends CommonChart {
  constructor(
    width: number,
    height: number,
    svg: SVGSVGElement,
    root: SVGGElement
  ) {
    super(width - 1, height - 1, svg, root);
  }
  async generateNode(parent: SVGSVGElement | SVGGElement): Promise<boolean> {
    const rect = createSVGElement("rect");
    const g = createSVGElement("g");
    const dG = select(g);
    const dRect = select(rect);
    dG.attr("transform", `translate(${this.x},${this.y})`).attr(
      "class",
      "chartContainer"
    );
    dRect
      .attr("width", this.baseWidth)
      .attr("height", this.baseHeight)
      .attr("stroke-width", "0.5")
      .attr("stroke", "black")
      .attr("fill", "none");
    g.appendChild(rect);
    g.addEventListener("click", (e: MouseEvent) => {
      new ChartController(this, parent);
      e.stopPropagation();
    });
    parent.appendChild(g);
    this.node = g;
    return true;
  }
}
