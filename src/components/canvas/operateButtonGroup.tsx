import {
  ChangeCircleOutlined,
  OutputOutlined,
  GridOffRounded,
  GridOnRounded,
  AddchartRounded,
  AddAPhotoOutlined,
  RestartAltOutlined,
} from "@mui/icons-material";
import { ButtonGroup, Button } from "@mui/material";
import { useSnackbar } from "notistack";
import { Dispatch, SetStateAction, useContext } from "react";
import { lb } from "~/pages/utils/const/anchorOrigin";
import { canvasGuideSteps, DataContext } from "~/pages/workSpace";
import { ChartController } from "~/pages/utils/charts/generator/Controller";
import { outputSVG, outputPNG } from "~/pages/utils/outputImg";
import { CanvasContext } from "../canvas";

export function OperateButtonGroup(prop: {
  setDataModalOpen: Dispatch<SetStateAction<boolean>>;
  setChartModalOpen: Dispatch<SetStateAction<boolean>>;
  setShowGrid: Dispatch<SetStateAction<boolean>>;
  showGrid: boolean;
}) {
  const { svgRef, rootGroupRef } = useContext(CanvasContext);
  const { data } = useContext(DataContext);
  const { enqueueSnackbar } = useSnackbar();
  const { setDataModalOpen, setChartModalOpen } = prop;
  return (
    <div id={canvasGuideSteps.buttonGroup}>
      <ButtonGroup
        sx={{
          height: "40px",
          borderRadius: "20px",
          overflow: "hidden",
        }}
        fullWidth
      >
        <Button
          variant="contained"
          color="info"
          startIcon={<ChangeCircleOutlined />}
          onClick={() => {
            if (data === null) {
              enqueueSnackbar({
                message: "请先选择文件！",
                variant: "warning",
                anchorOrigin: lb,
              });
              return;
            }
            setDataModalOpen(true);
          }}
        >
          字段修改
        </Button>
        <Button
          variant="contained"
          color="primary"
          startIcon={<OutputOutlined />}
          onClick={() => {
            if (svgRef && svgRef.current) outputSVG(svgRef.current);
          }}
        >
          导出SVG
        </Button>
        <Button
          variant="contained"
          color="success"
          startIcon={prop.showGrid ? <GridOffRounded /> : <GridOnRounded />}
          onClick={() => {
            prop.setShowGrid(!prop.showGrid);
          }}
        >
          {prop.showGrid ? "关闭网格" : "打开网格"}
        </Button>
        <Button
          variant="contained"
          color="error"
          id={canvasGuideSteps.chartGenerate}
          startIcon={<AddchartRounded />}
          onClick={() => {
            if (data === null) {
              enqueueSnackbar({
                message: "请先选择文件！",
                variant: "warning",
                anchorOrigin: lb,
              });
              return;
            }
            setChartModalOpen(true);
          }}
        >
          生成图表
        </Button>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddAPhotoOutlined />}
          onClick={() => {
            if (svgRef && svgRef.current) outputPNG(svgRef.current);
          }}
        >
          导出PNG
        </Button>
        <Button
          variant="contained"
          color="warning"
          startIcon={<RestartAltOutlined />}
          onClick={() => {
            if (
              svgRef &&
              rootGroupRef &&
              svgRef.current &&
              rootGroupRef.current
            ) {
              ChartController.removeInstance();
              rootGroupRef.current.innerHTML = "";
            }
          }}
        >
          清空画布
        </Button>
      </ButtonGroup>
    </div>
  );
}
