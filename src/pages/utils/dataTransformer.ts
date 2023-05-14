import { csvParse, DSVRowArray, json } from "d3";

export const fromUnitToChar = function (arr: Uint8Array): string {
  let temp = Array.from<number>(arr);
  let ret: string[] = temp.map((v: number): string => {
    return String.fromCharCode(v);
  });
  return ret.join("");
};

export const getFileExt = function (fileName: string): string {
  let splits: string[] = fileName.split(".");
  if (splits.length === 0 || !fileName.includes("")) {
    return "";
  } else {
    return splits.pop() || "";
  }
};

export const CSV2Data = async function (
  file: File
): Promise<DSVRowArray<string>> {
  let reader = file.stream().getReader();
  let res = await reader.read();
  let ret = "";
  if (!res.done) {
    ret += fromUnitToChar(res.value);
    res = await reader.read();
  }
  if (res.value) ret += fromUnitToChar(res.value);
  return csvParse(ret);
};

export const JSON2Data = async function (file: File): Promise<any> {
  let reader = file.stream().getReader();
  let res = await reader.read();
  let ret = "";
  if (!res.done) {
    ret += fromUnitToChar(res.value);
    res = await reader.read();
  }
  if (res.value) ret += fromUnitToChar(res.value);

  return JSON.parse(ret);
};
