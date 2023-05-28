import {
  FormControl,
  InputLabel,
  ListSubheader,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import { ChartType } from "@prisma/client";
import { useSnackbar } from "notistack";
import {
  ChangeEvent,
  Dispatch,
  MutableRefObject,
  ReactNode,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { CanvasContext } from "~/components/canvas";
import { ct } from "~/pages/utils/const/anchorOrigin";
import { ArcChart } from "./Arc";

import * as schemes from "d3-scale-chromatic";
import { DataContext } from "~/pages/workSpace";
import { commenRequest, trpc } from "~/utils/trpc";
import { createTRPCProxyClient } from "@trpc/client";
import { gradient2f } from "../../gradient2Fn";
import { gradientStop } from "~/components/inputComponent/gradientPicker";
import { ColorNotFoundError } from "~/server/utils/const/errors";

export function createSVGElement<T extends keyof SVGElementTagNameMap>(
  nodeType: T
): SVGElementTagNameMap[T] {
  return document.createElementNS("http://www.w3.org/2000/svg", nodeType);
}

export function colorCategorical(
  item:
    | ReadonlyArray<ReadonlyArray<string>>
    | ReadonlyArray<string>
    | ((t: number) => string)
): item is Array<string> {
  if (!Array.isArray(item)) return false;
  else if (
    item.some((v) => {
      return Array.isArray(v);
    })
  )
    return false;
  return true;
}
export function colorDiverging(
  item:
    | ReadonlyArray<ReadonlyArray<string>>
    | ReadonlyArray<string>
    | ((t: number) => string)
): item is (t: number) => string {
  if (Array.isArray(item)) return false;
  return true;
}

export async function getColorSet(
  colorSet: string
): Promise<string[] | ((t: number) => string)> {
  let trans = Reflect.get(schemes, colorSet);

  if (trans === undefined) {
    try {
      let preset = await commenRequest.user.getColorByID.query(colorSet);
      if (preset.positions.length !== 0) {
        let gradient: gradientStop[] = preset.colors.map((v, i) => {
          return {
            color: v,
            position: preset.positions[i] || 100,
          };
        });
        trans = gradient2f(gradient);
      } else {
        trans = preset.colors;
      }
      return trans;
    } catch (e: any) {
      console.log(e);
      if (e && e.message && e.message === ColorNotFoundError.messageString) {
        return schemes.interpolateWarm;
      }
    }
  } else {
    return trans;
  }
  return schemes.interpolateWarm;
}

export function getColor(
  colorSet: string[] | ((t: number) => string),
  index: number,
  d: number
): string {
  if (Array.isArray(colorSet)) {
    return colorSet[index % colorSet.length] || "#6cf";
  } else {
    return colorSet(d);
  }
}

const svgNotNull = function (
  svgRef: MutableRefObject<SVGSVGElement | null> | null
): svgRef is MutableRefObject<SVGSVGElement> {
  return svgRef !== null && svgRef.current !== null;
};
const rootNotNull = function (
  rootGroupRef: MutableRefObject<SVGGElement | null> | null
): rootGroupRef is MutableRefObject<SVGSVGElement> {
  return rootGroupRef !== null && rootGroupRef.current !== null;
};

function ColorSelecter(prop: {
  color: string;
  onChange: Dispatch<SetStateAction<string>>;
}) {
  const colorPerSet = trpc.user.getColorPreSetByUserID.useQuery();
  return (
    <FormControl color="info">
      <InputLabel htmlFor="grouped-select">colorSet</InputLabel>
      <Select
        value={prop.color}
        onChange={(e: SelectChangeEvent<string>) => {
          if (e.target.value) prop.onChange(e.target.value);
        }}
        defaultValue=""
        id="grouped-select"
        label="Grouping"
      >
        <ListSubheader>插值</ListSubheader>
        {Object.keys(schemes)
          .filter((v) => {
            return colorDiverging(schemes[v as keyof typeof schemes]);
          })
          .map((v) => {
            return (
              <MenuItem key={v} value={v}>
                {v}
              </MenuItem>
            );
          })}
        <ListSubheader>定数</ListSubheader>
        {Object.keys(schemes)
          .filter((v) => {
            return colorCategorical(schemes[v as keyof typeof schemes]);
          })
          .map((v) => {
            return (
              <MenuItem key={v} value={v}>
                {v}
              </MenuItem>
            );
          })}
        <ListSubheader>自定义</ListSubheader>
        {colorPerSet.data ? (
          colorPerSet.data.preset.map((v) => {
            return (
              <MenuItem value={v.id} key={v.id}>
                {v.name}
              </MenuItem>
            );
          })
        ) : (
          <MenuItem>加载中。。。</MenuItem>
        )}
      </Select>
    </FormControl>
  );
}

function DataSelecter(prop: {
  value: string;
  onChange: Dispatch<SetStateAction<string>>;
  id: string;
}) {
  const { value, onChange, id } = prop;
  const { data, dataTypes } = useContext(DataContext);
  return (
    <FormControl color="info">
      <InputLabel htmlFor={`data-selecter-${id}`}>{`字段${id}`}</InputLabel>
      <Select
        value={value}
        onChange={(e: SelectChangeEvent<string>) => {
          onChange(e.target.value);
        }}
        id={`data-selecter-${id}`}
        label={`字段${id}`}
      >
        {data
          ? data.columns.map((v, i) => {
              return (
                <MenuItem key={v} value={v}>
                  {v}
                </MenuItem>
              );
            })
          : null}
      </Select>
    </FormControl>
  );
}

export type ChartDetailComponent = (prop: {
  confirm: boolean;
  setModalClose: () => void;
}) => JSX.Element;

const BOXDetail: ChartDetailComponent = function (prop) {
  const { confirm, setModalClose } = prop;
  const [confirmed, setConfirmed] = useState<boolean>(false);
  const { svgRef, rootGroupRef } = useContext(CanvasContext);
  const { enqueueSnackbar } = useSnackbar();
  useEffect(() => {
    if (!confirmed) {
      setConfirmed(true);
      return;
    }
    setModalClose();
  }, [confirm]);
  return <></>;
};

const PIEDetail: ChartDetailComponent = function (prop) {
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
    (innerRadius: number, outerRadius: number) => {
      if (innerRadius < 0 || outerRadius <= 0) return false;
      if (innerRadius >= outerRadius) return false;
      if (data == null || !data.columns.includes(dataCloumn)) return false;
      return true;
    },
    [dataCloumn, data]
  );
  useEffect(() => {
    if (!confirmed) {
      setConfirmed(true);
      return;
    }
    if (!validator(innerRadius, outerRadius)) {
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
    if (svgNotNull(svgRef) && rootNotNull(rootGroupRef)) {
      let arc = new ArcChart(
        innerRadius,
        outerRadius,
        svgRef.current,
        rootGroupRef.current,
        color as keyof typeof schemes,
        m,
        [dataCloumn, "Count"]
      );
      arc.generateNode(rootGroupRef.current);
    }
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
        onChange={setDataColumn}
        id={"1"}
      ></DataSelecter>
    </>
  );
};

const PATHDetail: ChartDetailComponent = function (prop) {
  const { confirm, setModalClose } = prop;
  const [confirmed, setConfirmed] = useState<boolean>(false);
  const { svgRef, rootGroupRef } = useContext(CanvasContext);
  const { enqueueSnackbar } = useSnackbar();
  useEffect(() => {
    if (!confirmed) {
      setConfirmed(true);
      return;
    }
    setModalClose();
  }, [confirm]);
  return <></>;
};
const TREEDetail: ChartDetailComponent = function (prop) {
  const { confirm, setModalClose } = prop;
  const [confirmed, setConfirmed] = useState<boolean>(false);
  const { svgRef, rootGroupRef } = useContext(CanvasContext);
  const { enqueueSnackbar } = useSnackbar();
  useEffect(() => {
    if (!confirmed) {
      setConfirmed(true);
      return;
    }
    setModalClose();
  }, [confirm]);
  return <></>;
};
const SCATTERDetail: ChartDetailComponent = function (prop) {
  const { confirm, setModalClose } = prop;
  const [confirmed, setConfirmed] = useState<boolean>(false);
  const { svgRef, rootGroupRef } = useContext(CanvasContext);
  const { enqueueSnackbar } = useSnackbar();
  useEffect(() => {
    if (!confirmed) {
      setConfirmed(true);
      return;
    }
    setModalClose();
  }, [confirm]);
  return <></>;
};
const LINEDetail: ChartDetailComponent = function (prop) {
  const { confirm, setModalClose } = prop;
  const [confirmed, setConfirmed] = useState<boolean>(false);
  const { svgRef, rootGroupRef } = useContext(CanvasContext);
  const { enqueueSnackbar } = useSnackbar();
  useEffect(() => {
    if (!confirmed) {
      setConfirmed(true);
      return;
    }
    setModalClose();
  }, [confirm]);
  return <></>;
};
const MAPDetail: ChartDetailComponent = function (prop) {
  const { confirm, setModalClose } = prop;
  const [confirmed, setConfirmed] = useState<boolean>(false);
  const { svgRef, rootGroupRef } = useContext(CanvasContext);
  const { enqueueSnackbar } = useSnackbar();
  useEffect(() => {
    if (!confirmed) {
      setConfirmed(true);
      return;
    }
    setModalClose();
  }, [confirm]);
  return <></>;
};
const RADARDetail: ChartDetailComponent = function (prop) {
  const { confirm, setModalClose } = prop;
  const [confirmed, setConfirmed] = useState<boolean>(false);
  const { svgRef, rootGroupRef } = useContext(CanvasContext);
  const { enqueueSnackbar } = useSnackbar();
  useEffect(() => {
    if (!confirmed) {
      setConfirmed(true);
      return;
    }
    setModalClose();
  }, [confirm]);
  return <></>;
};
export const ChartDetail: Record<ChartType, ChartDetailComponent> = {
  BOX: BOXDetail,
  PIE: PIEDetail,
  PATH: PATHDetail,
  TREE: TREEDetail,
  SCATTER: SCATTERDetail,
  LINE: LINEDetail,
  MAP: MAPDetail,
  RADAR: RADARDetail,
};
