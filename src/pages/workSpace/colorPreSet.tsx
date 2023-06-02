import {
  AddRounded,
  BlurLinearRounded,
  ColorizeRounded,
  ColorLensRounded,
  GradientRounded,
} from "@mui/icons-material";
import {
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Skeleton,
  Switch,
  TextField,
  Tooltip,
} from "@mui/material";
import { blue, red } from "@mui/material/colors";
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
import { GradientPicker } from "~/components/inputComponent/gradientPicker";
import { setHeaderToken, trpc } from "~/utils/trpc";
import { ct } from "../utils/const/anchorOrigin";
import { TokenContext } from "../_app";
import { useRouter } from "next/router";

export default function ColorPreSetting() {
  const trpcContext = trpc.useContext();
  const [loading, setLoading] = useState<boolean>(false);
  const [currentColorID, setCurrentColorID] = useState<string>("");
  const tokenContext = useContext(TokenContext);
  const { enqueueSnackbar } = useSnackbar();
  const [isGradient, setIsGradient] = useState<boolean>(false);
  const [searchKey, setSearchKey] = useState<string>("");
  const [switchHeight, setSwitchHeight] = useState<number>(0);
  const [colorSet, setColorSet] = useState<
    { name: string; id: string; isGradient: boolean }[]
  >([]);
  useEffect(() => {
    async function initByID() {
      const search = new URLSearchParams(window.location.search);
      if (search.has("id")) {
        const id = search.get("id") as string;
        const c = await trpcContext.client.user.getColorByID.query(id);
        if (c.positions.length !== 0) {
          console.log(123);
          setIsGradient(true);
        }
        setCurrentColorID(id);
      }
    }
    initByID();
  }, []);
  const getColors = useCallback(async () => {
    try {
      setLoading(true);
      if (tokenContext.token !== "") {
        setHeaderToken(tokenContext.token);
        const userInfo =
          await trpcContext.client.user.getColorPreSetByUserID.query();
        setColorSet(userInfo.preset);
      }
    } catch (e) {
      enqueueSnackbar({
        message: "网络错误或尚未登录，请刷新",
        variant: "warning",
        anchorOrigin: ct,
      });
    } finally {
      setLoading(false);
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
    setCurrentColorID("");
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
                        onClick={() => {
                          setCurrentColorID("");
                        }}
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
                {!loading ? (
                  colorSet
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
                            {v.id === currentColorID ? (
                              <ColorizeRounded color="success"></ColorizeRounded>
                            ) : isGradient ? (
                              <GradientRounded color="info" />
                            ) : (
                              <ColorLensRounded color="info" />
                            )}
                          </ListItemIcon>
                          <ListItemText primary={v.name} secondary={v.id} />
                        </ListItemButton>
                      );
                    })
                ) : (
                  <>
                    {new Array(5).fill(1).map((v, i) => {
                      return (
                        <ListItemButton key={i}>
                          <ListItemIcon>
                            <Skeleton
                              variant="circular"
                              width={20}
                              height={20}
                            />
                          </ListItemIcon>
                          <ListItemText primary={<Skeleton />} />
                        </ListItemButton>
                      );
                    })}
                  </>
                )}
              </List>
            </Grid>
            <Grid overflow="auto" height="100%" item xs>
              {isGradient ? (
                <GradientPicker
                  currentID={currentColorID}
                  setCurrentID={(id: string) => {
                    setCurrentColorID(id);
                    getColors();
                  }}
                ></GradientPicker>
              ) : (
                <DispersedPicker
                  currentID={currentColorID}
                  setCurrentID={(id: string) => {
                    setCurrentColorID(id);
                    getColors();
                  }}
                ></DispersedPicker>
              )}
            </Grid>
          </Grid>
        </Box>
      </Stack>
    </>
  );
}
