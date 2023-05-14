import { Dispatch, SetStateAction } from "react";
import { ChartController } from "./Controller";

export abstract class Chart {
  x: number;
  y: number;
  scaleX: number;
  scaleY: number;
  rotation: number;
  baseWidth: number;
  baseHeight: number;
  origin: string = "left top";
  node: SVGElement | null = null;
  controller: ChartController | null = null;
  constructor(x: number, y: number, width: number, height: number) {
    this.x = x;
    this.y = y;
    this.baseWidth = width;
    this.baseHeight = height;
    this.scaleX = 1;
    this.scaleY = 1;
    this.rotation = 0;
  }

  abstract generateNode(
    parent: SVGSVGElement | SVGGElement,
    setChartController: Dispatch<SetStateAction<ChartController | null>>
  ): boolean;
  setTranslate(x: number, y?: number): void {
    this.x = x;
    if (typeof y === "number") {
      this.y = y;
    }
    this.transform();
  }
  rotate(rotation: number) {
    this.rotation = rotation;
    this.transform();
  }
  scale(x: number, y?: number) {
    this.scaleX = x;
    if (typeof y === "number") {
      this.scaleY = y;
    }
    this.transform();
  }
  transform() {
    let transform = `translate(${this.x},${this.y}) rotate(${this.rotation}) scale(${this.scaleX},${this.scaleY})`;
    if (this.node) {
      this.node.setAttribute("transform", transform);
      if (this.controller) {
        this.controller.node.setAttribute("transform", transform);
      }
    }
  }
  setTransformOrigin(origin: string) {
    if (this.node) {
      this.node.setAttribute("transform-origin", origin);
      if (this.controller) {
        this.controller.setOrigin(origin);
        // this.controller.node.setAttribute("transform-origin", origin);
      }
    }
    this.origin = origin;
  }
  bindController(controller: ChartController) {
    this.controller = controller;
  }
  hasController() {
    return this.controller !== null;
  }
  getTransform() {
    return {
      x: this.x,
      y: this.y,
      rotation: this.rotation,
      scaleX: this.scaleX,
      scaleY: this.scaleY,
    };
  }
}
