import { select } from "d3";
import { Dispatch, SetStateAction } from "react";
import { Chart } from "./Chart";
import { ChartController } from "./Controller";
import { createSVGElement } from "./util";

export class ArcChart extends Chart {
  cx: number;
  cy: number;
  r: number;
  constructor(cx: number, cy: number, r: number) {
    super(cx - r, cy - r, 2 * r, 2 * r);
    this.cx = cx;
    this.cy = cy;
    this.r = r;
  }

  generateNode(parent: SVGElement) {
    let node = createSVGElement("g");

    select(node)
      .attr("transform", `translate(${this.x},${this.y})`)
      .attr("class", "chartContainer")
      .append("circle")
      .attr("class", "chart")
      .attr("cx", this.r)
      .attr("cy", this.r)
      .attr("r", this.r);
    node.addEventListener("click", () => {
      new ChartController(this, parent);
    });
    this.node = node;
    parent.append(node);
    return true;
  }
}
