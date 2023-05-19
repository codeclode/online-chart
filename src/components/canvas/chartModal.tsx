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
} from "@mui/material";
import { ChartType } from "@prisma/client";
import { Dispatch, SetStateAction, useState } from "react";
import { modalSX } from "~/pages/utils/types/const";
import { ChartDetail } from "~/utils/charts/generator/util";

export function ChartModal(prop: {
  setModalOpen: Dispatch<SetStateAction<boolean>>;
  modalOpen: boolean;
}) {
  const [confirm, setConfirm] = useState<boolean>(false);
  const [info, setInfo] = useState<{
    width: number;
    height: number;
    chartType: ChartType;
    data: any;
  }>({
    width: 100,
    height: 100,
    chartType: "PIE",
    data: null,
  });
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
          <FormControl
            sx={{ gap: "8px", maxHeight: "30vh", p: "15px", overflow: "auto" }}
            color="info"
            fullWidth
          >
            <InputLabel id="demo-simple-select-label">ChartType</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              value={info.chartType}
              label="ChartType"
              onChange={(e: SelectChangeEvent) => {
                let newInfo = {
                  ...info,
                  chartType: e.target.value as ChartType,
                };
                setInfo(newInfo);
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
            {ChartDetail[info.chartType]({
              confirm: confirm,
              setModalClose: () => {
                setModalOpen(false);
              },
            })}
          </FormControl>
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
