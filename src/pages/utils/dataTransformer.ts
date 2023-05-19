import { csvParse, DSVRowArray, json } from "d3";
import moment from "moment";
import { transTypeError } from "~/utils/exceptions";
import { DataType } from "./const/dataWorkers";

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

type DateFormat = "YYYY-M-D" | "YY-M-D" | "a h:m" | "H:mm";
const DateFormater = ["YYYY-M-D", "YY-M-D", "a h:m", "H:mm"];

export const string2Date: (str: string) => Date = function (str) {
  if (!moment(str, DateFormater).isValid()) {
    throw new transTypeError("timeStr is inValid");
  } else {
    return moment(str, DateFormater).toDate();
  }
};

export const number2Date: (m: number, t: "ms" | "s" | "min") => Date =
  function (m, t = "ms") {
    if (t === "ms") {
      return new Date(m);
    } else if (t === "s") {
      return new Date(m * 1000);
    } else {
      return new Date(m * 1000 * 60);
    }
  };

export const date2String: (d: Date, format: DateFormat) => string = function (
  d,
  format
) {
  return moment(d).format(format);
};

export const string2Number: (str: string) => number = function (str) {
  let num = Number(str);
  if (isNaN(num)) {
    throw new transTypeError("numberStr is NaN");
  } else {
    return num;
  }
};
