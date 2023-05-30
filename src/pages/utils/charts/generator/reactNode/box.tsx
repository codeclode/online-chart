import { useSnackbar } from "notistack";
import {
  useState,
  useContext,
  useEffect,
  ChangeEvent,
  useCallback,
} from "react";
import { CanvasContext } from "~/components/canvas";
import {
  ChartDetailComponent,
  ColorSelecter,
  DataSelecter,
  rootNotNull,
  svgNotNull,
} from "../util";
import { DataContext } from "~/pages/workSpace";
import { ct } from "~/pages/utils/const/anchorOrigin";
import { TextField } from "@mui/material";
import { string2Number } from "~/pages/utils/dataTransformer";
import { BoxChart } from "../Box";

export const BOXDetail: ChartDetailComponent = function (prop) {
  const { confirm, setModalClose } = prop;
  const [confirmed, setConfirmed] = useState<boolean>(false);
  const { dataTypes, data } = useContext(DataContext);
  const { svgRef, rootGroupRef } = useContext(CanvasContext);
  const { enqueueSnackbar } = useSnackbar();
  const [width, setWidth] = useState<number>(20);
  const [height, setHeight] = useState<number>(20);
  const [keyColmn, setKeyColumn] = useState<string>("");
  const [valueColmn, setValueColumn] = useState<string>("");
  const [color, setColor] = useState<string>("interpolateTurbo");
  const validator = useCallback(
    (width: number, height: number, keyColmn: string, valueColmn: string) => {
      if (data == null || !data.columns.includes(valueColmn)) return false;
      if (data == null || !data.columns.includes(keyColmn)) return false;
      if (
        dataTypes == null ||
        dataTypes[data.columns.indexOf(valueColmn)] !== "number"
      )
        return false;
      if (width <= 0 || height <= 0) return false;
      return true;
    },
    [data]
  );
  useEffect(() => {
    if (!confirmed) {
      setConfirmed(true);
      return;
    }
    if (!validator(width, height, keyColmn, valueColmn)) {
      enqueueSnackbar({
        message: "字段有误",
        variant: "error",
        anchorOrigin: ct,
      });
      return;
    }
    if (!data || !dataTypes) {
      enqueueSnackbar({
        message: "数据加载失败",
        variant: "error",
        anchorOrigin: ct,
      });
      return;
    }
    if (!svgNotNull(svgRef) || !rootNotNull(rootGroupRef)) return;
    let m = new Map<string, number>();
    data.forEach((v) => {
      let value = v[keyColmn];
      if (value !== undefined) {
        if (m.has(value)) {
          m.set(
            value,
            (m.get(value) as number) + string2Number(v[valueColmn] || "", false)
          );
        } else {
          m.set(value, string2Number(v[valueColmn] || "", false));
        }
      }
    });
    let chart = new BoxChart(
      width,
      height,
      svgRef.current,
      rootGroupRef.current,
      color,
      m,
      ["key:" + keyColmn, "value:" + valueColmn]
    );
    chart.generateNode(rootGroupRef.current);
    console.log(chart);
    setModalClose();
  }, [confirm]);
  return (
    <>
      <TextField
        color="info"
        type="number"
        label="width"
        value={width}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          const num = Number(e.target.value);
          if (num < 0) return;
          setWidth(num);
        }}
      ></TextField>
      <TextField
        color="info"
        type="number"
        label="height"
        value={height}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          const num = Number(e.target.value);
          if (num <= 0) return;
          setHeight(num);
        }}
      ></TextField>
      <ColorSelecter color={color} onChange={setColor}></ColorSelecter>
      <DataSelecter
        value={keyColmn}
        id="key"
        onChange={(str: string) => {
          setKeyColumn(str);
        }}
      ></DataSelecter>
      <DataSelecter
        value={valueColmn}
        id="value(should be a number)"
        onChange={(str: string) => {
          if (data && dataTypes) {
            let index = data.columns.indexOf(str);
            if (index !== -1 && dataTypes[index] !== "number") {
              enqueueSnackbar({
                message: "必须是number类型字段~~",
                variant: "warning",
                anchorOrigin: ct,
              });
            } else {
              setValueColumn(str);
            }
            return;
          } else {
            enqueueSnackbar({
              message: "数据加载中~~",
              variant: "warning",
              anchorOrigin: ct,
            });
          }
        }}
      ></DataSelecter>
    </>
  );
};
