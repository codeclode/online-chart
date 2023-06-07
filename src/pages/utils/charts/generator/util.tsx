import {
  FormControl,
  InputLabel,
  ListSubheader,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { ChartType } from "@prisma/client";
import { Dispatch, MutableRefObject, SetStateAction, useContext } from "react";

import * as schemes from "d3-scale-chromatic";
import { DataContext } from "~/pages/workSpace";
import { commenRequest, trpc } from "~/utils/trpc";
import { gradient2f } from "../../gradient2Fn";
import { gradientStop } from "~/components/inputComponent/gradientPicker";
import { ColorNotFoundError } from "~/server/utils/const/errors";
import { BOXDetail } from "./reactNode/box";
import { PIEDetail } from "./reactNode/pie";
import { LINEDetail } from "./reactNode/line";
import { MAPDetail } from "./reactNode/map";
import { PATHDetail } from "./reactNode/path";
import { RADARDetail } from "./reactNode/radar";
import { SCATTERDetail } from "./reactNode/scatter";
import { TREEDetail } from "./reactNode/tree";
import { rgb } from "d3";
import { Chart } from "./Chart";
import { BoxChart } from "./Box";
import { ArcChart } from "./Arc";

export function createSVGElement<T extends keyof SVGElementTagNameMap>(
  nodeType: T
): SVGElementTagNameMap[T] {
  return document.createElementNS("http://www.w3.org/2000/svg", nodeType);
}

export function classGenerate(base: any) {
  const chartTypes: any[] = [BoxChart, ArcChart];
  for (let i = 0; i < chartTypes.length; i++) {
    if (base instanceof chartTypes[i]) {
      return chartTypes[i];
    }
  }
  return null;
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

export const svgNotNull = function (
  svgRef: MutableRefObject<SVGSVGElement | null> | null
): svgRef is MutableRefObject<SVGSVGElement> {
  return svgRef !== null && svgRef.current !== null;
};
export const rootNotNull = function (
  rootGroupRef: MutableRefObject<SVGGElement | null> | null
): rootGroupRef is MutableRefObject<SVGSVGElement> {
  return rootGroupRef !== null && rootGroupRef.current !== null;
};

export function ColorSelecter(prop: {
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
export function getTextColor(
  colorSet: string[] | ((t: number) => string),
  index: number,
  d: number,
  normalizer: (d: number) => number
): string {
  const color = rgb(getColor(colorSet, index, normalizer(d)));
  return rgb(255 - color.r, 255 - color.g, 255 - color.b)
    .brighter()
    .toString();
}

export function DataSelecter(prop: {
  value: string;
  onChange: (str: string) => void;
  id: string;
}) {
  const { value, onChange, id } = prop;
  const { data } = useContext(DataContext);
  return (
    <FormControl color="info">
      <InputLabel htmlFor={`data-selecter-${id}`}>{`${id}`}</InputLabel>
      <Select
        value={value}
        onChange={(e: SelectChangeEvent<string>) => {
          onChange(e.target.value);
        }}
        id={`data-selecter-${id}`}
        label={`${id}`}
      >
        {data
          ? data.columns.map((v) => {
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
