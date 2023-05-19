import {
  AddRounded,
  DatasetOutlined,
  ExpandLess,
  ExpandMore,
  InboxRounded,
  SettingsOutlined,
  StarBorder,
} from "@mui/icons-material";
import {
  Button,
  ButtonGroup,
  Collapse,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Skeleton,
  TextField,
  Theme,
  SxProps,
  Typography,
  Chip,
} from "@mui/material";
import { blue } from "@mui/material/colors";
import { Box, Stack } from "@mui/system";
import { DSVRowArray, gray } from "d3";
import { useSnackbar } from "notistack";
import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { ct, lb } from "~/pages/utils/const/anchorOrigin";
import {
  DataType,
  dataTypeColor,
  DataTypeString,
  workers,
} from "~/pages/utils/const/dataWorkers";
import { supportFileExt } from "~/pages/utils/const/others";
import { CSV2Data, getFileExt } from "~/pages/utils/dataTransformer";
import { textOver } from "~/pages/utils/styleFactory";
import { DataContext } from "~/pages/workSpace";
const ListTextSx: SxProps<Theme> = {
  "& .MuiListItemText-primary": {
    fontSize: "0.6em",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    overflow: "hidden",
    wordBreak: "break-all",
    wordWrap: "break-word",
  },
};

function ColumnItem(prop: {
  name: string;
  open: boolean | undefined;
  changeOpen: () => void;
  columnType: DataTypeString | undefined;
}) {
  return (
    <>
      <ListItemButton
        sx={{
          "& .css-cveggr-MuiListItemIcon-root": {
            minWidth: "0",
            mr: "0.5em",
          },
        }}
        onClick={prop.changeOpen}
      >
        <ListItemIcon>
          <InboxRounded />
        </ListItemIcon>
        <ListItemText sx={ListTextSx}>{prop.name}</ListItemText>
        <Chip
          sx={{
            "&:hover": {
              cursor: "pointer",
            },
          }}
          color={prop.columnType ? dataTypeColor[prop.columnType] : "default"}
          variant="outlined"
          size="small"
          label={prop.columnType}
        ></Chip>
      </ListItemButton>
      <Collapse
        sx={{
          "& .css-cveggr-MuiListItemIcon-root": {
            minWidth: "0",
            mr: "0.5em",
          },
        }}
        in={prop.open}
        timeout="auto"
        unmountOnExit
      >
        <List component="div" disablePadding>
          {workers.map((worker) => {
            return prop.columnType !== undefined &&
              worker.limitTypes.includes(prop.columnType) ? (
              <ListItemButton key={worker.name} sx={{ pl: 4 }}>
                <ListItemIcon>
                  <worker.icon />
                </ListItemIcon>
                <ListItemText sx={ListTextSx}>{worker.name}</ListItemText>
              </ListItemButton>
            ) : null;
          })}
        </List>
      </Collapse>
    </>
  );
}

