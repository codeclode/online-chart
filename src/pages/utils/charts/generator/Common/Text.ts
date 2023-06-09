import { select } from "d3";
import { CommonChart } from "../Common";
import { createSVGElement } from "../util";
import { ChartController } from "../Controller";

export class TextCommonChart extends CommonChart {
  setFill(value: string): boolean {
    if (this.node) {
      select(this.node).selectAll("text").attr("fill", value);
      this.fill = value;
      return true;
    }
    return false;
  }
  setStroke(value: string): boolean {
    if (this.node) {
      select(this.node).selectAll("text").attr("stroke", value);
      this.fill = value;
      return true;
    }
    return false;
  }
  text: string;
  constructor(text: string, svg: SVGSVGElement, root: SVGGElement) {
    const tx = createSVGElement("text");
    tx.innerHTML = text;
    svg.append(tx);
    const { width, height } = tx.getBBox();
    svg.removeChild(tx);
    super(width, height, svg, root);
    this.text = text;
  }
  async generateNode(parent: SVGSVGElement | SVGGElement): Promise<boolean> {
    const tx = createSVGElement("text");
    tx.innerHTML = this.text;
    select(tx)
      .attr("alignment-baseline", "before-edge")
      .attr("stroke", "black")
      .attr("fill", "none");
    const g = createSVGElement("g");
    const dG = select(g);
    dG.attr("transform", `translate(${this.x},${this.y})`).attr(
      "class",
      "chartContainer"
    );
    g.append(tx);
    g.addEventListener("click", (e: MouseEvent) => {
      new ChartController(this, parent);
      e.stopPropagation();
    });
    parent.appendChild(g);
    this.node = g;
    return true;
  }
}
