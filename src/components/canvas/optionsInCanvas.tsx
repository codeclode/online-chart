import {
  ArrowDropDown,
  ArrowRight,
  CenterFocusStrongRounded,
  RedoRounded,
  UndoRounded,
  ZoomInRounded,
  ZoomOutRounded,
} from "@mui/icons-material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import {
  Box,
  Button,
  ButtonGroup,
  Card,
  Grid,
  Tab,
  Tabs,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { blue, grey } from "@mui/material/colors";
import { Stack } from "@mui/system";
import { ChangeEvent, MouseEvent, MutableRefObject, useCallback } from "react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { ChartController } from "~/utils/charts/generator/Controller";
import { ColorPicker } from "../inputComponent/colorPicker";

const origins: {
  name: string;
  position: string;
}[] = [
  {
    name: "左上",
    position: "left top",
  },
  {
    name: "上",
    position: "center top",
  },
  {
    name: "右上",
    position: "right top",
  },
  {
    name: "左",
    position: "left center",
  },
  {
    name: "中",
    position: "center center",
  },
  {
    name: "右",
    position: "right center",
  },
  {
    name: "左下",
    position: "left bottom",
  },
  {
    name: "下",
    position: "center bottom",
  },
  {
    name: "右下",
    position: "right bottom",
  },
];
function BGSetting(prop: {
  svgRef: MutableRefObject<SVGSVGElement | null>;
  rootGroupRef: MutableRefObject<SVGGElement | null>;
  bgColor: string;
  setBgColor: Dispatch<SetStateAction<string>>;
  resetFn: (() => void) | undefined;
}) {
  const [scale, setScale] = useState<string>("100%");
  const zoom = useCallback(
    (isIn: boolean = false) => {
      if (prop.svgRef.current === null) return;
      let { x, y, height, width } = prop.svgRef.current.getBoundingClientRect();
      var scrollEvent = new WheelEvent("wheel", {
        bubbles: true,
        cancelable: true,
        clientX: x + width / 2,
        clientY: y + height / 2,
        deltaX: 0,
        deltaY: isIn ? -120 : 120,
      });
      prop.svgRef.current.dispatchEvent(scrollEvent);
    },
    [prop.svgRef]
  );
  useEffect(() => {
    if (prop.rootGroupRef.current !== null) {
      let gScaleOb = new MutationObserver((mutations) => {
        let scale = prop.rootGroupRef.current!.getAttribute("transform");
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
      });
      gScaleOb.observe(prop.rootGroupRef.current, {
        attributes: true,
      });
      return () => {
        gScaleOb.disconnect();
      };
    }
  }, [prop.rootGroupRef]);
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

function TransformOriginControl(prop: { chartController: ChartController }) {
  const [origin, setOrigin] = useState<string>("左上");
  const handleChange = (event: MouseEvent<HTMLElement>, newOrigin: string) => {
    if (newOrigin === null) return;
    setOrigin(newOrigin);
    prop.chartController.target.setTransformOrigin(newOrigin);
  };
  useEffect(() => {
    setOrigin(prop.chartController.target.origin);
  }, [prop.chartController]);
  const control = {
    value: origin,
    onChange: handleChange,
    exclusive: true,
  };
  const originChoice = function (group: number) {
    return (
      <ToggleButtonGroup fullWidth {...control}>
        {origins.slice(group * 3, group * 3 + 3).map((v) => {
          return (
            <ToggleButton
              sx={{ borderRadius: "0", border: "1px solid " + blue[100] }}
              color="info"
              key={v.name}
              value={v.position}
            >
              {
                <CenterFocusStrongRounded
                  color={origin === v.position ? "info" : "action"}
                ></CenterFocusStrongRounded>
              }
            </ToggleButton>
          );
        })}
      </ToggleButtonGroup>
    );
  };
  return (
    <Stack spacing={0} alignItems="center">
      {originChoice(0)}
      {originChoice(1)}
      {originChoice(2)}
    </Stack>
  );
}

function ChartSetting(prop: { chartController: ChartController }) {
  const { chartController } = prop;
  const [tabValue, setTabValue] = useState<string>("1");
  const [transform, setTransform] = useState(
    chartController.target.getTransform()
  );
  const [ob, setOB] = useState(
    new MutationObserver((recoards) => {
      setTransform(chartController.target.getTransform());
    })
  );
  useEffect(() => {
    ob.disconnect();
    let newOB = new MutationObserver((recoards) => {
      setTransform(chartController.target.getTransform());
    });
    setTransform(chartController.target.getTransform());
    newOB.observe(chartController.node, {
      attributes: true,
    });
    setOB(newOB);
    return () => {
      ob.disconnect();
    };
  }, [chartController]);
  return (
    <>
      <TabContext value={tabValue}>
        <Box width="100%" sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList
            variant="scrollable"
            onChange={(event: React.SyntheticEvent, newValue: string) => {
              setTabValue(newValue);
            }}
          >
            <Tab label="位置" value="1" />
            <Tab label="信息" value="2" />
            <Tab label="颜色" value="3" />
          </TabList>
        </Box>
        <TabPanel value="1">
          <Stack gap={1}>
            <TextField
              type="number"
              label="x"
              value={transform.x}
              onChange={(
                event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
              ) => {
                chartController.target.setTranslate(
                  Number(event.target.value),
                  transform.y
                );
              }}
            ></TextField>
            <TextField
              type="number"
              label="y"
              value={transform.y}
              onChange={(
                event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
              ) => {
                chartController.target.setTranslate(
                  transform.x,
                  Number(event.target.value)
                );
              }}
            ></TextField>
            <TextField
              type="number"
              label="scaleX"
              value={transform.scaleX}
              onChange={(
                event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
              ) => {
                chartController.target.scale(
                  Number(event.target.value),
                  transform.scaleY
                );
              }}
            ></TextField>
            <TextField
              type="number"
              label="scaleY"
              value={transform.scaleY}
              onChange={(
                event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
              ) => {
                chartController.target.scale(
                  transform.scaleX,
                  Number(event.target.value)
                );
              }}
            ></TextField>
            <TextField
              type="number"
              label="rotation"
              value={transform.rotation}
              onChange={(
                event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
              ) => {
                chartController.target.rotate(Number(event.target.value) % 360);
              }}
            ></TextField>
            <TransformOriginControl
              chartController={chartController}
            ></TransformOriginControl>
          </Stack>
        </TabPanel>
        <TabPanel value="2">信息</TabPanel>
        <TabPanel value="3">颜色</TabPanel>
      </TabContext>
    </>
  );
}

export function OptionsInCanvas(prop: {
  type: "pie" | "hoist";
  svgRef: MutableRefObject<SVGSVGElement | null>;
  rootGroupRef: MutableRefObject<SVGGElement | null>;
  bgColor: string;
  setBgColor: Dispatch<SetStateAction<string>>;
  resetFn: (() => void) | undefined;
  chartController: ChartController | null;
}) {
  const theme = useTheme();
  const [fold, setFlod] = useState<boolean>(false);
  const GM = useMediaQuery(theme.breakpoints.up("md"));
  const [title, setTitle] = useState<string>("画布设置");
  useEffect(() => {
    if (prop.chartController) {
      setTitle("图形设置");
    } else {
      setTitle("画布设置");
    }
  }, [prop.chartController]);

  return (
    <Card
      sx={{
        position: "absolute",
        left: "10px",
        top: "10px",
        width: GM ? "20%" : "35%",
        height: fold ? "auto" : "75%",
        border: "3px solid " + grey[200],
        borderRadius: "10px",
        overflow: fold ? "hidden" : "auto",
      }}
    >
      <Stack gap="10px" position="relative" alignItems="center">
        <Stack
          width="100%"
          direction="row"
          justifyContent="space-around"
          alignItems="center"
          position="sticky"
          zIndex="2"
          top="0"
          bgcolor="white"
        >
          <Typography variant="body1" color="teal">
            {title}
          </Typography>
          <Tooltip title={fold ? "打开" : "折起"} arrow placement="right">
            <Button
              onClick={() => {
                setFlod(!fold);
              }}
              variant="text"
              size="small"
            >
              {fold ? (
                <ArrowRight color="action" />
              ) : (
                <ArrowDropDown color="action" />
              )}
            </Button>
          </Tooltip>
        </Stack>
        {fold ? null : prop.chartController ? (
          <ChartSetting chartController={prop.chartController}></ChartSetting>
        ) : (
          <BGSetting {...prop}></BGSetting>
        )}
      </Stack>
    </Card>
  );
}
