import { AddRounded, ColorizeRounded } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import {
  Button,
  ButtonGroup,
  debounce,
  Grid,
  IconButton,
  Slider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { rgb } from "d3";
import { enqueueSnackbar } from "notistack";
import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import { ct } from "~/pages/utils/const/anchorOrigin";
import { trpc } from "~/utils/trpc";

function SliderColor(prop: {
  onChange: (v: number) => void;
  value: number;
  label: string;
}) {
  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      width="100%"
    >
      <Typography variant="caption">{prop.label}</Typography>
      <Slider
        color={
          (prop.label === "r"
            ? "error"
            : prop.label === "g"
            ? "success"
            : "info") as "primary" //呃呃
        }
        onChange={(_e, v) => {
          prop.onChange(v as number);
        }}
        value={prop.value}
        sx={{ width: "calc(100% - 2em)" }}
        valueLabelDisplay="auto"
        min={0}
        max={255}
      ></Slider>
    </Stack>
  );
}

export function DispersedPicker(prop: {
  currentID: string;
  setCurrentID: (id: string) => void;
}) {
  const { currentID, setCurrentID } = prop;
  const [pending, setPending] = useState<boolean>(false);
  const trpcContext = trpc.useContext();
  const [colors, setColors] = useState<string[]>([]);
  const [color, setColor] = useState<{
    r: number;
    g: number;
    b: number;
  }>({
    r: 0,
    g: 0,
    b: 0,
  });
  const [name, setName] = useState<string>("newColor");
  const getInitColor = useCallback(async () => {
    let id = currentID;
    if (id === "") {
      setName("new ColorSet");
      setColors([]);
    } else {
      let colorSet = await trpcContext.client.user.getColorByID.query(id);
      setName(colorSet.name);
      setColors(colorSet.colors);
    }
  }, [currentID]);
  useEffect(() => {
    getInitColor();
  }, [currentID]);
  const dSetColor = debounce(useCallback(setColor, []));
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  return (
    <Stack
      direction="row"
      p="2%"
      alignItems="flex-start"
      justifyContent="space-around"
    >
      <Grid width="70%" mt="5vh" spacing={0} mr="2%" container>
        {colors.map((v, i) => {
          return (
            <Grid
              sx={{
                aspectRatio: "1/1",
                height: "auto",
                backgroundColor: v,
              }}
              className={i === currentIndex ? "dispersedController" : ""}
              xs={1}
              key={v}
              item
              onClick={() => {
                let color = rgb(v);
                setCurrentIndex(i);
                setColor({ r: color.r, g: color.g, b: color.b });
              }}
            ></Grid>
          );
        })}
        <Grid
          sx={{
            aspectRatio: "1/1",
            height: "auto",
            backgroundColor: "transparent",
            boxShadow: "0 0 5px 0 green inset",
          }}
          xs={1}
          item
          onClick={() => {
            console.log("add");
          }}
        >
          <IconButton
            onClick={() => {
              setCurrentIndex(-1);
            }}
            color="success"
            sx={{ width: "100%", height: "100%" }}
          >
            <AddRounded fontSize="large"></AddRounded>
          </IconButton>
        </Grid>
        <Grid item pt={5} xs={12}>
          <Box
            display="flex"
            gap={2}
            flexDirection="column"
            alignItems="center"
          >
            <TextField
              label="name"
              color="info"
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setName(e.target.value.trim().slice(0, 20));
              }}
              value={name}
            ></TextField>
            <LoadingButton
              loading={pending}
              onClick={async () => {
                try {
                  if (colors.length <= 2) {
                    enqueueSnackbar({
                      message: "至少需要3个颜色",
                      variant: "warning",
                      anchorOrigin: ct,
                    });
                    return;
                  }
                  setPending(true);
                  let retColors =
                    await trpcContext.client.user.upsertPresetColor.mutate({
                      id: currentID === "" ? null : currentID,
                      name: name,
                      colors: colors,
                      positions: null,
                    });
                  setCurrentID(retColors.id);
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
              variant="contained"
              color="success"
            >
              {currentID === "" ? "添加颜色集" : "提交更改"}
            </LoadingButton>
          </Box>
        </Grid>
      </Grid>
      <Stack direction="row" alignItems="flex-start" width="20%" mt="5vh">
        <Stack gap={2} justifyContent="center" width="100%" alignItems="center">
          <Typography variant="h4">颜色配置</Typography>{" "}
          <TextField
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              let color = rgb(e.target.value);
              dSetColor({
                r: color.r,
                g: color.g,
                b: color.b,
              });
            }}
            value={rgb(color.r, color.g, color.b).formatHex()}
            fullWidth
            type="color"
            label="color"
          ></TextField>
          {Object.keys(color).map((k) => {
            return (
              <SliderColor
                key={k}
                label={k}
                value={color[k as keyof typeof color]}
                onChange={(v: number) => {
                  setColor({
                    ...color,
                    [k]: v,
                  });
                }}
              ></SliderColor>
            );
          })}
          <TextField
            label="hex"
            fullWidth
            color="info"
            disabled
            value={rgb(color.r, color.g, color.b).formatHex()}
          ></TextField>
          <IconButton
            onClick={() => {
              if ("EyeDropper" in window) {
                let example = new (window as any).EyeDropper()
                  .open()
                  .then((e: { sRGBHex: string }) => {
                    let newColor = rgb(e.sRGBHex);
                    setColor({ r: newColor.r, g: newColor.g, b: newColor.b });
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
          <Box
            width="40%"
            sx={{
              aspectRatio: "1/1",
              height: "auto",
              backgroundColor: rgb(color.r, color.g, color.b).toString(),
            }}
          ></Box>
          <ButtonGroup fullWidth variant="contained">
            <Button
              onClick={() => {
                let hex = rgb(color.r, color.g, color.b).formatHex();
                if (colors.includes(hex)) {
                  enqueueSnackbar({
                    message: "颜色已存在",
                    variant: "warning",
                    anchorOrigin: ct,
                  });
                  return;
                }
                if (currentIndex === -1) {
                  setColors([
                    ...colors,
                    rgb(color.r, color.g, color.b).formatHex(),
                  ]);
                } else {
                  setColors([
                    ...colors.slice(0, currentIndex),
                    rgb(color.r, color.g, color.b).formatHex(),
                    ...colors.slice(currentIndex + 1),
                  ]);
                }
              }}
              color="info"
            >
              {currentIndex === -1 ? "添加" : "保存"}
            </Button>
            <Button
              onClick={() => {
                setColors([
                  ...colors.slice(0, currentIndex),
                  ...colors.slice(currentIndex + 1),
                ]);
                setCurrentIndex(-1);
              }}
              disabled={currentIndex === -1}
            >
              删除
            </Button>
          </ButtonGroup>
        </Stack>
      </Stack>
    </Stack>
  );
}
