import {
  Modal,
  Backdrop,
  Fade,
  Stack,
  Typography,
  Chip,
  ButtonGroup,
  Button,
} from "@mui/material";
import { DSVRowArray } from "d3";
import { Dispatch, SetStateAction, useState, useEffect } from "react";
import {
  DataTypeString,
  DataTypeStringArray,
  dataTypeColor,
} from "~/pages/utils/const/dataWorkers";
import { modalSX } from "~/pages/utils/types/const";

export function DataModal(prop: {
  setModalOpen: Dispatch<SetStateAction<boolean>>;
  modalOpen: boolean;
  setData: Dispatch<SetStateAction<DSVRowArray<string> | null>>;
  data: DSVRowArray<string> | null;
  setDataTypes: Dispatch<SetStateAction<DataTypeString[] | null>>;
  dataTypes: DataTypeString[] | null;
}) {
  const [tempTypes, setTempTypes] = useState<DataTypeString[]>([]);
  useEffect(() => {
    if (prop.dataTypes) setTempTypes([...prop.dataTypes]);
  }, [prop.dataTypes]);
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
        <Stack alignItems="center" sx={modalSX}>
          <Typography variant="h4" component="h2">
            字段属性
          </Typography>
          <Typography variant="caption">点击切换</Typography>
          <div style={{ width: "75%" }}>
            {prop.data && prop.dataTypes
              ? prop.data.columns.map((v, i) => {
                  return (
                    <Stack
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
          </div>
          <ButtonGroup>
            <Button
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
