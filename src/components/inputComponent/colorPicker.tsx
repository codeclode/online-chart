import { Box, Slider, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import { hsl, rgb } from "d3";
import { MutableRefObject, useCallback, useEffect, useState } from "react";
import { useRef } from "react";
import { BaseSyntheticEvent, Dispatch, FormEvent, SetStateAction } from "react";

function drawCircle(canvasRef: MutableRefObject<HTMLCanvasElement | null>) {
  if (canvasRef.current) {
    let { width: w, height: h } = canvasRef.current;
    let ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;
    else {
      ctx.clearRect(0, 0, w, h);
      let standardR = Math.min(w, h) / 3;
      for (let i = 0; i <= 50; i++) {
        let l = 0.5;
        let r = standardR * (0.02 * i) + 5;
        let gradient = ctx.createLinearGradient(w / 2 - r, 0, w / 2 + r, 0);
        for (let i = 0; i <= 180; i += 5) {
          gradient.addColorStop(i / 180, hsl(i, 1, l).rgb().toString());
        }
        ctx.strokeStyle = gradient;
        ctx.lineWidth = standardR * 0.04;
        ctx.beginPath();
        ctx.arc(w / 2, h / 2, r, 0, Math.PI);
        ctx.stroke();
        gradient = ctx.createLinearGradient(w / 2 + r, 0, w / 2 - r, 0);
        for (let i = 0; i <= 179; i += 5) {
          gradient.addColorStop(
            i / 180,
            hsl(i + 180, 1, l)
              .rgb()
              .toString()
          );
        }
        ctx.strokeStyle = gradient;
        ctx.lineWidth = standardR * 0.04;
        ctx.beginPath();
        ctx.arc(w / 2, h / 2, r, Math.PI, 0);
        ctx.stroke();
      }
    }
  }
}

function CirclePicker(prop: {
  setCurrentColor: Dispatch<SetStateAction<string>>;
  title: string;
  defaultColor: string;
}) {
  const { setCurrentColor } = prop;
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [RGB, setRGB] = useState<[number, number, number]>([-1, 255, 255]);
  const [s, setS] = useState(50);
  const [l, setL] = useState(50);
  const [a, setA] = useState(50);
  useEffect(() => drawCircle(canvasRef), [canvasRef]);
  const setColor = useCallback(
    (l: number, s: number, a: number, RGB: [number, number, number]) => {
      let color = hsl(rgb(RGB[0], RGB[1], RGB[2]).toString());
      color.s = s / 100;
      color.l = l / 100;
      color.opacity = a / 100;
      setCurrentColor(color.toString());
    },
    []
  );
  return (
    <Stack width="100%" alignItems="center">
      <Typography variant="caption">{prop.title}</Typography>
      <Box
        sx={{
          width: "100%",
          position: "relative",
          cursor: "pointer",
          overflow: "hidden",
        }}
      >
        <svg
          onClick={(e: BaseSyntheticEvent<MouseEvent>) => {
            if (!canvasRef.current) return;
            let ctx = canvasRef.current.getContext("2d");
            if (!ctx) return;
            let canvas = canvasRef.current;
            let { x, y, width } = canvas.getBoundingClientRect();
            let { x: mx, y: my } = e.nativeEvent;
            let dpr = canvas.width / width;
            let placeX = Math.floor((mx - x) * dpr);
            let placeY = Math.floor((my - y) * dpr);
            let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            let index = 4 * (placeY * imageData.height + placeX);
            let data = imageData.data;
            let [r, g, b] = [data[index], data[index + 1], data[index + 2]];
            if (r !== undefined && g !== undefined && b !== undefined) {
              if (data[index + 3] === undefined || data[index + 3] === 0)
                return;
              setRGB([r, g, b]);
              setColor(l, s, a, [r, g, b]);
            }
          }}
          viewBox="0 0 300 300"
          style={{
            width: "100%",
            aspectRatio: "1/1",
            height: "auto",
            position: "absolute",
          }}
          transform={`rotate(-${
            hsl(RGB[0] === -1 ? prop.defaultColor : rgb(...RGB).toString()).h
          })`}
        >
          <circle
            cx="80"
            cy="150"
            r="10"
            stroke="white"
            strokeWidth="5"
            fill={RGB[0] === -1 ? prop.defaultColor : rgb(...RGB).toString()}
          ></circle>
          <line
            x1="150"
            y1="150"
            x2="90"
            y2="150"
            stroke="white"
            strokeWidth="5"
          ></line>
        </svg>
        <canvas
          width="300"
          height="300"
          ref={canvasRef}
          style={{
            width: "100%",
            aspectRatio: "1/1",
            height: "auto",
          }}
        ></canvas>
      </Box>
      <Stack direction="column" sx={{ width: "100%" }} alignItems="center">
        <Slider
          value={s}
          sx={{ width: "80%" }}
          valueLabelDisplay="auto"
          onChange={(e, v) => {
            setS(v as number);
            setColor(l, v as number, a, RGB);
          }}
        />
        <Typography variant="caption">对比度</Typography>
      </Stack>

      <Stack direction="column" sx={{ width: "100%" }} alignItems="center">
        <Slider
          sx={{ width: "80%" }}
          value={l}
          color="secondary"
          valueLabelDisplay="auto"
          onChange={(e, v) => {
            setL(v as number);
            setColor(v as number, s, a, RGB);
          }}
        />
        <Typography variant="caption">透明度</Typography>
      </Stack>
      <Stack direction="column" sx={{ width: "100%" }} alignItems="center">
        <Slider
          sx={{ width: "80%" }}
          color="secondary"
          value={a}
          valueLabelDisplay="auto"
          onChange={(e, v) => {
            setA(v as number);
            setColor(l, s, v as number, RGB);
          }}
        />
        <Typography variant="caption">明度</Typography>
      </Stack>
    </Stack>
  );
}

export function ColorPicker(prop: {
  type: "standard" | "circle";
  currentColor: string;
  setCurrentColor: Dispatch<SetStateAction<string>>;
  title: string;
}) {
  const { type, currentColor, setCurrentColor } = prop;
  if (type === "standard") {
    return (
      <Stack gap="5px" direction="row" alignItems="center">
        <input
          type="color"
          value={currentColor}
          onInput={(e: FormEvent<HTMLInputElement>) => {
            setCurrentColor(e.currentTarget.value);
          }}
        ></input>
        <Typography variant="caption">{prop.title}</Typography>
      </Stack>
    );
  } else {
    return (
      <CirclePicker
        defaultColor={currentColor}
        setCurrentColor={setCurrentColor}
        title={prop.title}
      />
    );
  }
}
