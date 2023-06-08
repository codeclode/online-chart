import { select } from "d3";
import { CommonChart } from "../Common";
import { createSVGElement } from "../util";
import { ChartController } from "../Controller";

export class CircleCommonChart extends CommonChart {
  constructor(r: number, svg: SVGSVGElement, root: SVGGElement) {
    super(2 * r, 2 * r, svg, root);
  }
  async generateNode(parent: SVGSVGElement | SVGGElement): Promise<boolean> {
    const circle = createSVGElement("circle");
    const g = createSVGElement("g");
    const dG = select(g);
    const dCircle = select(circle);
    const r = this.baseHeight/2
    dG.attr("transform", `translate(${this.x},${this.y})`).attr(
      "class",
      "chartContainer"
    );
    dCircle
      .attr("r", r)
      .attr('cx',r)
      .attr('cy',r)
      .attr("stroke-width", "0.5")
      .attr("stroke", "black")
      .attr("fill", "none");
    g.appendChild(circle);
    g.addEventListener("click", (e: MouseEvent) => {
      new ChartController(this, parent);
      e.stopPropagation();
    });
    parent.appendChild(g);
    this.node = g;
    return true;
  }
}
