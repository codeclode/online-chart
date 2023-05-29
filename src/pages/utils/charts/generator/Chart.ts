import { ChartController } from "./Controller";
import { DataType } from "~/pages/utils/const/dataWorkers";
export abstract class Chart<T extends Map<string, DataType> | DataType> {
  x: number;
  y: number;
  scaleX: number;
  scaleY: number;
  rotation: number;
  baseWidth: number;
  baseHeight: number;
  origin = "left top";
  node: SVGElement | null = null;
  controller: ChartController | null = null;
  colorSet: string;
  colorMap: Map<string, string>;
  data: Map<string, T>;
  abstract columns: string[];
  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    colorSet: string,
    data: Map<string, T>
  ) {
    this.x = x;
    this.y = y;
    this.baseWidth = width;
    this.baseHeight = height;
    this.scaleX = 1;
    this.scaleY = 1;
    this.rotation = 0;
    this.colorSet = colorSet;
    this.data = data;
    this.colorMap = new Map();
  }

  static getCenter(
    svg: SVGSVGElement,
    root: SVGGElement,
    chartWidth: number,
    chartHeight: number
  ) {
    let x = 0,
      y = 0,
      scale = 1;
    for (let i = 0; i < root.transform.animVal.length; i++) {
      let m = root.transform.animVal[i];
      if (m) {
        if (m.type === m.SVG_TRANSFORM_SCALE) {
          scale = m.matrix.a;
        } else if (m.type === m.SVG_TRANSFORM_TRANSLATE) {
          x = m.matrix.e;
          y = m.matrix.f;
        }
      }
    }
    const { width, height } = svg.viewBox.baseVal;
    let centerX = (width / 2 - x) / scale - chartWidth / 2;
    centerX = Number(centerX.toPrecision(2))
    let centerY = (height / 2 - y) / scale - chartHeight / 2;
    centerY = Number(centerY.toPrecision(2))
    return { centerX, centerY };
  }

  abstract generateNode(parent: SVGSVGElement | SVGGElement): Promise<boolean>;
  setTranslate(x: number, y?: number): void {
    this.x = Number(x.toPrecision(2));
    if (typeof y === "number") {
      this.y = Number(y.toPrecision(2));
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
