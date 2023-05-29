import {
  extent,
  select,
  zoom,
  zoomIdentity,
  zoomTransform,
} from "d3";
import { MutableRefObject } from "react";
import { chartScales } from "~/pages/utils/const/chartInfo";

export function appendController(
  svg: MutableRefObject<SVGSVGElement | null>,
  rootGroup: MutableRefObject<SVGGElement | null>
) {
  if (svg.current === null || rootGroup.current === null) return;
  let { x, y, width, height } = svg.current.viewBox.animVal;
  let d3Svg = select(svg.current);
  let g = select(rootGroup.current);
  d3Svg.on(".zoom", null);
  function zoomed({
    transform,
    sourceEvent,
  }: {
    transform: string;
    sourceEvent: WheelEvent | MouseEvent;
  }) {
    if (sourceEvent) {
      let target = sourceEvent.target;
      if (target instanceof SVGElement) {
        let classes = target.classList;
        if (classes.contains("helper") || classes.contains("controller"))
          if (sourceEvent instanceof MouseEvent) {
            return;
          }
      }
    }
    g.attr("transform", transform);
  }
  const zoomFn = zoom()
    .extent([
      [x, y],
      [width, height],
    ])
    .scaleExtent(extent(chartScales, (d) => d.value) as [number, number])
    .on("zoom", zoomed)
    .filter((event) => {
      if (!event) return false;
      if (event.type === "wheel") return true;
      let target = event.target;
      if (target && target instanceof SVGElement) {
        let classes = target.classList;
        if (classes.contains("helper") || classes.contains("controller"))
          return false;
      }
      return true;
    }) as any;
  d3Svg.call(zoomFn);
  const resetFunction = function () {
    d3Svg
      .transition()
      .duration(1000)
      .call(
        zoomFn.transform,
        zoomIdentity,
        zoomTransform(d3Svg.node()!).invert([width / 2, height / 2])
      );
  };
  return resetFunction;
}
