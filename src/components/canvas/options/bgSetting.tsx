import {
  UndoRounded,
  ZoomOutRounded,
  ZoomInRounded,
  RedoRounded,
} from "@mui/icons-material";
import { ButtonGroup, Button, Tooltip } from "@mui/material";
import {
  Dispatch,
  SetStateAction,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { CanvasContext } from "~/components/canvas";
import { ColorPicker } from "~/components/inputComponent/colorPicker";

export function BGSetting(prop: {
  bgColor: string;
  setBgColor: Dispatch<SetStateAction<string>>;
  resetFn: (() => void) | undefined;
}) {
  const { svgRef, rootGroupRef } = useContext(CanvasContext);
  const [scale, setScale] = useState<string>("100%");
  const zoom = useCallback(
    (isIn = false) => {
      if (svgRef === null || svgRef.current === null) return;
      let { x, y, height, width } = svgRef.current.getBoundingClientRect();
      let scrollEvent = new WheelEvent("wheel", {
        bubbles: true,
        cancelable: true,
        clientX: x + width / 2,
        clientY: y + height / 2,
        deltaX: 0,
        deltaY: isIn ? -120 : 120,
      });
      svgRef.current.dispatchEvent(scrollEvent);
    },
    [svgRef]
  );
  useEffect(() => {
    function initScale() {
      if (rootGroupRef === null || rootGroupRef.current === null) return;
      let scale = rootGroupRef.current.getAttribute("transform");
      if (scale) {
        scale = scale.toUpperCase();
        let regRet = /\(([\d\.]+)\)/.exec(
          scale.slice(scale.indexOf("SCALE") + 5)
        );
        if (regRet && regRet[1]) {
          setScale((Number(regRet[1]) * 100).toFixed(0) + "%");
        } else {
          setScale("100%");
        }
      }
    }
    initScale();
    if (rootGroupRef && rootGroupRef.current !== null) {
      let gScaleOb = new MutationObserver(() => {
        initScale();
      });
      gScaleOb.observe(rootGroupRef && rootGroupRef.current, {
        attributes: true,
      });
      return () => {
        gScaleOb.disconnect();
      };
    }
  }, [rootGroupRef]);
  return (
    <>
      <ButtonGroup size="small">
        <Button color="secondary" variant="outlined">
          <Tooltip arrow title="上一步" placement="top">
            <UndoRounded />
          </Tooltip>
        </Button>
        <Button
          color="info"
          variant="contained"
          onClick={() => {
            zoom();
          }}
        >
          <ZoomOutRounded />
        </Button>
        <Tooltip title="重置" arrow placement="top">
          <Button
            color="warning"
            variant="text"
            onClick={() => {
              if (prop.resetFn) prop.resetFn();
            }}
          >
            {scale}
          </Button>
        </Tooltip>
        <Button
          color="info"
          variant="contained"
          onClick={() => {
            zoom(true);
          }}
        >
          <ZoomInRounded />
        </Button>
        <Button color="secondary" variant="outlined">
          <Tooltip arrow title="下一步" placement="top">
            <RedoRounded />
          </Tooltip>
        </Button>
      </ButtonGroup>
      <ColorPicker
        title="背景颜色"
        type="circle"
        currentColor={prop.bgColor}
        setCurrentColor={prop.setBgColor}
      ></ColorPicker>
    </>
  );
}
