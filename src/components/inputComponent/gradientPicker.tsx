import { ColorizeRounded } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import {
  Button,
  ButtonGroup,
  debounce,
  Grid,
  IconButton,
  Slider,
  TextField,
} from "@mui/material";
import { Stack } from "@mui/system";
import { rgb } from "d3";
import { useSnackbar } from "notistack";
import {
  ChangeEvent,
  Fragment,
  MouseEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { ct } from "~/pages/utils/const/anchorOrigin";
import { trpc } from "~/utils/trpc";

export type gradientStop = {
  position: number;
  color: string;
};

export function GradientPicker(prop: {
  currentID: string;
  setCurrentID: (id: string) => void;
}) {
  const { currentID, setCurrentID } = prop;
  const trpcContext = trpc.useContext();
  const [pending, setPending] = useState<boolean>(false);
  const [isDraging, setIsDraging] = useState<boolean>(false);
  const rectRef = useRef<SVGRectElement | null>(null);
  const [colorSet, setColorSet] = useState<gradientStop[]>([
    {
      color: "#66ccff",
      position: 50,
    },
  ]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const changeColor = useCallback(
    (color: gradientStop) => {
      setColorSet([
        ...colorSet.slice(0, currentIndex),
        color,
        ...colorSet.slice(currentIndex + 1),
      ]);
    },
    [currentIndex, colorSet]
  );
  const [name, setName] = useState<string>("newColor");
  const { enqueueSnackbar } = useSnackbar();
  useEffect(() => {
    async function initColor() {
      setCurrentIndex(0);
      if (currentID !== "") {
        try {
          let colors = await trpcContext.client.user.getColorByID.query(
            currentID
          );
          let colorSet = colors.colors.map((v, i) => {
            return {
              color: v,
              position: colors.positions[i] as number,
            };
          });
          setColorSet(colorSet);
        } catch (e) {
          enqueueSnackbar({
            message: "网络错误",
            variant: "error",
            anchorOrigin: ct,
          });
        }
      } else {
        setColorSet([
          {
            color: "#6cf",
            position: 50,
          },
        ]);
      }
    }
    initColor();
  }, [currentID]);
  const dChangeColor = debounce(changeColor);
  const currentColor = colorSet[currentIndex];
  const addnewColor = function (p: number) {
    let per = Math.floor(p * 100);
    if (colorSet.map((v) => v.position).includes(p)) return;
    let newColor = {
      color: "#66ccff",
      position: per,
    };
    let newSet: typeof colorSet = [...colorSet, newColor].sort(
      (a, b) => a.position - b.position
    );
    setColorSet(newSet);
    setCurrentIndex(newSet.findIndex((v) => v === newColor));
  };
  const onMouseMove = (e: MouseEvent) => {
    let rect = rectRef.current;
    if (isDraging && rect) {
      let { x, width } = rect.getBoundingClientRect();
      let position = Math.floor(
        Number(((e.clientX - x) / width).toExponential(2)) * 100
      );
      let color = currentColor;
      if (!color) return;
      let preColor = colorSet[currentIndex - 1];
      if (preColor) {
        if (preColor.position >= position) return;
      }
      let nextColor = colorSet[currentIndex + 1];
      if (nextColor) {
        if (nextColor.position <= position) return;
      }
      if (position < 0 || position > 100) return;
      let newColor = {
        color: color ? color.color : "#6cf",
        position: position,
      };
      changeColor(newColor);
    }
  };
  const changRGB = useCallback(
    (s: "r" | "g" | "b", number: number) => {
      if (!currentColor) return;
      if (number < 0 || number > 255) return;
      let color = rgb(currentColor.color || "0");
      Reflect.set(color, s, number);
      changeColor({
        color: color.formatHex(),
        position: currentColor?.position || 0,
      });
    },
    [currentColor]
  );
  return (
    <Stack alignItems="center" gap="15px">
      <svg
        onMouseMove={onMouseMove}
        onMouseUp={() => {
          setIsDraging(false);
        }}
        width="60%"
        viewBox="-20 0 140 30"
      >
        <defs>
          <linearGradient id="gradient">
            {colorSet.map((v) => {
              return (
                <stop
                  key={v.position}
                  offset={`${v.position}%`}
                  stopColor={v.color}
                />
              );
            })}
          </linearGradient>
        </defs>
        <rect
          ref={rectRef}
          onClick={(e: MouseEvent<SVGRectElement>) => {
            let { x, width } = e.currentTarget.getBoundingClientRect();
            addnewColor(Number(((e.clientX - x) / width).toFixed(2)));
          }}
          x="0"
          y="10"
          width="100"
          height="20"
          fill="url(#gradient)"
        ></rect>
        {colorSet.map((v, i) => {
          return (
            <Fragment key={v.position}>
              <g>
                <circle
                  onMouseDown={() => {
                    if (i === currentIndex) {
                      setIsDraging(true);
                    }
                  }}
                  onClick={() => {
                    setCurrentIndex(i);
                  }}
                  cx={v.position}
                  cy="5"
                  r="2"
                  stroke={i === currentIndex ? "black" : "gray"}
                  strokeDasharray={i === currentIndex ? "1 1" : ""}
                  strokeWidth={i === currentIndex ? "0.5" : "1"}
                  className={i === currentIndex ? "gradientController" : ""}
                  fill={v.color}
                ></circle>
                <line
                  fill="white"
                  x1={v.position}
                  x2={v.position}
                  y1="7"
                  y2="30"
                  stroke={i === currentIndex ? "black" : "gray"}
                  strokeDasharray={i === currentIndex ? "1 1" : ""}
                  strokeWidth={i === currentIndex ? "0.5" : "1"}
                  className={i === currentIndex ? "gradientController" : ""}
                ></line>
              </g>
            </Fragment>
          );
        })}
      </svg>
      <TextField
        sx={{ width: "50%" }}
        label="name"
        color="info"
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          setName(e.target.value.trim().slice(0, 20));
        }}
        value={name}
      ></TextField>
      <Grid container width="60%">
        <Grid item xs={4}>
          <Stack
            height="100%"
            justifyContent="space-around"
            alignItems="center"
          >
            <TextField
              sx={{ width: "80px" }}
              value={currentColor ? currentColor.color : "#66ccff"}
              size="small"
              type="color"
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                dChangeColor({
                  color: e.target.value,
                  position: currentColor ? currentColor.position : 0,
                });
              }}
            ></TextField>
            <IconButton
              onClick={() => {
                if ("EyeDropper" in window) {
                  new (window as any).EyeDropper()
                    .open()
                    .then((e: { sRGBHex: string }) => {
                      changeColor({
                        color: e.sRGBHex,
                        position: currentColor ? currentColor.position : 0,
                      });
                    });
                } else {
                  enqueueSnackbar({
                    message: "当前浏览器不支持试色~~",
                    variant: "success",
                    anchorOrigin: ct,
                  });
                }
              }}
            >
              <ColorizeRounded />
            </IconButton>
            <Slider
              min={0}
              max={100}
              onChange={(_e, v) => {
                let color = currentColor;
                if (!color) return;
                let preColor = colorSet[currentIndex - 1];
                if (preColor) {
                  if (preColor.position >= (v as number)) return;
                }
                let nextColor = colorSet[currentIndex + 1];
                if (nextColor) {
                  if (nextColor.position <= (v as number)) return;
                }
                changeColor({ color: color.color, position: v as number });
              }}
              value={
                colorSet[currentIndex] ? colorSet[currentIndex]?.position : 0
              }
              aria-label="Default"
              valueLabelDisplay="auto"
              color="secondary"
            ></Slider>
            <ButtonGroup variant="contained">
              <Button
                color="error"
                onClick={() => {
                  if (colorSet.length <= 1) {
                    enqueueSnackbar({
                      message: "至少有一个颜色",
                      variant: "error",
                      anchorOrigin: ct,
                    });
                    return;
                  }
                  colorSet.splice(currentIndex, 1);
                  setColorSet(colorSet);
                  setCurrentIndex(-1);
                }}
              >
                删除
              </Button>
              <LoadingButton
                variant="contained"
                loading={pending}
                onClick={async () => {
                  try {
                    setPending(true);
                    let retColorSet =
                      await trpcContext.client.user.upsertPresetColor.mutate({
                        id: currentID === "" ? null : currentID,
                        name: name,
                        colors: colorSet.map((v) => v.color),
                        positions: colorSet.map((v) => v.position),
                      });
                    setCurrentID(retColorSet.id);
                    enqueueSnackbar({
                      message: "成功",
                      variant: "success",
                      anchorOrigin: ct,
                    });
                  } catch (e) {
                    enqueueSnackbar({
                      message: "网络错误",
                      variant: "error",
                      anchorOrigin: ct,
                    });
                  } finally {
                    setPending(false);
                  }
                }}
                color="success"
              >
                提交
              </LoadingButton>
            </ButtonGroup>
          </Stack>
        </Grid>
        <Grid item xs>
          <Stack
            width="100%"
            justifyContent="space-around"
            alignItems="center"
            direction="row"
            flexWrap="wrap"
          >
            <TextField
              size="small"
              type="number"
              color="error"
              label="r"
              value={rgb(currentColor?.color || "0").r}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                let r = Number(e.target.value);
                changRGB("r", r);
              }}
            ></TextField>
            <TextField
              size="small"
              type="number"
              color="success"
              label="g"
              value={rgb(currentColor?.color || "0").g}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                let g = Number(e.target.value);
                changRGB("g", g);
              }}
            ></TextField>
          </Stack>
          <Stack
            mt={3}
            width="100%"
            justifyContent="space-around"
            alignItems="center"
            direction="row"
            flexWrap="wrap"
          >
            <TextField
              size="small"
              type="number"
              color="info"
              label="b"
              value={rgb(currentColor?.color || "0").b}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                let b = Number(e.target.value);
                changRGB("b", b);
              }}
            ></TextField>
            <TextField
              size="small"
              disabled
              label="colorStr"
              value={rgb(currentColor?.color || "0").formatHex()}
            ></TextField>
          </Stack>
        </Grid>
      </Grid>
    </Stack>
  );
}
