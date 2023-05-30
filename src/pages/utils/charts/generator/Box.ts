import { Chart } from "./Chart";
import { ChartController } from "./Controller";
import {
  HierarchyNode,
  hierarchy,
  select,
  sum,
  treemap,
  treemapBinary,
  treemapDice,
  treemapSquarify,
} from "d3";
import { data2Percent } from "../number/util";
import { createSVGElement, getColor, getColorSet, getTextColor } from "./util";
import { darken } from "@mui/material";

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
      .tile(treemapSquarify)
      .padding(0.1);
    const normalizer = data2Percent(Array(...this.data.values()));
    let d = hierarchy({
      name: "null",
      children: Array(...this.data.entries()).map((v) => {
        return {
          name: v[0],
          value: normalizer(v[1]),
          sourceValue: v[1],
        };
      }),
      value: 0,
    });
    d.sum((d) => Math.abs(d.value));
    let g = createSVGElement("g");
    let gSelecter = select(g);
    const colorSet = await getColorSet(this.colorSet);
    gSelecter
      .attr("transform", `translate(${this.x},${this.y})`)
      .attr("class", "chartContainer");
    const nodes = gSelecter
      .selectAll("g")
      .data(tree(d as HierarchyNode<unknown>))
      .enter()
      .append("g");

    nodes
      .append("rect")
      .attr("x", (d) => d.x0)
      .attr("y", (d) => d.y0)
      .attr("width", (d) => d.x1 - d.x0)
      .attr("height", (d) => d.y1 - d.y0)
      .attr("fill", (d, i) =>
        i !== 0 ? getColor(colorSet, i, d.value || 0) : "transparent"
      );
    const time = Date.now();

    nodes
      .append("clipPath")
      .attr("id", (d, i) => `${time}-clip-${i}`)
      .append("rect")
      .attr("x", (d) => d.x0)
      .attr("y", (d) => d.y0)
      .attr("width", (d) => d.x1 - d.x0)
      .attr("height", (d) => d.y1 - d.y0);

    const textNodes = nodes.append("text");
    textNodes
      .append("tspan")
      .attr("clip-path", (d, i) => `url(#${time}-clip-${i})`)
      .text((d) => {
        const data = d.data as {
          name: string;
          value: number;
          sourceValue: number;
        };
        if (data.name == undefined || d.value === 1) return "";
        else {
          return data.name;
        }
      })
      .attr("x", (d) => d.x0)
      .attr("y", (d) => d.y0 + Math.min(d.x1 - d.x0, d.y1 - d.y0) / 4)
      .attr("fill", (d, i) =>
        getTextColor(colorSet, i, d.value || 0, (x: number) => x)
      )
      .attr("font-size", (d) => {
        return Math.min(d.x1 - d.x0, d.y1 - d.y0) / 4;
      });

    textNodes
      .append("tspan")
      .attr("clip-path", (d, i) => `url(#${time}-clip-${i})`)
      .text((d) => {
        const data = d.data as {
          name: string;
          value: number;
          sourceValue: number;
        };
        if (data.name == undefined || d.value === 1) return "";
        else {
          return  data.sourceValue;
        }
      })
      .attr("x", (d) => d.x0)
      .attr("y", (d) => d.y0 + (3 * Math.min(d.x1 - d.x0, d.y1 - d.y0)) / 8)
      .attr("fill", (d, i) =>
        getTextColor(colorSet, i, d.value || 0, (x: number) => x)
      )
      .attr("font-size", (d) => {
        return Math.min(d.x1 - d.x0, d.y1 - d.y0) / 8;
      });
    parent.append(g);
    g.addEventListener("click", (e: MouseEvent) => {
      new ChartController(this, parent);
      e.stopPropagation();
    });
    this.node = g;
    return true;
  }
}
