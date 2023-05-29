import { debounce } from "@mui/material";
import { Box, Stack } from "@mui/system";
import {
  BaseSyntheticEvent,
  createContext,
  MutableRefObject,
  useCallback,
  useContext,
  useRef,
} from "react";
import { useEffect, useState } from "react";
import { appendController } from "~/pages/utils/charts/appendController";
import { ChartController } from "~/pages/utils/charts/generator/Controller";
import { ChartModal } from "./canvas/chartModal";
import { DataModal } from "./canvas/dataModal";
import { OperateButtonGroup } from "./canvas/operateButtonGroup";
import { OptionsInCanvas } from "./canvas/optionsInCanvas";

export const CanvasContext = createContext<{
  svgRef: null | MutableRefObject<SVGSVGElement | null>;
  rootGroupRef: null | MutableRefObject<SVGGElement | null>;
  viewBox: [number, number, number, number];
}>({
  svgRef: null,
  rootGroupRef: null,
  viewBox: [0, 0, 100, 100],
});

function GridInCanvas(prop: { showGrid: boolean }) {
  const { viewBox } = useContext(CanvasContext);
  return (
    <g
      style={{
        visibility: prop.showGrid ? "visible" : "hidden",
      }}
    >
      {new Array(Math.ceil(viewBox[3] / 5)).fill(0).map((v, i) => {
        return (
          <line
            key={i}
            stroke="black"
            strokeWidth="0.1"
            strokeOpacity="0.5"
            x1="0"
            x2={viewBox[2]}
            y1={5 * i + 2}
            y2={5 * i + 2}
          ></line>
        );
      })}
      {new Array(Math.ceil(viewBox[2] / 5)).fill(0).map((v, i) => {
        return (
          <line
            key={i}
            stroke="black"
            strokeWidth="0.1"
            strokeOpacity="0.5"
            y1="0"
            y2={viewBox[3]}
            x1={5 * i + 2}
            x2={5 * i + 2}
          ></line>
        );
      })}
    </g>
  );
}

export const CanvasWithOptions = function (prop: { headerHeight: number }) {
  const [dataModalOpen, setDataModalOpen] = useState(false);
  const [chartModalOpen, setChartModalOpen] = useState(false);
  const [bgColor, setBgColor] = useState<string>("#d8b474ac");
  const svgRef = useRef<null | SVGSVGElement>(null);
  const rootGroupRef = useRef<null | SVGGElement>(null);
  const [viewBox, setViewBox] = useState<[number, number, number, number]>([
    0, 0, 100, 100,
  ]);
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [resetFn, setResetFn] = useState<(() => void) | undefined>(undefined);
  const [chartController, setChartController] =
    useState<ChartController | null>(null);
  const resizeView = useCallback(
    debounce(() => {
      if (!svgRef.current) return;
      const { width, height } = svgRef.current.getBoundingClientRect();
      const VW = 100 * (width / height);
      setViewBox([0, 0, VW, 100]);
    }),
    []
  );
  useEffect(() => {
    resizeView();
    setResetFn(() => appendController(svgRef, rootGroupRef));
    window.addEventListener("resize", resizeView);
    ChartController.setReactInstance = setChartController;
    return () => {
      window.removeEventListener("resize", resizeView);
    };
  }, []);

  return (
    <CanvasContext.Provider
      value={{ svgRef: svgRef, rootGroupRef: rootGroupRef, viewBox: viewBox }}
    >
      <Stack px="10px" flexDirection="column">
        <OperateButtonGroup
          showGrid={showGrid}
          setShowGrid={setShowGrid}
          setDataModalOpen={setDataModalOpen}
          setChartModalOpen={setChartModalOpen}
        ></OperateButtonGroup>
        <Box
          mt="10px"
          height={`calc(100vh - ${prop.headerHeight + 100}px)`}
          border="1px solid black"
          borderRadius="15px"
          borderColor="#6cf"
          position="relative"
          overflow="hidden"
        >
          <svg
            ref={svgRef}
            width="100%"
            height="100%"
            viewBox={viewBox.join(" ")}
            onClick={(e: BaseSyntheticEvent<MouseEvent, SVGSVGElement>) => {
              if (
                e.target.getAttribute("class") !== "chart" &&
                e.target.getAttribute("class") !== "controller"
              ) {
                ChartController.removeInstance();
                setChartController(null);
              }
            }}
          >
            <rect
              x="0"
              y="0"
              fill={bgColor}
              width={viewBox[2]}
              height={viewBox[3]}
            ></rect>
            <GridInCanvas showGrid={showGrid}></GridInCanvas>
            <g className="rootGroup" ref={rootGroupRef}></g>
          </svg>
          <OptionsInCanvas
            chartController={chartController}
            resetFn={resetFn}
            bgColor={bgColor}
            setBgColor={setBgColor}
            type="hoist"
          ></OptionsInCanvas>
          <DataModal
            modalOpen={dataModalOpen}
            setModalOpen={setDataModalOpen}
          ></DataModal>
          <ChartModal
            modalOpen={chartModalOpen}
            setModalOpen={setChartModalOpen}
          ></ChartModal>
        </Box>
      </Stack>
    </CanvasContext.Provider>
  );
};
