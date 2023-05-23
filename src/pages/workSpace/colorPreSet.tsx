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
import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import { AppHeader } from "~/components/appHeader";
import { DispersedPicker } from "~/components/inputComponent/dispersedPicker";
import { GradientPicker } from "~/components/inputComponent/gradientPicker";

export default function ColorPreSetting() {
  const [isGradient, setIsGradient] = useState<boolean>(false);
  const [searchKey, setSearchKey] = useState<string>("");
  const [switchHeight, setSwitchHeight] = useState<number>(0);
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
                {new Array(20).fill(1).map((v, i) => {
                  return (
                    <ListItemButton key={i}>
                      <ListItemIcon>
                        <ImageSearchRounded />
                      </ListItemIcon>
                      <ListItemText primary="Photos" secondary="Jan 9, 2014" />
                    </ListItemButton>
                  );
                })}
              </List>
            </Grid>
            <Grid overflow="auto" height="100%" item xs>
              {isGradient ? (
                <GradientPicker></GradientPicker>
              ) : (
                <DispersedPicker></DispersedPicker>
              )}
            </Grid>
          </Grid>
        </Box>
      </Stack>
    </>
  );
}
