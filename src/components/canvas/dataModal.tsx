import {
  Modal,
  Backdrop,
  Fade,
  Stack,
  Typography,
  Chip,
  ButtonGroup,
  Button,
  Box,
} from "@mui/material";
import {
  Dispatch,
  SetStateAction,
  useState,
  useEffect,
  useContext,
} from "react";
import {
  DataTypeString,
  DataTypeStringArray,
  dataTypeColor,
} from "~/pages/utils/const/dataWorkers";
import { modalSX } from "~/pages/utils/types/const";
import { DataContext } from "~/pages/workSpace";
import { useSnackbar } from "notistack";
import { lb } from "~/pages/utils/const/anchorOrigin";

export function DataModal(prop: {
  setModalOpen: Dispatch<SetStateAction<boolean>>;
  modalOpen: boolean;
}) {
  const { enqueueSnackbar } = useSnackbar();
  const { dataTypes, data, setData, setDataTypes } = useContext(DataContext);
  const [tempTypes, setTempTypes] = useState<DataTypeString[]>([]);
  useEffect(() => {
    if (dataTypes) setTempTypes([...dataTypes]);
  }, [dataTypes]);
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
        return;
      }}
    >
      <Fade in={prop.modalOpen}>
        <Stack gap={1} alignItems="center" sx={modalSX}>
          <Typography variant="h4" component="h2">
            字段属性
          </Typography>
          <Typography variant="caption">点击切换</Typography>
          <Box sx={{ width: "75%", maxHeight: "30vh", overflow: "auto" }}>
            {data && dataTypes
              ? data.columns.map((v, i) => {
                  return (
                    <Stack
                      key={v}
                      alignItems="center"
                      mb={1}
                      justifyContent="space-between"
                      flexDirection="row"
                    >
                      <Typography variant="caption">{v}</Typography>
                      <Chip
                        onClick={() => {
                          let nowType = tempTypes[i];
                          if (nowType !== undefined) {
                            let index = DataTypeStringArray.indexOf(nowType);
                            tempTypes[i] =
                              index === -1
                                ? "string"
                                : (DataTypeStringArray[
                                    (index + 1) % DataTypeStringArray.length
                                  ] as DataTypeString);
                            setTempTypes([...tempTypes]);
                          }
                        }}
                        variant="outlined"
                        sx={{ ml: 2 }}
                        label={tempTypes[i]}
                        color={dataTypeColor[tempTypes[i] || "string"]}
                      ></Chip>
                    </Stack>
                  );
                })
              : null}
          </Box>
          <ButtonGroup>
            <Button
              color="info"
              variant="contained"
              onClick={() => {
                if (!setDataTypes) {
                  enqueueSnackbar({
                    message: "服务繁忙，请稍后",
                    variant: "warning",
                    anchorOrigin: lb,
                  });
                  return;
                }
                setDataTypes(tempTypes);
                prop.setModalOpen(false);
              }}
            >
              确认
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                prop.setModalOpen(false);
              }}
            >
              关闭
            </Button>
          </ButtonGroup>
        </Stack>
      </Fade>
    </Modal>
  );
}
