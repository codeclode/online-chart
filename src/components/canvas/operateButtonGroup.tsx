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
import { MutableRefObject, Dispatch, SetStateAction } from "react";
import { ArcChart } from "~/utils/charts/generator/Arc";
import { ChartController } from "~/utils/charts/generator/Controller";
import { outputSVG, outputPNG } from "~/utils/outputImg";

export function OperateButtonGroup(prop: {
  svgRef: MutableRefObject<SVGSVGElement | null>;
  rootGroundRef: MutableRefObject<SVGGElement | null>;
  setModalOpen: Dispatch<SetStateAction<boolean>>;
  setShowGrid: Dispatch<SetStateAction<boolean>>;
  showGrid: boolean;
}) {
  const { setModalOpen } = prop;
  return (
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
        onClick={() => setModalOpen(true)}
      >
        字段修改
      </Button>
      <Button
        variant="contained"
        color="primary"
        startIcon={<OutputOutlined />}
        onClick={() => {
          if (prop.svgRef.current) outputSVG(prop.svgRef.current);
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
        startIcon={<AddchartRounded />}
        onClick={() => {
          if (prop.rootGroundRef.current) {
            let arc = new ArcChart(50, 50, 20);
            arc.generateNode(prop.rootGroundRef.current);
          }
        }}
      >
        生成图表
      </Button>
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddAPhotoOutlined />}
        onClick={() => {
          if (prop.svgRef.current) outputPNG(prop.svgRef.current);
        }}
      >
        导出PNG
      </Button>
      <Button
        variant="contained"
        color="warning"
        startIcon={<RestartAltOutlined />}
        onClick={() => {
          if (prop.svgRef.current && prop.rootGroundRef.current) {
            ChartController.removeInstance();
            prop.rootGroundRef.current.innerHTML = "";
          }
        }}
      >
        清空画布
      </Button>
    </ButtonGroup>
  );
}
