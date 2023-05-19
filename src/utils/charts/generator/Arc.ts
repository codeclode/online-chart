import {
  arc,
  extent,
  interpolateTurbo,
  pie,
  schemeCategory10,
  select,
} from "d3";
import { Dispatch, SetStateAction } from "react";
import { normalize } from "../number/util";
import { Chart } from "./Chart";
import { ChartController } from "./Controller";
import { colorCategorical, createSVGElement, getColor } from "./util";
import * as schemes from "d3-scale-chromatic";

export class ArcChart extends Chart {
  innerRadius: number;
  outerRadius: number;
  constructor(
    innerRadius: number,
    outerRadius: number,
    svg: SVGSVGElement,
    root: SVGGElement,
    colorSet: keyof typeof schemes
  ) {
    const { centerX, centerY } = Chart.getCenter(
      svg,
      root,
      2 * outerRadius,
      2 * outerRadius
    );
    super(centerX, centerY, 2 * outerRadius, 2 * outerRadius, colorSet);
    this.innerRadius = innerRadius;
    this.outerRadius = outerRadius;
  }

  generateNode(parent: SVGElement) {
    let node = createSVGElement("g");
    const newArc = arc();

    const pieFn = pie().padAngle(0);
    let data = [10, 11, 22, 30, 50, 80, 130];
    let normalizer = normalize(data);
    let arcs = pieFn(data);

    select(node)
      .attr("transform", `translate(${this.x},${this.y})`)
      .attr("class", "chartContainer")
      .append("g")
      .attr("transform", `translate(${this.outerRadius},${this.outerRadius})`)
      .selectAll("path")
      .data(arcs)
      .enter()
      .append("path")
      .attr("d", (d) =>
        newArc({
          startAngle: d.startAngle,
          endAngle: d.endAngle,
          innerRadius: this.innerRadius,
          outerRadius: this.outerRadius,
        })
      )
      .attr("fill", (d) => {
        return getColor(this.colorSet, d.index, normalizer(d.value));
      });

    node.addEventListener("click", (e: MouseEvent) => {
      new ChartController(this, parent);
      e.stopPropagation();
    });
    this.node = node;
    parent.append(node);
    return true;
  }
}
