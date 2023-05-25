import {
  AddRounded,
  BeachAccessRounded,
  BlurLinearRounded,
  ImageSearchRounded,
  SearchRounded,
  WorkRounded,
} from "@mui/icons-material";
import {
  Avatar,
  Button,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Switch,
  TextField,
  Tooltip,
} from "@mui/material";
import { blue, green, red } from "@mui/material/colors";
import { Box, Stack } from "@mui/system";
import { useSnackbar } from "notistack";
import {
  ChangeEvent,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { AppHeader } from "~/components/appHeader";
import { DispersedPicker } from "~/components/inputComponent/dispersedPicker";
import {
  GradientPicker,
  gradientStop,
} from "~/components/inputComponent/gradientPicker";
import { setHeaderToken, trpc } from "~/utils/trpc";
import { ct } from "../utils/const/anchorOrigin";
import { TokenContext } from "../_app";

export default function ColorPreSetting() {
  const trpcContext = trpc.useContext();
  const [currentColorID, setCurrentColorID] = useState<string>("");
  const tokenContext = useContext(TokenContext);
  const { enqueueSnackbar } = useSnackbar();
  const [isGradient, setIsGradient] = useState<boolean>(false);
  const [searchKey, setSearchKey] = useState<string>("");
  const [switchHeight, setSwitchHeight] = useState<number>(0);
  const [colorSet, setColorSet] = useState<
    { name: string; id: string; isGradient: boolean }[]
  >([]);
  const getColors = useCallback(async () => {
    try {
      if (tokenContext.token !== "") {
        setHeaderToken(tokenContext.token);
        const userInfo =
          await trpcContext.client.user.getColorPreSetByUserID.query();
        console.log(userInfo);

        setColorSet(userInfo.preset);
      }
    } catch (e) {
      console.log(e);
      enqueueSnackbar({
        message: "网络错误或尚未登录",
        variant: "warning",
        anchorOrigin: ct,
      });
    }
  }, [tokenContext.token]);
  useEffect(() => {
    getColors();
  }, [tokenContext.token]);
  const switchRef = useRef<HTMLLIElement | null>(null);
  useEffect(() => {
    if (switchRef.current) {
      setSwitchHeight(switchRef.current.getBoundingClientRect().height);
    }
  }, [switchHeight]);
  const changeGradient = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setIsGradient(event.target.checked);
  }, []);
  return (
    <>
      <Stack height="100vh">
        <AppHeader></AppHeader>
        <Box overflow="auto">
          <Grid height="100%" overflow="hidden" container>
            <Grid
              sx={{
                backgroundColor: "white",
                height: "100%",
                overflow: "auto",
              }}
              item
            >
              <List sx={{ pt: "0", position: "relative", width: "100%" }}>
                <ListItem
                  ref={switchRef}
                  sx={{
                    position: "sticky",
                    top: "0",
                    backgroundColor: "white",
                    zIndex: 1,
                  }}
                >
                  <ListItemIcon>
                    <BlurLinearRounded></BlurLinearRounded>
                  </ListItemIcon>
                  <ListItemText>
                    离散值
                    <Switch
                      sx={{
                        "& .Mui-checked": {
                          "& .MuiSwitch-track": {
                            backgroundColor: red["A700"],
                          },
                          "& .MuiSwitch-thumb": {
                            backgroundColor: red[500],
                          },
                        },
                        "& .MuiSwitch-track": {
                          backgroundColor: blue["A700"],
                        },
                        "& .MuiSwitch-thumb": {
                          backgroundColor: blue[500],
                        },
                      }}
                      value={isGradient}
                      onChange={changeGradient}
                    ></Switch>
                    插值
                  </ListItemText>
                </ListItem>
                <ListItem
                  sx={{
                    position: "sticky",
                    top: switchHeight,
                    backgroundColor: "white",
                    zIndex: 1,
                  }}
                >
                  <ListItemIcon>
                    <Tooltip arrow title="add ColorSet">
                      <AddRounded
                        sx={{
                          borderRadius: "50%",
                          color: "white",
                          cursor: "pointer",
                          background: "#66ccff content-box",
                        }}
                      />
                    </Tooltip>
                  </ListItemIcon>
                  <ListItemText>
                    <Stack direction="row">
                      <TextField
                        size="small"
                        color="info"
                        label="search"
                        value={searchKey}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                          setSearchKey(e.target.value);
                        }}
                      ></TextField>
                    </Stack>
                  </ListItemText>
                </ListItem>
                {colorSet
                  .filter((v) => {
                    return (
                      v.isGradient === isGradient &&
                      (v.name.includes(searchKey.trim()) ||
                        searchKey.trim() === "")
                    );
                  })
                  .map((v) => {
                    return (
                      <ListItemButton
                        onClick={() => {
                          setCurrentColorID(v.id);
                        }}
                        key={v.id}
                      >
                        <ListItemIcon>
                          <ImageSearchRounded />
                        </ListItemIcon>
                        <ListItemText primary={v.name} secondary={v.id} />
                      </ListItemButton>
                    );
                  })}
              </List>
            </Grid>
            <Grid overflow="auto" height="100%" item xs>
              {isGradient ? (
                <GradientPicker curretID={currentColorID}></GradientPicker>
              ) : (
                <DispersedPicker curretID={currentColorID}></DispersedPicker>
              )}
            </Grid>
          </Grid>
        </Box>
      </Stack>
    </>
  );
}
