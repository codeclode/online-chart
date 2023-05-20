import { CenterFocusStrongRounded } from "@mui/icons-material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import {
  ToggleButtonGroup,
  ToggleButton,
  Stack,
  Box,
  Tab,
  TextField,
  Button,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
} from "@mui/material";
import { blue } from "@mui/material/colors";
import { useState, useEffect, ChangeEvent, MouseEvent } from "react";
import { ChartController } from "~/utils/charts/generator/Controller";
import { getColor } from "~/utils/charts/generator/util";

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

function ChartDataInfo(prop: { chartController: ChartController }) {
  const { chartController } = prop;
  const chart = chartController.target;
  const [searchKeyWord, setSearchKeyWord] = useState<string>("");
  const data = chartController.target.data;
  return (
    <TableContainer sx={{ width: "95%" }}>
      <Table size="small" stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell align="center" colSpan={chart.columns.length + 1}>
              <TextField
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  setSearchKeyWord(e.target.value);
                }}
                value={searchKeyWord}
                size="small"
                color="info"
                label="search"
              ></TextField>
            </TableCell>
          </TableRow>
          <TableRow>
            {chart.columns.map((v) => {
              return (
                <TableCell key={v} align="center">
                  {v}
                </TableCell>
              );
            })}
            <TableCell align="center">color</TableCell>
          </TableRow>
          {[...data.keys()]
            .filter((v) => {
              return searchKeyWord === "" || v.includes(searchKeyWord);
            })
            .map((k, i) => {
              const d = data.get(k);
              return typeof d === "object" ? null : (
                <TableRow key={k}>
                  <TableCell align="center">{k}</TableCell>
                  <TableCell align="center">{d}</TableCell>
                  <TableCell
                    align="center"
                    padding="checkbox"
                    sx={{
                      backgroundColor: chart.colorMap.get(k),
                      backgroundClip: "content-box",
                    }}
                  ></TableCell>
                </TableRow>
              );
            })}
        </TableHead>
      </Table>
    </TableContainer>
  );
}

export function ChartSetting(prop: { chartController: ChartController }) {
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
        <TabPanel sx={{ width: "100%", m: 0, p: 0 }} value="2">
          <ChartDataInfo chartController={chartController}></ChartDataInfo>
        </TabPanel>
        <TabPanel sx={{ width: "95%", m: 0, p: 0 }} value="3">
          <Button
            variant="contained"
            color="info"
            fullWidth
            onClick={() => {
              window.open(
                "https://github.com/d3/d3-scale-chromatic/blob/v3.0.0/README.md#" +
                  chartController.target.colorSet,
                "__blank"
              );
            }}
          >
            <Typography
              textOverflow="ellipsis"
              sx={{
                wordWrap: "none",
                overflow: "hidden",
                whiteSpace: "nowrap",
              }}
            >
              {chartController.target.colorSet}
            </Typography>
          </Button>
        </TabPanel>
      </TabContext>
    </>
  );
}
