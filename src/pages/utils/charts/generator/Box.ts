import { Dispatch, SetStateAction } from "react";
import { Chart } from "./Chart";
import { ChartController } from "./Controller";
import {
  HierarchyNode,
  hierarchy,
  select,
  selectAll,
  sum,
  treemap,
  treemapBinary,
} from "d3";
import { data2Percent, normalize } from "../number/util";
import { createSVGElement } from "./util";

export class BoxChart extends Chart<number> {
  columns: string[];
  constructor(
    width: number,
    height: number,
    svg: SVGSVGElement,
    root: SVGGElement,
    colorSet: string,
    data: Map<string, number>,
    dataCloumns: string[]
  ) {
    const { centerX, centerY } = Chart.getCenter(svg, root, width, height);
    super(centerX, centerY, width, height, colorSet, data);
    this.columns = dataCloumns;
  }
  async generateNode(parent: SVGSVGElement | SVGGElement): Promise<boolean> {
    let tree = treemap()
      .size([this.baseWidth, this.baseHeight])
      .tile(treemapBinary);
    const normalizer = data2Percent(Array(...this.data.values()));
    let d = hierarchy({
      name: "null",
      children: Array(...this.data.entries()).map((v) => {
        return {
          name: v[0],
          value: normalizer(v[1]),
        };
      }),
      value: sum(Array(...this.data.values())),
    });
    d.sum((d) => Math.max(0, 1));
    let g = createSVGElement("g");
    let gSelecter = select(g);
    gSelecter
      .attr("transform", `translate(${this.x},${this.y})`)
      .attr("class", "chartContainer");
    gSelecter
      .selectAll("rect")
      .data(tree(d as HierarchyNode<unknown>))
      .enter()
      .append("rect")
      .attr("x", (d) => d.x0)
      .attr("y", (d) => d.y0)
      .attr("width", (d) => d.x1 - d.x0)
      .attr("height", (d) => d.y1 - d.y0)
      .attr("fill", "none")
      .attr("stroke", "black");
    parent.append(g);
    g.addEventListener("click", (e: MouseEvent) => {
      new ChartController(this, parent);
      e.stopPropagation();
    });
    this.node = g;
    return true;
  }
}
