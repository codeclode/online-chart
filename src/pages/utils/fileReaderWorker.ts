const worker = function () {
  self.onmessage = (e: MessageEvent<File>) => {
    const file = e.data;
    const fileReader = new FileReader();
    fileReader.readAsText(file);
    fileReader.onerror = () => {
      throw new Error("read failed");
    };
    fileReader.onload = () => {
      self.postMessage(fileReader.result);
    };
  };
};
export function createFileReaderWorker() {
  const txt = worker.toString();
  const exportTxt = txt.slice(txt.indexOf("{") + 1, txt.lastIndexOf("}"));
  const blob = new Blob([exportTxt]);
  return URL.createObjectURL(blob);
}