export function FileInput(prop: { headerHeight: number }) {
  const { enqueueSnackbar } = useSnackbar();
  const dataContext = useContext(DataContext);
  const { data, dataTypes, setData, setDataTypes } = dataContext;
  const fileRef = useRef<null | HTMLInputElement>(null);
  const fileInputRef = useRef<null | HTMLInputElement>(null);
  const [fileName, setFileName] = useState("");
  const [fileInputHeight, setFileInputHeight] = useState(200);
  const [opens, setOpens] = useState<Array<boolean>>([]);
  const [searchKeyWord, setSearchKeyWord] = useState("");
  useEffect(() => {
    if (data) {
      setOpens(new Array(data.columns.length).fill(false));
    } else {
      setOpens([]);
    }
  }, [data]);
  useEffect(() => {
    if (fileInputRef.current)
      setFileInputHeight(fileInputRef.current.getBoundingClientRect().height);
  }, [fileInputRef.current]);
  const fileInputHandler = useCallback(async () => {
    if (!setData || !setDataTypes) return;
    if (fileRef.current && fileRef.current.files && fileRef.current.files[0]) {
      let file = fileRef.current.files[0];
      let fileContent = null;
      let ext = getFileExt(file.name);
      setFileName(file.name);
      try {
        switch (ext) {
          case "csv": {
            fileContent = await CSV2Data(file);
            setData(fileContent);
            let tempTypes: DataTypeString[] = [];
            setDataTypes(
              fileContent.columns.map((v, i) => {
                return "string";
              })
            );
            break;
          }
          default: {
            enqueueSnackbar({
              message: "不支持的文件类型",
              variant: "error",
              anchorOrigin: lb,
            });
            setFileName("");
            return;
          }
        }
      } catch (e) {
        enqueueSnackbar({
          message: "读取文件出错",
          variant: "error",
          anchorOrigin: ct,
        });
      }
    } else {
      enqueueSnackbar({
        message: "系统准备中。。。",
        variant: "warning",
        anchorOrigin: ct,
      });
    }
  }, [setData, setDataTypes]);
  return (
    <>
      <Stack justifyContent="space-around">
        <Box
          ref={fileInputRef}
          sx={{
            border: "1px solid " + blue[100],
            borderRadius: "10px",
            transition: "0.3s all ease",
            height: "150px",
            width: "200px",
            "&:hover": {
              cursor: "pointer",
              boxShadow: "inset 0 0 10px 4px " + blue[100],
            },
          }}
          onClick={() => {
            !fileRef.current ? null : fileRef.current.click();
          }}
        >
          <Stack
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            height="100%"
          >
            {!fileName ? (
              <AddRounded
                sx={{
                  fontSize: "64px",
                }}
                color="info"
              ></AddRounded>
            ) : (
              <DatasetOutlined
                sx={{
                  fontSize: "64px",
                }}
                color="info"
              ></DatasetOutlined>
            )}
            <Typography sx={{ ...textOver(2) }} variant="h5">
              {fileName ? fileName : "选择文件"}
            </Typography>
          </Stack>
        </Box>
        <Box
          sx={{
            border: "1px solid " + blue[200],
            borderRadius: "10px",
            boxSizing: "border-box",
            width: "200px",
            bgcolor: "background.paper",
            position: "relative",
            overflow: "auto",
            mt: "15px",
            height: `calc(100vh - ${
              prop.headerHeight + fileInputHeight + 65
            }px)`,
          }}
        >
          {data && dataTypes ? (
            <List
              sx={{
                "& ul": { padding: 0 },
              }}
              subheader={
                <ListSubheader component="div">
                  <Typography variant="subtitle1">字段</Typography>
                  <TextField
                    value={searchKeyWord}
                    onInput={(e: ChangeEvent<HTMLInputElement>) => {
                      setSearchKeyWord(e.target.value.trim());
                    }}
                    color="info"
                    placeholder="检索字段"
                    size="small"
                  ></TextField>
                </ListSubheader>
              }
            >
              {data.columns.map((v, i) => {
                return v.toUpperCase().includes(searchKeyWord.toUpperCase()) ||
                  searchKeyWord == "" ? (
                  <ColumnItem
                    key={v}
                    name={v}
                    columnType={dataTypes![i]}
                    open={opens[i]}
                    changeOpen={() => {
                      setOpens(
                        opens.map((v, j) => {
                          return i === j ? !v : v;
                        })
                      );
                    }}
                  ></ColumnItem>
                ) : null;
              })}
            </List>
          ) : (
            <Stack
              p="15px"
              justifyContent="center"
              alignItems="center"
              flexDirection="column"
            >
              <Skeleton
                sx={{
                  width: "80px",
                  height: "80px",
                }}
                animation="wave"
                variant="circular"
              />
              <Skeleton width="95%" height="30px" animation="wave" />
              <Skeleton
                width="95%"
                height="30px"
                animation="wave"
                variant="rectangular"
              />
              <Typography variant="subtitle2">
                Waiting for your data...
              </Typography>
            </Stack>
          )}
        </Box>
      </Stack>
      <input
        type="file"
        accept={supportFileExt}
        hidden
        ref={fileRef}
        onInput={fileInputHandler}
      ></input>
    </>
  );
}
