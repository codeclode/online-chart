import {
  Modal,
  Backdrop,
  Fade,
  Stack,
  Button,
  ButtonGroup,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
  Box,
} from "@mui/material";
import { ChartType } from "@prisma/client";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { modalSX } from "~/pages/utils/types/const";
import {
  ChartDetail,
  ChartDetailComponent,
} from "~/utils/charts/generator/util";

export function ChartModal(prop: {
  setModalOpen: Dispatch<SetStateAction<boolean>>;
  modalOpen: boolean;
}) {
  const [confirm, setConfirm] = useState<boolean>(false);
  const [chartType, setChartType] = useState<ChartType>("PIE");
  const [ChartComponent, setChartComponent] = useState<ChartDetailComponent>(
    () => ChartDetail[chartType]
  );
  useEffect(() => {
    setChartComponent(() => ChartDetail[chartType]);
  }, [chartType]);
  const { setModalOpen } = prop;
  return (
    <Modal
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
        },
      }}
      open={prop.modalOpen}
      onClose={() => {
        setModalOpen(false);
        return;
      }}
    >
      <Fade in={prop.modalOpen}>
        <Stack gap={1} sx={modalSX} alignItems="center">
          <Typography variant="h4">生成图表</Typography>
          <Box width={"80%"} pt="1em" maxHeight="50vh" overflow="auto">
            <FormControl sx={{ gap: "8px" }} color="info" fullWidth>
              <InputLabel id="chart-select">ChartType</InputLabel>
              <Select
                labelId="chart-select"
                value={chartType}
                label="ChartType"
                onChange={(e: SelectChangeEvent) => {
                  setChartType(e.target.value as ChartType);
                }}
              >
                {Object.keys(ChartType).map((v) => {
                  return (
                    <MenuItem key={v} value={v}>
                      {v}
                    </MenuItem>
                  );
                })}
              </Select>
              <ChartComponent
                setModalClose={() => {
                  setModalOpen(false);
                }}
                confirm={confirm}
              ></ChartComponent>
            </FormControl>
          </Box>
          <ButtonGroup fullWidth variant="contained">
            <Button
              color="info"
              onClick={() => {
                setConfirm(!confirm);
              }}
            >
              确定
            </Button>
            <Button
              onClick={() => {
                setModalOpen(false);
              }}
            >
              取消
            </Button>
          </ButtonGroup>
        </Stack>
      </Fade>
    </Modal>
  );
}
