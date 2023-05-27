import {
  Box,
  Button,
  Grid,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  SvgIconComponent,
  InsertChartOutlinedRounded,
} from "@mui/icons-material";
import { Stack } from "@mui/system";
import { features } from "./utils/const/features";
import { AppHeader } from "~/components/appHeader";
import { bigButton } from "./utils/const/color";
import { useRouter } from "next/router";
import { workSpacePath } from "./utils/const/routers";
import { useEffect, useState } from "react";
import { Step } from "react-joyride";
import dynamic from "next/dynamic";
import { GuideLocal } from "./utils/const/guideLocal";

function FeatureCard(prop: {
  feature: string;
  info: string;
  icon: SvgIconComponent;
  iconColor: string;
}) {
  return (
    <Grid
      item
      xs={6}
      sx={{
        border: "2px solid rgba(220,220,220,0.7)",
        backdropFilter: "blur(4px)",
        background: "linear-gradient(90deg, #00000000,#8f8f8f2f,#00000000)",
        borderRadius: "10px",
        mt: "15px",
        p: "15px",
      }}
    >
      <Stack sx={{ fontSize: "26px" }} direction="row" alignItems="center">
        <prop.icon
          sx={{
            fontSize: "32px",
            color: prop.iconColor,
          }}
        ></prop.icon>
        <div
          style={{ marginLeft: "5px", fontWeight: "bolder", color: "#3a5169" }}
        >
          {prop.feature}
        </div>
      </Stack>
      <Typography
        style={{ color: "#4e6e8e", fontWeight: "bold" }}
        variant="body1"
      >
        {prop.info}
      </Typography>
    </Grid>
  );
}
const JoyRideNoSSR = dynamic(() => import("react-joyride"), { ssr: false });

export const indexGuideStepsID = {
  appHeaderMenuStep: "guide-headerMenu",
  avatarStep: "guide-avatar",
  startStep: "guide-start",
  reStudyStep: "guide-reStudy",
};

const steps: Step[] = [
  {
    target: "#" + indexGuideStepsID.appHeaderMenuStep,
    content: "单击此按钮获取其他信息",
  },
  {
    target: "#" + indexGuideStepsID.avatarStep,
    content: "登录或展开菜单，方便登出、预设置颜色以及进入画布",
  },
  {
    target: "#" + indexGuideStepsID.reStudyStep,
    content: "重新进行新手指引",
  },
  {
    target: "#" + indexGuideStepsID.startStep,
    content: "开始！",
  },
];

const storageFlag = "indexGuideFinish";

export default function IndexPage() {
  const theme = useTheme();
  const LLsm = useMediaQuery(theme.breakpoints.down("sm"));
  const router = useRouter();
  const [guideRun, setGuideRun] = useState<boolean>(false);
  useEffect(() => {
    localStorage.getItem(storageFlag) === "1"
      ? setGuideRun(false)
      : setGuideRun(true);
  }, []);
  return (
    <div>
      <AppHeader></AppHeader>
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
        styles={{
          tooltipContainer: {
            textAlign: "left",
          },
          buttonNext: {
            backgroundColor: "#6cf",
          },
          buttonBack: {
            marginRight: 10,
          },
        }}
      />
      <Stack sx={{ m: 1 }} alignItems="center" direction="column">
        <Stack alignItems="center">
          <InsertChartOutlinedRounded
            sx={{
              fontSize: "15vw",
              color: "#8acc94",
            }}
          ></InsertChartOutlinedRounded>
          <Typography
            variant={LLsm ? "h2" : "h1"}
            sx={{
              color: "transparent",
              background: "linear-gradient(to right, #6cf, #9c6, #acc)",
              backgroundClip: "text",
              fontStyle: "italic",
              position: "relative",
              "&::before": {
                content: '"onLine Charts"',
                position: "absolute",
                top: 0,
                left: 0,
                color: "transparent",
                WebkitTextStroke: "5px #b9afaf",
                zIndex: -1,
              },
              boxShadow: "",
            }}
          >
            onLine Charts
          </Typography>
          <Typography variant="h5" color="GrayText">
            在线投入数据，进行自由地可视化分析
          </Typography>
          <Box
            width={LLsm ? "40%" : "80%"}
            sx={{
              display: "flex",
              fontSize: "2em",
            }}
            flexDirection="row"
            justifyContent="space-around"
          >
            <Button
              id={indexGuideStepsID.startStep}
              variant="contained"
              sx={{ ...bigButton, ...{ fontSize: LLsm ? "0.4em" : "1em" } }}
              size="large"
              onClick={() => {
                router.push(workSpacePath);
              }}
            >
              开始
            </Button>
            <Button
              id={indexGuideStepsID.reStudyStep}
              size="large"
              variant="contained"
              sx={{ ...bigButton, ...{ fontSize: LLsm ? "0.4em" : "1em" } }}
              color="secondary"
              onClick={() => {
                setGuideRun(true);
              }}
            >
              指引
            </Button>
          </Box>
        </Stack>
        <Grid
          justifyContent="space-around"
          sx={{ maxWidth: "800px" }}
          columns={LLsm ? 7 : 21}
          container
        >
          {features.map((v) => {
            return <FeatureCard key={v.feature} {...v}></FeatureCard>;
          })}
        </Grid>
      </Stack>
    </div>
  );
}
