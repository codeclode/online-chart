import { select } from "d3";
import { CSV2Data } from "./dataTransformer";

export const fileInput = async function (svg: SVGSVGElement | null) {
  if (!svg) return;
  let fileDOM = document.querySelector<HTMLInputElement>("#file");
  if (fileDOM && fileDOM.files && fileDOM.files[0]) {
    let file = fileDOM.files[0];
    let data = await CSV2Data(file);
    select(svg)
      .selectAll("text")
      .data(data)
      .enter()
      .append("text")
      .text((_that, d) => {
        return d;
      })
      .style("stroke", "black")
      .style("transform", (_that, d) => {
        return `translate(${10 * d + 10}px,20px)`;
      });
  }
};
