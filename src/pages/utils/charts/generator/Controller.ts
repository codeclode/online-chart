import { D3DragEvent, drag, select, selectAll } from "d3";
import { Dispatch, SetStateAction } from "react";
import { DataType } from "~/pages/utils/const/dataWorkers";
import { Chart } from "./Chart";
import { createSVGElement } from "./util";
const placements: [number, number][] = [
  [0, 0],
  [0.5, 0],
  [1, 0],
  [0, 0.5],
  [1, 0.5],
  [0, 1],
  [0.5, 1],
  [1, 1],
  // [0.5, -0.1],
];

const helperCircleRadius = 1;
const gap = 1;
const rectLineWidth = 0.5;
const baseStrokeWidth = 50;
export class ChartController {
  target: Chart<Map<string, DataType> | DataType>;
  parent: SVGElement;
  node: SVGGElement;
  static instance: ChartController | null = null;
  static setReactInstance: Dispatch<SetStateAction<ChartController | null>>;
  constructor(
    chart: Chart<Map<string, DataType> | DataType>,
    parent: SVGElement
  ) {
    ChartController.removeInstance();
    this.target = chart;
    this.parent = parent;
    this.target.bindController(this);
    this.node = this.generateNode();
    parent.appendChild(this.node);

    this.setOrigin(this.target.origin);
    ChartController.instance = this;
    if (ChartController.setReactInstance !== null) {
      ChartController.setReactInstance(this);
    }
  }
  static removeInstance() {
    if (ChartController.instance) {
      if (ChartController.setReactInstance !== null) {
        ChartController.setReactInstance(null);
      }
      ChartController.instance.deleteNode();
      ChartController.instance = null;
    }
  }
  generateNode(): SVGGElement {
    function dragstarted(this: SVGElement) {
      select(this as SVGElement).raise();
    }

    function dragged(this: SVGElement, event: any) {
      if (!ChartController.instance) {
        return;
      }
      select(ChartController.instance.node).attr(
        "transform",
        `translate(${event.x},${event.y})`
      );
    }
    let strokeWidthScale = this.target.baseWidth / 50;
    let height = this.target.baseHeight + 2 * strokeWidthScale;
    let width = this.target.baseWidth + 2 * strokeWidthScale;
    let { x, y, scaleX, scaleY, rotation } = this.target;

    let g = createSVGElement("g");
    select(g)
      .attr("class", "controller")
      .attr(
        "transform",
        `translate(${x},${y})  rotate(${rotation}) scale(${scaleX},${scaleY})`
      )
      .append("rect")
      .attr("class", "controllerRect")
      .attr("x", -gap * strokeWidthScale)
      .attr("y", -gap * strokeWidthScale)
      .attr("height", height)
      .attr("width", width)
      .attr("stroke-width", rectLineWidth * strokeWidthScale)
      .attr("fill", "transparent")
      .attr("stroke", "#6cf");
    // .call(
    //   drag()
    //     .filter(function (event: any) {
    //       return event.target && event.target === this;
    //     })
    //     .on("start", dragstarted as any)
    //     .on("drag", dragged as any) as any
    // );

    select(g)
      .selectAll("circle.helper")
      .append("g")
      .data(placements)
      .enter()
      .append("circle")
      .attr("class", "helper")
      .attr("cx", (d) => d[0] * width - gap * strokeWidthScale)
      .attr("cy", (d) => d[1] * height - gap * strokeWidthScale)
      .attr("r", helperCircleRadius * strokeWidthScale)
      .attr("stroke-width", 0.2 * strokeWidthScale)
      .attr("stroke", "blue")
      .attr("fill", "white");
    return g;
  }
  deleteNode() {
    this.parent.removeChild(this.node);
  }
  setOrigin(origin: string) {
    let [h, v] = origin.split(" ");
    let hx = 0,
      vx = 0;
    if (h === "right") {
      hx = 1;
    } else if (h === "center") {
      hx = 0.5;
    }
    if (v === "center") {
      vx = 0.5;
    } else if (v === "bottom") {
      vx = 1;
    }
    let strokeWidthScale = this.target.baseWidth / 50;
    let start = helperCircleRadius * strokeWidthScale * 2;
    let width = this.target.baseWidth;
    let height = this.target.baseHeight;
    let cx = start + hx * width,
      cy = start + vx * height;
    this.node.setAttribute("transform-origin", `${cx} ${cy}`);
    let targetIndex = vx * 2 * 3 + hx * 2;
    select(this.node)
      .selectAll(".helper")
      .data(new Array(0, 0, 0, 0, 1, 1, 1, 1, 1))
      .attr("class", (d, i) => {
        return (
          "helper " +
          (Math.abs(i + d - targetIndex) < 0.1 ? "originAnchor" : "")
        );
      });
  }
}
