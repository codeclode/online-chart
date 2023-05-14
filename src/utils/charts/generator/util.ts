export function createSVGElement<T extends keyof SVGElementTagNameMap>(
  nodeType: T
): SVGElementTagNameMap[T] {
  return document.createElementNS("http://www.w3.org/2000/svg", nodeType);
}
