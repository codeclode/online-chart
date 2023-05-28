import { arc, pie, select } from "d3";
import { normalize } from "../number/util";
import { Chart } from "./Chart";
import { ChartController } from "./Controller";
import { createSVGElement, getColor, getColorSet } from "./util";
import * as schemes from "d3-scale-chromatic";

export class ArcChart extends Chart<number> {
  innerRadius: number;
  outerRadius: number;
  columns: string[];
  constructor(
    innerRadius: number,
    outerRadius: number,
    svg: SVGSVGElement,
    root: SVGGElement,
    colorSet: string,
    data: Map<string, number>,
    dataCloumns: string[]
  ) {
    const { centerX, centerY } = Chart.getCenter(
      svg,
      root,
      2 * outerRadius,
      2 * outerRadius
    );
    super(centerX, centerY, 2 * outerRadius, 2 * outerRadius, colorSet, data);
    this.innerRadius = innerRadius;
    this.outerRadius = outerRadius;
    this.columns = dataCloumns;
  }

  async generateNode(parent: SVGElement) {
    let node = createSVGElement("g");
    const newArc = arc();
    const pieFn = pie().padAngle(0);

    let v = Array.from(this.data.values());
    let k = Array.from(this.data.keys());
    let normalizer = normalize(v);
    let arcs = pieFn(v);
    let innerG = select(node)
      .attr("transform", `translate(${this.x},${this.y})`)
      .attr("class", "chartContainer")
      .append("g")
      .attr("transform", `translate(${this.outerRadius},${this.outerRadius})`);
    const colorSet = await getColorSet(this.colorSet);
    innerG
      .selectAll(".arc")
      .data(arcs)
      .enter()
      .append("path")
      .attr("class", "arc")
      .attr("d", (d) =>
        newArc({
          startAngle: d.startAngle,
          endAngle: d.endAngle,
          innerRadius: this.innerRadius,
          outerRadius: this.outerRadius,
        })
      )
      .attr("fill", (d) => {
        let color = getColor(colorSet, d.index, normalizer(d.value));
        this.colorMap.set(k[d.index] as string, color);
        return getColor(colorSet, d.index, normalizer(d.value));
      });

    innerG
      .selectAll(".label")
      .data(arcs)
      .enter()
      .append("text")
      .text((d) => {
        return k[d.index] || "";
      })
      .attr("class", "label")
      .attr("fill", (d) => {
        return getColor(colorSet, d.index + 5, 1 - normalizer(d.value));
      })
      .attr("text-anchor", "middle")
      .attr("font-size", (this.outerRadius - this.innerRadius) / 3)
      .attr("transform", (d) => {
        let [x, y] = newArc.centroid({
          startAngle: d.startAngle,
          endAngle: d.endAngle,
          innerRadius: this.innerRadius,
          outerRadius: this.outerRadius,
        });
        return `translate(${x},${y})`;
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
