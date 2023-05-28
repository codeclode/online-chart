import { ArrowDropDown, ArrowRight } from "@mui/icons-material";
import {
  Button,
  Card,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { grey } from "@mui/material/colors";
import { Stack } from "@mui/system";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { canvasGuideSteps } from "~/pages/workSpace";
import { ChartController } from "~/pages/utils/charts/generator/Controller";
import { BGSetting } from "./options/bgSetting";
import { ChartSetting } from "./options/chartSetting";

export function OptionsInCanvas(prop: {
  type: "pie" | "hoist";
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
      id={canvasGuideSteps.chartModal}
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
