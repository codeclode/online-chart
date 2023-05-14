import {
  MaximizeOutlined,
  MinimizeOutlined,
  SignalCellular3BarOutlined,
  SpokeOutlined,
  SvgIconComponent,
} from "@mui/icons-material";
import { sum } from "d3";

export type DataType = Date | number | string | boolean;
export type DataTypeString = "Date" | "number" | "string" | "boolean";
export const DataTypeStringArray: DataTypeString[] = [
  "Date",
  "number",
  "string",
  "boolean",
];
export const dataTypeColor: Record<
  DataTypeString,
  "info" | "primary" | "success" | "warning" | "default" | "error" | "secondary"
> = {
  Date: "info",
  number: "primary",
  string: "success",
  boolean: "warning",
};
type WorkerFn<T> = (dataSet: T[], skipAbnormal: boolean) => T;
function dateValider(data: any): data is Date {
  return data instanceof Date;
}
function valider(data: any, types: DataTypeString[]): boolean {
  types.forEach((v) => {
    if (v === "Date" && dateValider(data)) {
      return true;
    } else {
      if (typeof data === v) return true;
    }
  });
  return false;
}
export type DataWorkers = {
  icon: SvgIconComponent;
  name: string;
  limitTypes: DataTypeString[];
  // worker: WorkerFn<DataType>;
};
export const workers: DataWorkers[] = [
  {
    icon: SpokeOutlined,
    name: "平均数",
    limitTypes: ["Date", "number"],
  },
  {
    icon: MaximizeOutlined,
    name: "最大值",
    limitTypes: ["Date", "number"],
  },
  {
    icon: MinimizeOutlined,
    name: "最小值",
    limitTypes: ["Date", "number"],
  },
  {
    icon: SignalCellular3BarOutlined,
    name: "最多值",
    limitTypes: ["Date", "number", "string"],
  },
];
