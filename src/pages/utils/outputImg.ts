export function outputSVG(svg: SVGSVGElement) {
  const serializer = new XMLSerializer();
  const serializedElement = serializer.serializeToString(svg);
  const blob = new Blob([serializedElement], { type: "image/svg" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "output.svg";
  document.body.appendChild(a);
  a.click();
  URL.revokeObjectURL(url);
}
export function outputPNG(svg: SVGSVGElement) {
  const serializer = new XMLSerializer();
  const serializedElement = serializer.serializeToString(svg);
  const src = `data:image/svg+xml;chartset=utf-8,${encodeURIComponent(
    serializedElement
  )}`; //生成src
  let { width, height } = svg.getBoundingClientRect();
  const img = new Image(width, height);
  img.onload = () => {
    let canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    let ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(img, 0, 0);
      let dataURL = canvas.toDataURL("png", 1);
      const a = document.createElement("a");
      a.href = dataURL;
      a.download = "output.png";
      document.body.appendChild(a);
      a.click();
    }
  };
  img.src = src;
}
