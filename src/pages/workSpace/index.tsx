import { Grid } from "@mui/material";
import { DSVRowArray } from "d3";
import { createContext, Dispatch, SetStateAction, useState } from "react";
import { useEffect } from "react";
import { useRef } from "react";
import { AppHeader } from "~/components/appHeader";
import { FileInput } from "~/components/fileInput";
import { CanvasWithOptions } from "~/components/canvas";
import { DataTypeString } from "~/pages/utils/const/dataWorkers";
import { Step } from "react-joyride";
import dynamic from "next/dynamic";
import { GuideLocal } from "../utils/const/guideLocal";

export const DataContext = createContext<{
  data: null | DSVRowArray<string>;
  setData: null | Dispatch<SetStateAction<DSVRowArray<string> | null>>;
  dataTypes: DataTypeString[] | null;
  setDataTypes: null | Dispatch<SetStateAction<DataTypeString[] | null>>;
}>({
  data: null,
  setData: null,
  dataTypes: null,
  setDataTypes: null,
});

const JoyRideNoSSR = dynamic(() => import("react-joyride"), { ssr: false });
export const canvasGuideSteps = {
  fileInput: "guide-file-choose",
  chartModal: "guide-chart-modal",
  buttonGroup: "guide-button-group",
  chartGenerate: "guide-chart-generate-button",
};
const steps: Step[] = [
  {
    target: "#" + canvasGuideSteps.fileInput,
    content: "点击上传csv文件",
  },
  {
    target: "#" + canvasGuideSteps.chartModal,
    content: "画布、图表控制器，单击生成的图表可以切换到图表控制器形态",
  },
  {
    target: "#" + canvasGuideSteps.buttonGroup,
    content: "选项功能",
  },
  {
    target: "#" + canvasGuideSteps.chartGenerate,
    content: "试试生成图表吧！",
  },
];
const storageFlag = "canvasGuideFinish";

export default function () {
  const headerRef = useRef<HTMLDivElement | null>(null);
  const [headerHeight, setHeaderHeight] = useState(64);
  const [data, setData] = useState<null | DSVRowArray<string>>(null);
  const [dataTypes, setDataTypes] = useState<null | DataTypeString[]>(null);
  useEffect(() => {
    if (headerRef.current) {
      setHeaderHeight(headerRef.current.getBoundingClientRect().height);
    }
  }, [headerRef.current]);
  const [guideRun, setGuideRun] = useState<boolean>(false);
  useEffect(() => {
    localStorage.getItem(storageFlag) === "1"
      ? setGuideRun(false)
      : setGuideRun(true);
  }, []);
  return (
    <DataContext.Provider value={{ data, setData, dataTypes, setDataTypes }}>
      <AppHeader ref={headerRef}></AppHeader>
      <JoyRideNoSSR
        locale={GuideLocal}
        callback={(data) => {
          if (data.status === "finished") {
            setGuideRun(false);
            localStorage.setItem(storageFlag, "1");
          }
        }}
        run={guideRun}
        disableOverlayClose={true}
        steps={steps}
        continuous={true}
        showSkipButton={true}
        showProgress={true}
      />
      <Grid
        sx={{
          height: `calc(100vh - ${headerHeight + 25}px)`,
          m: "0",
          mt: "25px",
          px: "15px",
          overflow: "auto",
        }}
        container
        columns={24}
      >
        <Grid item xs="auto">
          <FileInput headerHeight={headerHeight}></FileInput>
        </Grid>
        <Grid item xs>
          <CanvasWithOptions headerHeight={headerHeight}></CanvasWithOptions>
        </Grid>
      </Grid>
    </DataContext.Provider>
  );
}
