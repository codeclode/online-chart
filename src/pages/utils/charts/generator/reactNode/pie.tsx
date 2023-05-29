import { TextField } from "@mui/material";
import { useSnackbar } from "notistack";
import {
  useState,
  useContext,
  useCallback,
  useEffect,
  ChangeEvent,
} from "react";
import { CanvasContext } from "~/components/canvas";
import { ct } from "~/pages/utils/const/anchorOrigin";
import { DataContext } from "~/pages/workSpace";
import { ArcChart } from "../Arc";
import {
  ChartDetailComponent,
  ColorSelecter,
  DataSelecter,
  rootNotNull,
  svgNotNull,
} from "../util";

export const PIEDetail: ChartDetailComponent = function (prop) {
  const { confirm, setModalClose } = prop;
  const [confirmed, setConfirmed] = useState<boolean>(false);
  const { svgRef, rootGroupRef } = useContext(CanvasContext);
  const { dataTypes, data } = useContext(DataContext);
  const { enqueueSnackbar } = useSnackbar();
  const [innerRadius, setInnerRadius] = useState<number>(10);
  const [outerRadius, setOuterRadius] = useState<number>(20);
  const [dataCloumn, setDataColumn] = useState<string>("");
  const [color, setColor] = useState<string>("interpolateTurbo");
  const validator = useCallback(
    (innerRadius: number, outerRadius: number, dataCloumn: string) => {
      if (innerRadius < 0 || outerRadius <= 0) return false;
      if (innerRadius >= outerRadius) return false;
      if (data == null || !data.columns.includes(dataCloumn)) return false;
      return true;
    },
    [data]
  );
  useEffect(() => {
    if (!confirmed) {
      setConfirmed(true);
      return;
    }
    if (!validator(innerRadius, outerRadius, dataCloumn)) {
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
      let value = v[dataCloumn];
      if (value !== undefined)
        if (m.has(value)) {
          m.set(value, (m.get(value) as number) + 1);
        } else {
          m.set(value, 1);
        }
    });
    let arc = new ArcChart(
      innerRadius,
      outerRadius,
      svgRef.current,
      rootGroupRef.current,
      color,
      m,
      [dataCloumn, "Count"]
    );
    arc.generateNode(rootGroupRef.current);
    setModalClose();
  }, [confirm]);
  return (
    <>
      <TextField
        color="info"
        type="number"
        label="innerRadius"
        value={innerRadius}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          const num = Number(e.target.value);
          if (num < 0) return;
          setInnerRadius(num);
        }}
      ></TextField>
      <TextField
        color="info"
        type="number"
        label="outerRadius"
        value={outerRadius}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          const num = Number(e.target.value);
          if (num <= 0) return;
          setOuterRadius(num);
        }}
      ></TextField>
      <ColorSelecter color={color} onChange={setColor}></ColorSelecter>
      <DataSelecter
        value={dataCloumn}
        onChange={(value: string) => {
          setDataColumn(value);
        }}
        id={"统计key"}
      ></DataSelecter>
    </>
  );
};
