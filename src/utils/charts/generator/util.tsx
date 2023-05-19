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
export function getColor(
  colorSet: keyof typeof schemes,
  index: number,
  d: number
): string {
  let trans = schemes[colorSet];
  if (colorCategorical(trans)) {
    return trans[index % trans.length] || "#6cf";
  } else if (colorDiverging(trans)) {
    return trans(d);
  } else {
    return "#6cf";
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
  return (
    <FormControl color="info">
      <InputLabel htmlFor="grouped-select">Grouping</InputLabel>
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
      </Select>
    </FormControl>
  );
}

type ChartDetailComponent = (prop: {
  confirm: boolean;
  setModalClose: () => void;
}) => JSX.Element;

const BOXDetail: ChartDetailComponent = function (prop) {
  const { confirm, setModalClose } = prop;
  useEffect(() => {
    setModalClose();
  }, [confirm]);
  return <></>;
};

const PIEDetail: ChartDetailComponent = function (prop) {
  const { confirm, setModalClose } = prop;
  const [confirmed, setConfirmed] = useState<boolean>(false);
  const { svgRef, rootGroupRef } = useContext(CanvasContext);
  const { enqueueSnackbar } = useSnackbar();
  const [innerRadius, setInnerRadius] = useState<number>(10);
  const [outerRadius, setOuterRadius] = useState<number>(20);
  const [color, setColor] = useState<string>("interpolateTurbo");
  const validator = useCallback((innerRadius: number, outerRadius: number) => {
    if (innerRadius < 0 || outerRadius <= 0) return false;
    if (innerRadius >= outerRadius) return false;
    return true;
  }, []);
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
    if (svgNotNull(svgRef) && rootNotNull(rootGroupRef)) {
      let arc = new ArcChart(
        innerRadius,
        outerRadius,
        svgRef.current,
        rootGroupRef.current,
        color as keyof typeof schemes
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
    </>
  );
};
const PATHDetail: ChartDetailComponent = function (prop) {
  const { confirm, setModalClose } = prop;
  useEffect(() => {
    setModalClose();
  }, [confirm]);
  return <></>;
};
const TREEDetail: ChartDetailComponent = function (prop) {
  const { confirm, setModalClose } = prop;
  useEffect(() => {
    setModalClose();
  }, [confirm]);
  return <></>;
};
const SCATTERDetail: ChartDetailComponent = function (prop) {
  const { confirm, setModalClose } = prop;
  useEffect(() => {
    setModalClose();
  }, [confirm]);
  return <></>;
};
const LINEDetail: ChartDetailComponent = function (prop) {
  const { confirm, setModalClose } = prop;
  useEffect(() => {
    setModalClose();
  }, [confirm]);
  return <></>;
};
const MAPDetail: ChartDetailComponent = function (prop) {
  const { confirm, setModalClose } = prop;
  useEffect(() => {
    setModalClose();
  }, [confirm]);
  return <></>;
};
const RADARDetail: ChartDetailComponent = function (prop) {
  const { confirm, setModalClose } = prop;
  useEffect(() => {
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
